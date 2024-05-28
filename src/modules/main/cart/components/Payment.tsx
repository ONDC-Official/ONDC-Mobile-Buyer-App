import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Button, Text} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ORDER_PAYMENT_METHODS, SSE_TIMEOUT} from '../../../../utils/constants';
import {
  compareIgnoringSpaces,
  constructQuoteObject,
  removeNullValues,
  showToastWithGravity,
} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {
  API_BASE_URL,
  EVENTS,
  INITIALIZE_ORDER,
  ON_INITIALIZE,
} from '../../../../utils/apiActions';
import {getStoredData, setStoredData} from '../../../../utils/storage';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';
import {useAppTheme} from '../../../../utils/theme';
import CashOnDeliveryIcon from '../../../../assets/payment/cod.svg';
import PrepaidIcon from '../../../../assets/payment/prepaid.svg';

interface Payment {
  userInput: string;
  productsQuote: any;
  cartItems: any[];
  responseReceivedIds: string[];
  deliveryAddress: any;
  billingAddress: any;
  selectedFulfillmentList: any[];
  fulfilmentList: any[];
  updatedCartItemsData: any[];
  setUpdateCartItemsDataOnInitialize: (items: any[]) => void;
  activePaymentMethod: any;
  setActivePaymentMethod: (value: any) => void;
  closePaymentSheet: () => void;
  handleConfirmOrder: () => void;
  confirmOrderLoading: boolean;
}

const CancelToken = axios.CancelToken;

