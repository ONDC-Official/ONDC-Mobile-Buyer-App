import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Checkbox, Text, useTheme} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';

import {ORDER_PAYMENT_METHODS, SSE_TIMEOUT} from '../../../../utils/constants';
import Summary from './Summary';
import {
  constructQuoteObject,
  removeNullValues,
  showToastWithGravity,
} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL} from '../../../../utils/apiActions';
import {getStoredData, setStoredData} from '../../../../utils/storage';

interface Payment {
  productsQuote: any;
  cartItems: any[];
  responseReceivedIds: string[];
  deliveryAddress: any;
  billingAddress: any;
  selectedFulfillmentId: any;
  fulfilmentList: any[];
  updatedCartItemsData: any[];
  setUpdateCartItemsDataOnInitialize: (items: any[]) => void;
}

const CancelToken = axios.CancelToken;

const Payment: React.FC<Payment> = ({
  productsQuote,
  cartItems,
  responseReceivedIds,
  deliveryAddress,
  billingAddress,
  selectedFulfillmentId,
  fulfilmentList,
  updatedCartItemsData,
  setUpdateCartItemsDataOnInitialize,
}) => {
  const theme = useTheme();
  const {token, uid} = useSelector(({authReducer}) => authReducer);
  const styles = makeStyles(theme.colors);
  const [activePaymentMethod, setActivePaymentMethod] = useState<string>('');
  const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
  const updatedCartItems = useRef<any[]>([]);
  const responseRef = useRef<any[]>([]);
  const eventTimeOutRef = useRef<any[]>([]);
  const [eventData, setEventData] = useState<any[]>([]);
  const source = useRef<any>(null);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const handleSuccess = async () => {
    setInitializeOrderLoading(false);
    let checkout: any = {
      successOrderIds: [],
      productQuotes: [],
    };
    responseRef.current.forEach(item => {
      const {message} = item;
      checkout = {
        productQuotes: [...checkout.productQuotes, message?.order?.quote],
        successOrderIds: [
          ...checkout.successOrderIds,
          message?.order?.provider?.id.toString(),
        ],
      };
    });
    await setStoredData('checkout_details', JSON.stringify(checkout));
  };

  const onInitializeOrder = async (messageId: any) => {
    setInitializeOrderLoading(true);
    try {
      await setStoredData(
        'selectedItems',
        JSON.stringify(updatedCartItems.current),
      );
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}/clientApis/v2/on_initialize_order?messageIds=${messageId}`,
        source.current.token,
      );
      responseRef.current = [...responseRef.current, data[0]];
      setEventData([...eventData, data[0]]);

      let oldData = updatedCartItems.current;
      oldData[0].message.quote.quote = data[0].message.order.quote;

      setUpdateCartItemsDataOnInitialize(oldData);
      await handleSuccess();
    } catch (err) {
      showToastWithGravity(err?.response?.data?.error?.message);
      setInitializeOrderLoading(false);
    }
  };

  // use this function to initialize the order
  const onInit = (messageIds: any[]) => {
    eventTimeOutRef.current = messageIds.map(messageId => {
      const eventSource = new RNEventSource(
        `${API_BASE_URL}/clientApis/events/v2?messageId=${messageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      eventSource.addEventListener('on_init', (event: any) => {
        const data = JSON.parse(event.data);
        onInitializeOrder(data.messageId)
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
          setInitializeOrderLoading(false);
          showToastWithGravity('Cannot fetch details for this product');
          return;
        }
        let items = cartItems.map(item => item.item);
        // tale action to redirect them.
        const requestObject = constructQuoteObject(
          items.filter(({provider}) =>
            responseReceivedIds.includes(provider.id.toString()),
          ),
        );
        if (requestObject.length !== responseRef.current.length) {
          showToastWithGravity('Some orders are not initialized!');
        }
      }, SSE_TIMEOUT);

      return {
        eventSource,
        timer,
      };
    });
  };

  const initializeOrder = async (itemsList: any[]) => {
    const items = JSON.parse(JSON.stringify(Object.assign([], itemsList)));
    responseRef.current = [];
    setInitializeOrderLoading(true);
    try {
      source.current = CancelToken.source();
      const transactionId = await getStoredData('transaction_id');
      const payload = items.map((item: any) => {
        let itemsData = Object.assign([], JSON.parse(JSON.stringify(item)));
        itemsData = itemsData.map((itemData: any) => {
          itemData.fulfillment_id = selectedFulfillmentId;
          delete itemData.product.fulfillment_id;
          if (updatedCartItems.current) {
            let findItemFromQuote =
              updatedCartItems.current[0].message.quote.items.find(
                (data: any) => data.id === itemData.local_id,
              );
            if (findItemFromQuote) {
              itemData.parent_item_id = findItemFromQuote.parent_item_id;
            }
          } else {
          }
          return itemData;
        });

        return {
          context: {
            transaction_id: transactionId,
            city: deliveryAddress.address.city,
            state: deliveryAddress.address.state,
            domain: item[0].domain,
          },
          message: {
            items: itemsData,
            fulfillments: fulfilmentList.filter(
              fulfillment => fulfillment.id === selectedFulfillmentId,
            ),
            billing_info: {
              address: removeNullValues(billingAddress?.address),
              phone: billingAddress?.descriptor?.phone || billingAddress?.phone,
              name: billingAddress?.descriptor?.name || billingAddress?.name,
              email: billingAddress?.descriptor?.email || billingAddress?.email,
            },
            delivery_info: {
              type: 'Delivery',
              name: deliveryAddress?.descriptor?.name,
              email: deliveryAddress?.descriptor?.email,
              phone: deliveryAddress?.descriptor?.phone,
              location: {
                gps: `${deliveryAddress?.address?.lat}, ${deliveryAddress?.address?.lng}`,
                address: deliveryAddress?.address,
              },
            },
            payment: {
              type:
                activePaymentMethod === ORDER_PAYMENT_METHODS.COD
                  ? 'ON-FULFILLMENT'
                  : 'ON-ORDER',
            },
          },
        };
      });
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}/clientApis/v2/initialize_order`,
        payload,
        source.current.token,
      );

      //Error handling workflow eg, NACK
      const isNACK = data.find(
        (item: any) => item.error && item.message.ack.status === 'NACK',
      );
      if (isNACK) {
        showToastWithGravity(isNACK.error.message);
        setInitializeOrderLoading(false);
      } else {
        const parentTransactionIdMap = new Map();
        data.map((data: any) => {
          const provider_id = data?.context?.provider_id;
          return parentTransactionIdMap.set(provider_id, {
            parent_order_id: data?.context?.parent_order_id,
            transaction_id: data?.context?.transaction_id,
          });
        });
        await setStoredData(
          'parent_order_id',
          data[0]?.context?.parent_order_id,
        );
        await setStoredData(
          'parent_and_transaction_id_map',
          JSON.stringify(Array.from(parentTransactionIdMap.entries())),
        );
        onInit(data?.map((txn: any) => txn?.context?.message_id));
      }
    } catch (err: any) {
      console.log(err);
      showToastWithGravity(err?.response?.data?.error?.message);
      setInitializeOrderLoading(false);
      handleApiError(err);
    }
  };

  const handleInitializeOrder = () => {
    setInitializeOrderLoading(true);
    let items = cartItems.map((item: any) => item.item);
    const requestObjects = constructQuoteObject(
      items.filter(({provider}) =>
        responseReceivedIds.includes(provider.local_id.toString()),
      ),
    );

    initializeOrder(requestObjects).then(() => {});
  };

  const updatePaymentMethod = (newMethod: string) => {
    setActivePaymentMethod(newMethod);
    handleInitializeOrder();
  };

  useEffect(() => {
    if (updatedCartItemsData) {
      updatedCartItems.current = updatedCartItemsData;
    }
  }, [updatedCartItemsData]);

  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={[styles.paymentOption]}
          onPress={() => updatePaymentMethod(ORDER_PAYMENT_METHODS.COD)}>
          <View
            style={[
              styles.paymentOptionMeta,
              activePaymentMethod === ORDER_PAYMENT_METHODS.COD
                ? styles.selectedOption
                : {},
            ]}>
            <View style={styles.selectionStatus}>
              {activePaymentMethod === ORDER_PAYMENT_METHODS.COD ? (
                <Checkbox.Android status={'checked'} />
              ) : (
                <View style={styles.emptyCheckbox} />
              )}
            </View>
            <FastImage
              source={require('../../../../assets/payment/cashOnDelivery.png')}
              style={styles.paymentImage}
            />
          </View>
          <Text variant={'labelMedium'} style={styles.paymentOptionText}>
            Cash on delivery
          </Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={[styles.paymentOption]}
          onPress={() => updatePaymentMethod(ORDER_PAYMENT_METHODS.JUSPAY)}>
          <View
            style={[
              styles.paymentOptionMeta,
              activePaymentMethod === ORDER_PAYMENT_METHODS.JUSPAY
                ? styles.selectedOption
                : {},
            ]}>
            <View style={styles.selectionStatus}>
              {activePaymentMethod === ORDER_PAYMENT_METHODS.JUSPAY ? (
                <Checkbox.Android status={'checked'} />
              ) : (
                <View style={styles.emptyCheckbox} />
              )}
            </View>
            <FastImage
              source={require('../../../../assets/payment/prepaid.png')}
              style={styles.paymentImage}
            />
          </View>
          <Text variant={'labelMedium'} style={styles.paymentOptionText}>
            Prepaid
          </Text>
        </TouchableOpacity>
      </View>
      <Summary
        deliveryAddress={deliveryAddress}
        cartItems={cartItems}
        productsQuote={productsQuote}
        initLoading={initializeOrderLoading}
        activePaymentMethod={activePaymentMethod}
      />
    </ScrollView>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
    },
    paymentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 40,
    },
    paymentOption: {
      flex: 1,
      alignItems: 'center',
    },
    paymentOptionMeta: {
      paddingBottom: 16,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderColor: '#fff',
      borderWidth: 1,
    },
    selectedOption: {
      borderColor: '#196AAB',
      borderWidth: 1,
    },
    selectionStatus: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    separator: {
      width: 16,
    },
    emptyCheckbox: {
      height: 24,
    },
    paymentImage: {
      width: 150,
      aspectRatio: 1,
      borderRadius: 6,
    },
    paymentOptionText: {
      fontWeight: '700',
    },
  });

export default Payment;
