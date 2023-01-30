import React, {useEffect, useRef, useState} from 'react';
import RNEventSource from 'react-native-event-source';
import {useDispatch, useSelector} from 'react-redux';

import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {clearAllData} from '../../../../../redux/actions';
import {clearFilters} from '../../../../../redux/filter/actions';
import {alertWithOneButton} from '../../../../../utils/alerts';
import {getData, postData} from '../../../../../utils/api';
import {
  BASE_URL,
  CONFIRM_ORDER,
  ON_CONFIRM_ORDER,
} from '../../../../../utils/apiUtilities';
import {showToastWithGravity} from '../../../../../utils/utils';
import {useNavigation} from '@react-navigation/native';

export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {token} = useSelector(({authReducer}) => authReducer);
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const {handleApiError} = useNetworkErrorHandling();
  const [confirmMessageIds, setConfirmMessageIds] = useState(null);
  const [confirmOrderRequested, setConfirmOrderRequested] = useState(false);

  const refOrders = useRef([]);
  const providers = useRef([]);

  /**
   * function gets executes when order get placed
   */
  const onOrderSuccess = () => {
    dispatch(clearAllData());
    dispatch(clearFilters());
    navigation.navigate('Orders');
  };

  /**
   * function request confirm order
   * @param id:message id
   * @returns {Promise<void>}
   */
  const onConfirmOrder = async id => {
    try {
      console.log('On confirm order called');
      const {data} = await getData(
        `${BASE_URL}${ON_CONFIRM_ORDER}messageIds=${id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      console.log('onConfirmOrder');
      console.log(JSON.stringify(data, undefined, 4));
    } catch (err) {
      console.log(err);
      handleApiError(err);
      setConfirmOrderRequested(false);
    }
  };

  /**
   * function request confirm order
   * @param method:payment method selected by user
   * @param orders
   * @param total
   * @returns {Promise<void>}
   */
  const confirmOrder = async (method, orders, total) => {
    try {
      if (orders && orders.length > 0) {
        const error = orders.find(one => one.hasOwnProperty('error'));

        if (!error) {
          refOrders.current = orders;
          const payload = orders.map(item => {
            const product = cartItems.find(
              one => String(one.id) === String(item.message.order.items[0].id),
            );
            return {
              context: {
                transaction_id: item.context.parent_order_id,
                parent_order_id: item.context.parent_order_id,
                city: product.city,
                state: product.state,
              },
              message: {
                quote: item.message.order.quote,
                payment: {
                  ...{
                    paid_amount: total,
                    transaction_id: item.context.transaction_id,
                  },
                  ...method,
                },

                providers: {
                  id: item.message?.order?.provider?.id,
                  locations: [item.message?.order?.provider_location?.id],
                },
              },
            };
          });
          setConfirmOrderRequested(true);
          const {data} = await postData(
            `${BASE_URL}${CONFIRM_ORDER}`,
            payload,
            {
              headers: {Authorization: `Bearer ${token}`},
            },
          );
          let messageIds = [];
          data.forEach((item, index) => {
            if (item.message.ack.status === 'ACK') {
              messageIds.push(item.context.message_id);
              providers.current.push({
                id: payload[index].message.providers.id,
                ack: true,
              });
            } else {
              providers.current.push({
                id: payload[index].message.providers.id,
                ack: false,
              });
            }
          });
          if (messageIds.length > 0) {
            setConfirmMessageIds(messageIds);
          } else {
            alertWithOneButton(
              'Order Confirmation Failed',
              'We are unable to process your order at the moment. Please try with other payment option or try again after some time',
              'Ok',
              () => {
                setConfirmOrderRequested(false);
              },
            );
          }
        } else {
          showToastWithGravity(
            'Something went wrong, please try again after some time.',
          );
        }
      } else {
        showToastWithGravity(
          'Something went wrong, please try again after some time.',
        );
      }
    } catch (err) {
      console.log(err);
      handleApiError(err);
      setConfirmOrderRequested(false);
    }
  };

  const removeEvent = sources => {
    if (sources) {
      sources.forEach(source => {
        source.removeAllListeners();
        source.close();
      });
      sources = null;
      if (providers.current.findIndex(one => one.ack === false) < 0) {
        alertWithOneButton(
          null,
          'Your order has been placed!',
          'Ok',
          onOrderSuccess,
        );
      } else {
        alertWithOneButton(
          null,
          'Your order has been partially placed, please check order details for more information',
          'Ok',
          onOrderSuccess,
        );
      }
      setConfirmOrderRequested(false);
      setConfirmMessageIds(null);
    }
  };

  useEffect(() => {
    let sources = null;
    let timer = null;
    if (confirmMessageIds) {
      sources = confirmMessageIds.map(messageId => {
        return new RNEventSource(
          `${BASE_URL}/clientApis/events?messageId=${messageId}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
      });
      if (!timer) {
        timer = setTimeout(removeEvent, 20000, sources);
      }
      sources.forEach(eventSource => {
        eventSource.addEventListener('on_confirm', event => {
          const data = JSON.parse(event.data);
          onConfirmOrder(data.messageId)
            .then(() => {})
            .catch(() => {});
        });
      });
    }

    return () => {
      removeEvent(sources);
      clearTimeout(timer);
    };
  }, [confirmMessageIds]);

  return {
    confirmOrderRequested,
    confirmOrder,
  };
};
