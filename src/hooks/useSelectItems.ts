import uuid from 'react-native-uuid';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {constructQuoteObject, showToastWithGravity} from '../utils/utils';
import {SSE_TIMEOUT} from '../utils/constants';
import {API_BASE_URL} from '../utils/apiActions';
import {setStoredData} from '../utils/storage';
import useNetworkHandling from './useNetworkHandling';

const CancelToken = axios.CancelToken;

export default (navigate: boolean = true) => {
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const source = useRef<any>(null);
  const {token, uid} = useSelector(({authReducer}) => authReducer);
  const {address} = useSelector(({addressReducer}) => addressReducer);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const responseRef = useRef<any[]>([]);
  const eventTimeOutRef = useRef<any[]>([]);
  const updatedCartItems = useRef<any[]>([]);
  const [eventData, setEventData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(navigate);
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
      const url = `${API_BASE_URL}/clientApis/v2/cart/${uid}`;
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(url, source.current.token);
      setCartItems(data);
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
    const transactionId: any = uuid.v4();
    await setStoredData('transaction_id', transactionId);
    responseRef.current = [];
    setCheckoutLoading(true);
    if (address) {
      try {
        let domain = '';
        let contextCity = '';
        const updatedItems = items.map(item => {
          domain = item.domain;
          contextCity = item.contextCity;
          delete item.context;
          delete item.contextCity;
          return item;
        });
        let selectPayload = {
          context: {
            transaction_id: transactionId,
            domain: domain,
            city: contextCity || address.address.city,
            state: address.address.state,
          },
          message: {
            cart: {
              items: updatedItems,
            },
            fulfillments: [
              {
                end: {
                  location: {
                    gps: `${address?.address?.lat},${address?.address?.lng}`,
                    address: {
                      area_code: `${address?.address?.areaCode}`,
                    },
                  },
                },
              },
            ],
          },
        };
        source.current = CancelToken.source();
        const {data} = await postDataWithAuth(
          `${API_BASE_URL}/clientApis/v2/select`,
          [selectPayload],
          source.current.token,
        );
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
      showToastWithGravity('Please select address');
      setCheckoutLoading(false);
    }
  };

  const onFetchQuote = (messageIds: any[]) => {
    eventTimeOutRef.current = messageIds.map(messageId => {
      const eventSource = new RNEventSource(
        `${API_BASE_URL}/clientApis/events/v2?messageId=${messageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      eventSource.addEventListener('on_select', (event: any) => {
        const data = JSON.parse(event.data);
        onGetQuote(data.messageId)
          .then(() => {})
          .catch(error => {
            console.error(error);
          });
      });

      const timer = setTimeout(() => {
        eventTimeOutRef.current.forEach(eventTimeout => {
          eventTimeout.eventSource.close();
          clearTimeout(eventTimeout.timer);
        });
        if (responseRef.current.length <= 0) {
          setCheckoutLoading(false);
          showToastWithGravity('Cannot fetch details for this product');
          navigation.navigate('Dashboard');
          return;
        }
        const request_object = constructQuoteObject(cartItems);
        if (responseRef.current.length !== request_object.length) {
          showToastWithGravity(
            'Cannot fetch details for some product those products will be ignored!',
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
        `${API_BASE_URL}/clientApis/v2/on_select?messageIds=${messageId}`,
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
      await setStoredData(
        'cartItems',
        JSON.stringify(updatedCartItems.current),
      );
      await setStoredData(
        'updatedCartItems',
        JSON.stringify(responseRef.current),
      );
      if (navigate) {
        navigation.navigate('Checkout');
      }
    } catch (err: any) {
      showToastWithGravity(err?.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const onCheckoutFromCart = async () => {
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
  };
};
