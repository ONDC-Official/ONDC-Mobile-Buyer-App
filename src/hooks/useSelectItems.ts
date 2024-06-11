import uuid from 'react-native-uuid';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {constructQuoteObject, showToastWithGravity} from '../utils/utils';
import {SSE_TIMEOUT} from '../utils/constants';
import {
  API_BASE_URL,
  CART,
  EVENTS,
  ON_SELECT,
  SELECT,
} from '../utils/apiActions';
import {setStoredData} from '../utils/storage';
import useNetworkHandling from './useNetworkHandling';
import {updateCartItems} from '../redux/cart/actions';
import {updateTransactionId} from '../redux/auth/actions';

const CancelToken = axios.CancelToken;

export default (openFulfillmentSheet: () => void) => {
  const {t} = useTranslation();
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const dispatch = useDispatch();
  const source = useRef<any>(null);
  const address = useRef<any>(null);
  const {token, uid, transaction_id} = useSelector(
    ({authReducer}) => authReducer,
  );
  const navigation = useNavigation<StackNavigationProp<any>>();
  const responseRef = useRef<any[]>([]);
  const eventTimeOutRef = useRef<any[]>([]);
  const updatedCartItems = useRef<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedItemsForInit, setSelectedItemsForInit] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<any>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [haveDistinctProviders, setHaveDistinctProviders] =
    useState<boolean>(false);
  const [
    isProductAvailableQuantityIsZero,
    setIsProductAvailableQuantityIsZero,
  ] = useState(false);
  const [isProductCategoryIsDifferent, setIsProductCategoryIsDifferent] =
    useState(false);

  const checkDistinctProviders = (items: any[]) => {
    if (items.length < 2) {
      setHaveDistinctProviders(false);
    } else {
      const firstProvider = items[0].item.provider.id;
      const everyEnvHasSameValue = items.every(
        (item: any) => item.item.provider.id === firstProvider,
      );
      setHaveDistinctProviders(!everyEnvHasSameValue);
    }
  };

  const checkAvailableQuantity = (items: any[]) => {
    let quantityIsZero = false;
    items.forEach((item: any) => {
      const availableQuantity = item?.item?.product?.quantity?.available;
      if (availableQuantity && availableQuantity?.count === 0) {
        quantityIsZero = true;
      }
    });
    setIsProductAvailableQuantityIsZero(quantityIsZero);
  };

  const checkDifferentCategory = (items: any[]) => {
    const everyEnvHasSameValue = items.every(
      (item: any) => item.item.domain === items[0].item.domain,
    );
    setIsProductCategoryIsDifferent(!everyEnvHasSameValue);
  };

  const checkCartItemStatus = (items: any[]) => {
    checkDistinctProviders(items);
    checkAvailableQuantity(items);
    checkDifferentCategory(items);
  };

  const getCartItems = async () => {
    try {
      setLoading(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CART}/${uid}`,
        source.current.token,
      );
      setCartItems(data);
      dispatch(updateCartItems(data));
      updatedCartItems.current = data;
    } catch (error) {
      console.log('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProviderIds = async (qoute: any[]) => {
    let providers: any[] = [];
    qoute.forEach(item => {
      providers.push(item.provider.local_id);
    });
    const ids = [...new Set(providers)];
    await setStoredData('providerIds', JSON.stringify(ids));
    return ids;
  };

  const getQuote = async (items: any[]) => {
    responseRef.current = [];
    if (address.current) {
      try {
        let domain: string = '';
        let contextCity: string = '';
        const updatedItems: any[] = items.map(item => {
          const newItem = Object.assign({}, item);
          domain = newItem.domain;
          contextCity = newItem.contextCity;
          delete newItem.context;
          delete newItem.contextCity;
          return newItem;
        });
        if (contextCity === '') {
          contextCity = address.current.address.city;
        }

        let selectPayload: any = {
          context: {
            transaction_id,
            domain,
            pincode: address.current.address.areaCode,
            city: contextCity || address.current.address.city,
            state: address.current.address.state,
          },
          message: {
            cart: {
              items: updatedItems,
            },
            fulfillments: [
              {
                end: {
                  location: {
                    gps: `${address.current?.address?.lat},${address.current?.address?.lng}`,
                    address: {
                      area_code: `${address.current?.address?.areaCode}`,
                    },
                  },
                },
              },
            ],
          },
        };
        source.current = CancelToken.source();
        const {data} = await postDataWithAuth(
          `${API_BASE_URL}${SELECT}`,
          [selectPayload],
          source.current.token,
        );
        await setStoredData('contextCity', contextCity);
        //Error handling workflow eg, NACK
        const isNACK = data.find(
          (item: any) => item.error && item?.message?.ack?.status === 'NACK',
        );
        if (isNACK) {
          setCheckoutLoading(false);
          showToastWithGravity(isNACK.error.message);
        } else {
          // fetch through events
          onFetchQuote(
            data?.map((txn: any) => {
              const {context} = txn;
              return context?.message_id;
            }),
          );
        }
      } catch (err: any) {
        console.log(err);
        showToastWithGravity(err?.response?.data?.error?.message);
        navigation.navigate('Dashboard');
        setCheckoutLoading(false);
      }
    } else {
      showToastWithGravity(t('Global.Please select address'));
      setCheckoutLoading(false);
    }
  };

  const updateSelectedItemsForInit = () => {
    const newItems = selectedItems[0]?.message?.quote.items;
    updatedCartItems.current.forEach(one => {
      const updatedItem = newItems.find(
        (newItem: any) => newItem.id === one.item.local_id,
      );
      one.item.fulfillment_id = updatedItem?.fulfillment_id;
    });
  };

  const navigateToDashboard = async () => {
    const transactionId: any = uuid.v4();
    await setStoredData('transaction_id', transactionId);
    dispatch(updateTransactionId(transactionId));
    setCheckoutLoading(false);
    showToastWithGravity(
      t('Global.Cannot fetch details for this product. Please try again'),
    );
    navigation.navigate('Dashboard');
  };

  const onFetchQuote = (messageIds: any[]) => {
    eventTimeOutRef.current = messageIds.map(messageId => {
      const eventSource = new RNEventSource(
        `${API_BASE_URL}${EVENTS}${messageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      eventSource.addEventListener('on_select', (event: any) => {
        const data = JSON.parse(event.data);
        onGetQuote(data.messageId)
          .then(() => {})
          .catch(error => {
            console.log(error);
          });
      });

      const timer = setTimeout(() => {
        eventTimeOutRef.current.forEach(eventTimeout => {
          eventTimeout.eventSource.close();
          clearTimeout(eventTimeout.timer);
        });
        if (responseRef.current.length <= 0) {
          navigateToDashboard().then(() => {});
        }
        const request_object = constructQuoteObject(cartItems);
        if (responseRef.current.length !== request_object.length) {
          showToastWithGravity(
            t(
              'Global.Cannot fetch details for some product, those products will be ignored',
            ),
          );
        }
      }, SSE_TIMEOUT);

      return {
        eventSource,
        timer,
      };
    });
  };

  const onGetQuote = async (messageId: any) => {
    try {
      setCheckoutLoading(true);
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ON_SELECT}${messageId}`,
        source.current.token,
      );
      responseRef.current = [...responseRef.current, data[0]];

      setEventData([...eventData, data[0]]);

      data[0].message.quote.items.forEach((item: any) => {
        const findItemIndexFromCart = updatedCartItems.current.findIndex(
          (prod: any) => prod.item.product.id === item.id,
        );
        if (findItemIndexFromCart > -1) {
          updatedCartItems.current[
            findItemIndexFromCart
          ].item.product.fulfillment_id = item.fulfillment_id;
          updatedCartItems.current[
            findItemIndexFromCart
          ].item.product.fulfillments = data[0].message.quote.fulfillments;
        }
      });
      setSelectedItemsForInit(updatedCartItems.current.concat([]));
      setSelectedItems(responseRef.current.concat([]));
      openFulfillmentSheet();
    } catch (err: any) {
      showToastWithGravity(err?.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const onCheckoutFromCart = async (currentAddress: any) => {
    setCheckoutLoading(true);
    address.current = currentAddress;
    if (cartItems.length > 0) {
      let items = cartItems.map((item: any) => item.item);
      const quote = constructQuoteObject(items);
      await getQuote(quote[0]);
      await getProviderIds(quote[0]);
    }
  };

  useEffect(() => {
    checkCartItemStatus(cartItems);
  }, [cartItems]);

  useEffect(() => {
    return () => {
      source?.current?.cancel();
      eventTimeOutRef.current.forEach(eventTimeout => {
        eventTimeout.eventSource.close();
        clearTimeout(eventTimeout.timer);
      });
    };
  }, []);

  return {
    loading,
    cartItems,
    checkoutLoading,
    getCartItems,
    onCheckoutFromCart,
    haveDistinctProviders,
    isProductAvailableQuantityIsZero,
    isProductCategoryIsDifferent,
    setCartItems,
    selectedItems,
    setSelectedItems,
    selectedItemsForInit,
    setSelectedItemsForInit,
    updateSelectedItemsForInit,
  };
};
