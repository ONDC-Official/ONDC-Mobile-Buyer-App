import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import uuid from 'react-native-uuid';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import {useTranslation} from 'react-i18next';
import {getStoredData, removeData, setStoredData} from '../utils/storage';
import {ORDER_PAYMENT_METHODS, SSE_TIMEOUT} from '../utils/constants';
import {
  API_BASE_URL,
  CONFIRM_ORDER,
  CREATE_PAYMENT,
  EVENTS,
  ON_CONFIRM,
  RAZORPAY_KEYS,
  VERIFY_PAYMENT,
} from '../utils/apiActions';
import {constructQuoteObject, showToastWithGravity} from '../utils/utils';
import useNetworkHandling from './useNetworkHandling';
import useNetworkErrorHandling from './useNetworkErrorHandling';
import {setTransactionId} from '../toolkit/reducer/auth';
import {clearCart} from '../toolkit/reducer/cart';

const CancelToken = axios.CancelToken;
export default (closePaymentSheet: () => void) => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const responseRef = useRef<any[]>([]);
  const source = useRef<any>(null);
  const eventTimeOutRef = useRef<any[]>([]);
  const {token} = useSelector(({auth}) => auth);
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
            console.log(error);
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
            t('Global.Cannot fetch details for this product. Please try again'),
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
      const contextCity = await getStoredData('contextCity');
      const queryParams: any = [
        {
          context: {
            domain: item.domain,
            city: contextCity || deliveryAddress.address.city,
            state: deliveryAddress.address.state,
            pincode: deliveryAddress.address.areaCode,
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
              paymentGatewayEnabled: false,
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

      if (method === ORDER_PAYMENT_METHODS.PREPAID) {
        source.current = CancelToken.source();
        const createUrl = `${API_BASE_URL}${CREATE_PAYMENT}${
          parentOrderIDMap.get(item?.provider?.id).transaction_id
        }`;
        const createPaymentResponse = await postDataWithAuth(
          createUrl,
          {
            amount: Number(productQuotesForCheckout[0]?.price?.value),
          },
          source.current.token,
        );
        const apiKeysResponse = await getDataWithAuth(
          `${API_BASE_URL}${RAZORPAY_KEYS}`,
          source.current.token,
        );
        const options = {
          description: 'Payment towards order',
          currency: 'INR',
          name: 'ONDC Ref app',
          order_id: createPaymentResponse.data.data.orderDetail.id,
          key: apiKeysResponse.data.keyId,
          amount: Number(productQuotesForCheckout[0]?.price?.value),
          prefill: {
            email: deliveryAddress.descriptor.email,
            contact: deliveryAddress.descriptor.phone,
            name: deliveryAddress.descriptor.name,
          },
        };
        const razorpayResponse = await RazorpayCheckout.open(options);
        const {data} = await postDataWithAuth(
          `${API_BASE_URL}${VERIFY_PAYMENT}`,
          {
            confirmRequest: queryParams,
            razorPayRequest: razorpayResponse,
          },
          source.current.token,
        );
        const isNACK = data.find((one: any) => one.error && one.code !== '');
        if (isNACK) {
          showToastWithGravity(isNACK.error.message);
          setConfirmOrderLoading(false);
        } else {
          onConfirm(data?.map((txn: any) => txn?.context?.message_id));
        }
      } else {
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
        if (activePaymentMethod === ORDER_PAYMENT_METHODS.PREPAID) {
          await confirmOrder(
            request_object[0],
            ORDER_PAYMENT_METHODS.PREPAID,
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
        showToastWithGravity(t('Global.Please select payment'));
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
        const transactionId: any = uuid.v4();
        await setStoredData('transaction_id', transactionId);
        await removeData('parent_order_id');
        await removeData('checkout_details');
        await removeData('parent_and_transaction_id_map');
        dispatch(setTransactionId(transactionId));
        closePaymentSheet();
        dispatch(clearCart());
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
