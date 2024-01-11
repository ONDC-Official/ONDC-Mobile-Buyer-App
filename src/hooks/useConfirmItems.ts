import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getStoredData, removeData} from '../utils/storage';
import {ORDER_PAYMENT_METHODS, SSE_TIMEOUT} from '../utils/constants';
import {
  API_BASE_URL,
  CONFIRM_ORDER,
  EVENTS,
  ON_CONFIRM,
} from '../utils/apiActions';
import {constructQuoteObject, showToastWithGravity} from '../utils/utils';
import useNetworkHandling from './useNetworkHandling';
import useNetworkErrorHandling from './useNetworkErrorHandling';

const CancelToken = axios.CancelToken;
export default (closePaymentSheet: () => void) => {
  const navigation = useNavigation<any>();
  const responseRef = useRef<any[]>([]);
  const source = useRef<any>(null);
  const eventTimeOutRef = useRef<any[]>([]);
  const {token} = useSelector(({authReducer}) => authReducer);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [deliveryAddress, setDeliveryAddress] = useState<any>(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState<string>('');
  const [confirmOrderLoading, setConfirmOrderLoading] =
    useState<boolean>(false);
  const [eventData, setEventData] = useState<any[]>([]);
  const confirmCartItems = useRef<any[]>([]);

  const getItemProviderId = async (item: any) => {
    const providersString = await getStoredData('providerIds');
    const providers = providersString ? JSON.parse(providersString) : [];
    let provider: any = {};
    if (providers.includes(item.provider.local_id)) {
      provider = {
        id: item.provider.local_id,
        locations: item.provider.locations.map(
          (location: any) => location.local_id,
        ),
      };
    }
    return provider;
  };

  // on confirm order Api
  const onConfirmOrder = async (messageId: any) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ON_CONFIRM}${messageId}`,
        source.current.token,
      );
      responseRef.current = [...responseRef.current, data[0]];
      setEventData([...eventData, data[0]]);
    } catch (err: any) {
      showToastWithGravity(err?.response?.data?.error?.message);
      setConfirmOrderLoading(false);
      handleApiError(err);
    }
  };

  const onConfirm = (messageIds: any[]) => {
    eventTimeOutRef.current = messageIds.map(messageId => {
      const eventSource = new RNEventSource(
        `${API_BASE_URL}${EVENTS}${messageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      eventSource.addEventListener('on_confirm', (event: any) => {
        const data = JSON.parse(event.data);
        onConfirmOrder(data.messageId)
          .then(() => {})
          .catch((error: any) => {
            console.error(error);
          });
      });

      const timer = setTimeout(() => {
        eventTimeOutRef.current.forEach(eventTimeout => {
          eventTimeout.eventSource.close();
          clearTimeout(eventTimeout.timer);
        });
        if (responseRef.current.length <= 0) {
          setConfirmOrderLoading(false);
          showToastWithGravity(
            'Cannot fetch details for this product Please try again!',
          );
          return;
        }
      }, SSE_TIMEOUT);

      return {
        eventSource,
        timer,
      };
    });
  };

  const confirmOrder = async (items: any[], method: string, payment: any) => {
    responseRef.current = [];
    const parentTransactionIdMap = await getStoredData(
      'parent_and_transaction_id_map',
    );
    const parentOrderIDMap: any = new Map(
      JSON.parse(parentTransactionIdMap || '{}'),
    );
    const checkoutDetails = await getStoredData('checkout_details');
    const {productQuotes: productQuotesForCheckout} = JSON.parse(
      checkoutDetails || '{}',
    );
    try {
      const item = items[0];
      const queryParams = [
        {
          context: {
            domain: item.domain,
            city: deliveryAddress.address.city,
            state: deliveryAddress.address.state,
            parent_order_id: parentOrderIDMap.get(item?.provider?.id)
              .parent_order_id,
            transaction_id: parentOrderIDMap.get(item?.provider?.id)
              .transaction_id,
          },
          message: {
            payment: {
              ...payment,
              paid_amount: Number(productQuotesForCheckout[0]?.price?.value),
              type:
                method === ORDER_PAYMENT_METHODS.COD
                  ? 'ON-FULFILLMENT'
                  : 'ON-ORDER',
              transaction_id: parentOrderIDMap.get(item?.provider?.id)
                .transaction_id,
              paymentGatewayEnabled: false, //TODO: we send false for, if we enabled jusPay the we will handle.
            },
            quote: {
              ...productQuotesForCheckout[0],
              price: {
                currency: productQuotesForCheckout[0].price.currency,
                value: String(productQuotesForCheckout[0].price.value),
              },
            },
            providers: await getItemProviderId(item),
          },
        },
      ];

      source.current = CancelToken.source();
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${CONFIRM_ORDER}`,
        queryParams,
        source.current.token,
      );
      const isNACK = data.find((one: any) => one.error && one.code !== '');
      if (isNACK) {
        showToastWithGravity(isNACK.error.message);
        setConfirmOrderLoading(false);
      } else {
        onConfirm(data?.map((txn: any) => txn?.context?.message_id));
      }
    } catch (err: any) {
      showToastWithGravity(err?.response?.data?.error?.message);
      setConfirmOrderLoading(false);
      handleApiError(err);
    }
  };

  const handleConfirmOrder = async (
    cartItems: any[],
    updatedCartItems: any[],
  ) => {
    try {
      if (activePaymentMethod) {
        confirmCartItems.current = cartItems.concat([]);
        const checkoutDetails = await getStoredData('checkout_details');
        const {successOrderIds} = JSON.parse(checkoutDetails || '{}');
        setConfirmOrderLoading(true);
        let items = cartItems.map((item: any) => item.item);
        const request_object = constructQuoteObject(
          items.filter(({provider}: {provider: any}) =>
            successOrderIds.includes(provider.local_id.toString()),
          ),
        );
        if (activePaymentMethod === ORDER_PAYMENT_METHODS.JUSPAY) {
          await confirmOrder(
            request_object[0],
            ORDER_PAYMENT_METHODS.JUSPAY,
            updatedCartItems[0].message.quote.payment,
          );
        } else {
          await confirmOrder(
            request_object[0],
            ORDER_PAYMENT_METHODS.COD,
            updatedCartItems[0].message.quote.payment,
          );
        }
      } else {
        showToastWithGravity('Please select payment.');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const clearDataAndNavigate = async () => {
    if (responseRef.current.length > 0) {
      const checkoutDetails = await getStoredData('checkout_details');
      // fetch request object length and compare it with the response length
      const {successOrderIds} = JSON.parse(checkoutDetails || '{}');
      let items = confirmCartItems.current.map((item: any) => item.item);
      const requestObject = constructQuoteObject(
        items.filter(({provider}: {provider: any}) =>
          successOrderIds.includes(provider.local_id.toString()),
        ),
      );
      if (responseRef.current.length === requestObject.length) {
        await removeData('transaction_id');
        await removeData('parent_order_id');
        await removeData('checkout_details');
        await removeData('parent_and_transaction_id_map');
        closePaymentSheet();
        navigation.navigate('OrderDetails', {
          orderId: responseRef.current[0].message?.order?.id,
        });
      }
      setConfirmOrderLoading(false);
    }
  };

  useEffect(() => {
    clearDataAndNavigate().then(() => {});
  }, [eventData]);

  return {
    confirmOrderLoading,
    setConfirmOrderLoading,
    handleConfirmOrder,
    deliveryAddress,
    setDeliveryAddress,
    activePaymentMethod,
    setActivePaymentMethod,
  };
};