const Payment: React.FC<Payment> = ({
  userInput,
  activePaymentMethod,
  setActivePaymentMethod,
  closePaymentSheet,
  productsQuote,
  cartItems,
  responseReceivedIds,
  deliveryAddress,
  billingAddress,
  selectedFulfillmentList,
  fulfilmentList,
  updatedCartItemsData,
  setUpdateCartItemsDataOnInitialize,
  handleConfirmOrder,
  confirmOrderLoading,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const {token, transaction_id} = useSelector(({authReducer}) => authReducer);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const updatedCartItems = useRef<any[]>([]);
  const responseRef = useRef<any[]>([]);
  const requestCount = useRef(0);
  const eventTimeOutRef = useRef<any[]>([]);
  const source = useRef<any>(null);
  const styles = makeStyles(theme.colors);
  const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
  const [initFailed, setInitFailed] = useState(false);
  const [eventData, setEventData] = useState<any[]>([]);

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
        `${API_BASE_URL}${ON_INITIALIZE}${messageId}`,
        source.current.token,
      );
      responseRef.current = [...responseRef.current, data[0]];
      setEventData([...eventData, data[0]]);

      let oldData = updatedCartItems.current;
      oldData[0].message.quote.quote = data[0].message.order.quote;
      oldData[0].message.quote.payment = data[0].message.order.payment;

      setUpdateCartItemsDataOnInitialize(oldData);
      await handleSuccess();
    } catch (err: any) {
      showToastWithGravity(err?.response?.data?.error?.message);
      setInitializeOrderLoading(false);
    }
  };

  // use this function to initialize the order
  const onInit = (messageIds: any[]) => {
    eventTimeOutRef.current = messageIds.map(messageId => {
      const eventSource = new RNEventSource(
        `${API_BASE_URL}${EVENTS}${messageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      eventSource.addEventListener('on_init', (event: any) => {
        const data = JSON.parse(event.data);
        onInitializeOrder(data.messageId)
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
          setInitializeOrderLoading(false);
          showToastWithGravity('Cannot fetch details for this product');
          return;
        }
        if (requestCount.current !== responseRef.current.length) {
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
      const contextCity = await getStoredData('contextCity');
      const payload = items.map((item: any) => {
        let itemsData = Object.assign([], JSON.parse(JSON.stringify(item)));
        itemsData = itemsData.map((itemData: any) => {
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
            transaction_id,
            city: contextCity || deliveryAddress.address.city,
            state: deliveryAddress.address.state,
            pincode: deliveryAddress.address.areaCode,
            domain: item[0].domain,
          },
          message: {
            items: itemsData,
            fulfillments: fulfilmentList.filter(fulfillment =>
              selectedFulfillmentList.includes(fulfillment.id),
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
                gps: `${deliveryAddress?.address?.lat},${deliveryAddress?.address?.lng}`,
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
        `${API_BASE_URL}${INITIALIZE_ORDER}`,
        payload,
        source.current.token,
      );

      //Error handling workflow eg, NACK
      const isNACK = data.find(
        (item: any) => item.error || item?.message?.ack?.status === 'NACK',
      );
      if (isNACK) {
        showToastWithGravity(isNACK.error.message);
        setInitializeOrderLoading(false);
        setInitFailed(true);
      } else {
        setInitFailed(false);
        const parentTransactionIdMap = new Map();
        data.map((one: any) => {
          const provider_id = one?.context?.provider_id;
          return parentTransactionIdMap.set(provider_id, {
            parent_order_id: one?.context?.parent_order_id,
            transaction_id: one?.context?.transaction_id,
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
        requestCount.current = data.length;
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
    if (
      !(
        activePaymentMethod === '' ||
        productsQuote.isError ||
        confirmOrderLoading ||
        initializeOrderLoading ||
        initFailed
      )
    ) {
      if (userInput) {
        const input = userInput.toLowerCase();
        if (compareIgnoringSpaces('proceed to pay', input)) {
          handleConfirmOrder();
        }
      }
    } else if (userInput) {
      const input = userInput.toLowerCase();
      if (!initializeOrderLoading) {
        if (/^(select|choose)\b/i.test(input)) {
          const paymentOption = input
            .replace('select', '')
            .replace('choose', '')
            .trim();
          if (
            compareIgnoringSpaces(paymentOption, 'prepaid') ||
            compareIgnoringSpaces(paymentOption, 'prepared')
          ) {
            updatePaymentMethod(ORDER_PAYMENT_METHODS.PREPAID);
          } else if (compareIgnoringSpaces(paymentOption, 'cash on delivery')) {
            updatePaymentMethod(ORDER_PAYMENT_METHODS.COD);
          }
        }
      }
    }
  }, [
    userInput,
    activePaymentMethod,
    productsQuote,
    confirmOrderLoading,
    initializeOrderLoading,
    initFailed,
  ]);

  useEffect(() => {
    if (updatedCartItemsData) {
      updatedCartItems.current = updatedCartItemsData;
    }
  }, [updatedCartItemsData]);

  return (
    <CloseSheetContainer closeSheet={closePaymentSheet}>
      <View>
        <View style={styles.header}>
          <Text variant={'titleLarge'} style={styles.title}>
            {t('Cart.Payment.Select Payment Option')}
          </Text>
        </View>
        <View style={styles.paymentContainer}>
          <TouchableOpacity
            disabled={initializeOrderLoading}
            style={styles.paymentOption}
            onPress={() => updatePaymentMethod(ORDER_PAYMENT_METHODS.PREPAID)}>
            <View
              style={[
                styles.paymentOptionMeta,
                activePaymentMethod === ORDER_PAYMENT_METHODS.PREPAID
                  ? styles.selectedOption
                  : {},
              ]}>
              <View style={styles.imageContainer}>
                <PrepaidIcon width={'100%'} height={100} />
              </View>
              <View style={styles.checkContainer}>
                {activePaymentMethod === ORDER_PAYMENT_METHODS.PREPAID ? (
                  <Icon
                    name={'check-circle'}
                    size={20}
                    color={theme.colors.primary}
                  />
                ) : (
                  <View style={styles.emptyCheck} />
                )}
              </View>
            </View>
            <Text variant={'labelLarge'} style={styles.paymentOptionText}>
              {t('Cart.Payment.Prepaid')}
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            disabled={initializeOrderLoading}
            style={styles.paymentOption}
            onPress={() => updatePaymentMethod(ORDER_PAYMENT_METHODS.COD)}>
            <View
              style={[
                styles.paymentOptionMeta,
                activePaymentMethod === ORDER_PAYMENT_METHODS.COD
                  ? styles.selectedOption
                  : {},
              ]}>
              <View style={styles.imageContainer}>
                <CashOnDeliveryIcon width={'100%'} height={100} />
              </View>
              <View style={styles.checkContainer}>
                {activePaymentMethod === ORDER_PAYMENT_METHODS.COD ? (
                  <Icon
                    name={'check-circle'}
                    size={20}
                    color={theme.colors.primary}
                  />
                ) : (
                  <View style={styles.emptyCheck} />
                )}
              </View>
            </View>
            <Text variant={'labelLarge'} style={styles.paymentOptionText}>
              {t('Cart.Payment.Cash on delivery')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            mode="contained"
            disabled={
              activePaymentMethod === '' ||
              productsQuote.isError ||
              confirmOrderLoading ||
              initializeOrderLoading ||
              initFailed
            }
            icon={() =>
              confirmOrderLoading || initializeOrderLoading ? (
                <ActivityIndicator size={14} color={theme.colors.primary} />
              ) : (
                <></>
              )
            }
            onPress={handleConfirmOrder}>
            {t('Cart.Payment.Proceed to Buy')}
          </Button>
        </View>
      </View>
    </CloseSheetContainer>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    header: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral100,
    },
    title: {
      color: colors.neutral400,
    },
    paymentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.white,
    },
    paymentOption: {
      width: (Dimensions.get('screen').width - 48) / 2,
      alignItems: 'center',
    },
    paymentOptionMeta: {
      borderRadius: 6,
      borderColor: colors.neutral100,
      borderWidth: 1,
      paddingTop: 6,
      width: '100%',
      alignItems: 'center',
    },
    imageContainer: {
      paddingTop: 28,
      paddingBottom: 33,
      paddingHorizontal: 30,
      width: '100%',
    },
    selectedOption: {
      borderColor: colors.primary,
      borderWidth: 1,
    },
    separator: {
      width: 16,
    },
    paymentImage: {
      width: 150,
      aspectRatio: 1,
      borderRadius: 6,
      marginBottom: 8,
    },
    paymentOptionText: {
      marginTop: 8,
      textAlign: 'center',
    },
    buttonContainer: {
      padding: 16,
      backgroundColor: colors.white,
    },
    button: {
      borderRadius: 8,
    },
    emptyCheck: {
      width: 20,
      height: 20,
      marginBottom: 4,
    },
    checkContainer: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 4,
      width: '100%',
      position: 'absolute',
    },
  });

export default Payment;
