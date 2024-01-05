import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import {getStoredData, removeData} from '../../../../utils/storage';
import {ORDER_PAYMENT_METHODS, SSE_TIMEOUT} from '../../../../utils/constants';
import {
  constructQuoteObject,
  showToastWithGravity,
} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {
  API_BASE_URL,
  CONFIRM_ORDER,
  EVENTS,
  ON_CONFIRM,
} from '../../../../utils/apiActions';
import Fulfillment from './Fulfillment';
import AddressList from './AddressList';
import Payment from './Payment';

interface Summary {
  cartItems: any[];
  updatedCartItems: any[];
  productsQuote: any;
  selectedFulfillment: any;
  setSelectedFulfillment: (value: any) => void;
  onCheckoutFromCart: (address: any) => void;
  setUpdatedCartItems: (value: any) => void;
}

const CancelToken = axios.CancelToken;
const screenHeight: number = Dimensions.get('screen').height;

const Summary: React.FC<Summary> = ({
  cartItems,
  updatedCartItems,
  productsQuote,
  selectedFulfillment,
  setSelectedFulfillment,
  onCheckoutFromCart,
  setUpdatedCartItems,
}) => {
  const isFocused = useIsFocused();
  const {address} = useSelector(({addressReducer}) => addressReducer);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const source = useRef<any>(null);
  const {token} = useSelector(({authReducer}) => authReducer);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const eventTimeOutRef = useRef<any[]>([]);
  const responseRef = useRef<any[]>([]);
  const fulfillmentSheet = useRef<any>();
  const addressSheet = useRef<any>();
  const paymentSheet = useRef<any>();
  const [eventData, setEventData] = useState<any[]>([]);
  const [confirmOrderLoading, setConfirmOrderLoading] =
    useState<boolean>(false);
  const [billingAddress, setBillingAddress] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<any>(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState<string>('');

  const getItemsTotal = (providers: any[]) => {
    let finalTotal = 0;
    if (providers) {
      providers.forEach((provider: any) => {
        const items = Object.values(provider.items).filter(
          (quote: any) => quote?.title !== '',
        );
        items.forEach((item: any) => {
          finalTotal = finalTotal + parseFloat(item.price.value);
          if (item?.tax) {
            finalTotal = finalTotal + parseFloat(item.tax.value);
          }
          if (item?.discount) {
            finalTotal = finalTotal + parseFloat(item.discount.value);
          }
          if (item?.customizations) {
            Object.values(item.customizations)?.forEach((custItem: any) => {
              finalTotal = finalTotal + parseFloat(custItem.price.value);
              if (custItem?.tax) {
                finalTotal = finalTotal + parseFloat(custItem.tax.value);
              }
            });
          }
        });
      });
    }
    return finalTotal.toFixed(2);
  };

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

  const confirmOrder = async (items: any[], method: string) => {
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

  const handleConfirmOrder = async () => {
    try {
      if (activePaymentMethod) {
        const checkoutDetails = await getStoredData('checkout_details');
        const {successOrderIds} = JSON.parse(checkoutDetails || '{}');
        setConfirmOrderLoading(true);
        let items = cartItems.map(item => item.item);
        if (activePaymentMethod === ORDER_PAYMENT_METHODS.JUSPAY) {
          const request_object = constructQuoteObject(
            items.filter(({provider}) =>
              successOrderIds.includes(provider.local_id.toString()),
            ),
          );
          await confirmOrder(request_object[0], ORDER_PAYMENT_METHODS.JUSPAY);
        } else {
          const request_object = constructQuoteObject(
            items.filter(({provider}) =>
              successOrderIds.includes(provider.local_id.toString()),
            ),
          );
          await confirmOrder(request_object[0], ORDER_PAYMENT_METHODS.COD);
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
      let items = cartItems.map(item => item.item);
      const requestObject = constructQuoteObject(
        items.filter(({provider}) =>
          successOrderIds.includes(provider.local_id.toString()),
        ),
      );
      if (responseRef.current.length === requestObject.length) {
        await removeData('transaction_id');
        await removeData('parent_order_id');
        await removeData('checkout_details');
        await removeData('parent_and_transaction_id_map');
        navigation.navigate('Orders');
      }
      setConfirmOrderLoading(false);
    }
  };

  const renderItemDetails = (
    quote: any,
    qIndex: number,
    isCustomization: boolean,
  ) => {
    return (
      <View>
        <View key={`quote-${qIndex}-price`} style={styles.summaryRow}>
          <Text
            variant="labelMedium"
            style={
              isCustomization
                ? styles.summaryCustomizationPriceLabel
                : styles.summaryItemPriceLabel
            }>
            {quote?.price?.title}
          </Text>
          <Text
            variant="labelMedium"
            style={
              isCustomization
                ? styles.summaryCustomizationPriceValue
                : styles.summaryItemPriceValue
            }>
            ₹{Number(quote?.price?.value).toFixed(2)}
          </Text>
        </View>
        {quote?.tax && (
          <View key={`quote-${qIndex}-tax`} style={styles.summaryRow}>
            <Text
              variant="labelMedium"
              style={
                isCustomization
                  ? styles.summaryCustomizationTaxLabel
                  : styles.summaryItemTaxLabel
              }>
              {quote?.tax.title}
            </Text>
            <Text
              variant="labelMedium"
              style={
                isCustomization
                  ? styles.summaryCustomizationPriceValue
                  : styles.summaryItemPriceValue
              }>
              ₹${Number(quote?.tax.value).toFixed(2)}
            </Text>
          </View>
        )}
        {quote?.discount && (
          <View key={`quote-${qIndex}-discount`} style={styles.summaryRow}>
            <Text
              variant="bodyMedium"
              style={
                isCustomization
                  ? styles.summaryCustomizationDiscountLabel
                  : styles.summaryItemDiscountLabel
              }>
              {quote?.discount.title}
            </Text>
            <Text variant="labelMedium" style={styles.summaryItemPriceValue}>
              ₹{Number(quote?.discount.value).toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderOutOfStockItems = (provider: any, pindex: number) => {
    if (
      productsQuote.isError &&
      provider.errorCode === '40002' &&
      provider.error
    ) {
      return (
        <View key={`outof-stockpindex-${pindex}`}>
          {provider.error && provider.errorCode === '40002' ? (
            <>
              <View>
                <Text variant="bodyMedium">Out of stock</Text>
              </View>
              {provider.outOfStock.map(
                (outOfStockItems: any, outOfStockIndex: number) => (
                  <View key={`outof-stock-item-index-${outOfStockIndex}`}>
                    <View
                      style={styles.outOfStockRow}
                      key={`quote-${outOfStockIndex}-price`}>
                      <Text variant="labelMedium">
                        {outOfStockItems?.title}
                      </Text>
                      <View style={styles.stockQuantity}>
                        <Text style={styles.stockQuantity} variant="bodyMedium">
                          {outOfStockItems?.cartQuantity}
                        </Text>
                        <Text variant="bodyMedium">
                          /{outOfStockItems?.quantity}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.divider} />
                  </View>
                ),
              )}
              <View style={styles.divider} />
            </>
          ) : (
            <></>
          )}
        </View>
      );
    } else {
      return <></>;
    }
  };

  const renderItems = (provider: any, pindex: number) => {
    return (
      <View key={`pindex-${pindex}`}>
        {Object.values(provider.items)
          .filter((quote: any) => quote?.title !== '')
          .map((quote: any, qIndex) => (
            <View key={`quote-${qIndex}`}>
              <View key={`quote-${qIndex}-title`}>
                <Text variant="bodyMedium" style={styles.field}>
                  {quote?.title}
                </Text>
              </View>
              {renderItemDetails(quote, qIndex, false)}
              {quote?.customizations && (
                <View key={`quote-${qIndex}-customizations`}>
                  <Text variant="labelMedium" style={styles.field}>
                    Customizations
                  </Text>
                  {Object.values(quote?.customizations).map(
                    (customization: any, cIndex: number) => (
                      <View style={styles.customizationContainer}>
                        <View key={`quote-${qIndex}-customizations-${cIndex}`}>
                          <Text variant="labelMedium">
                            {customization.title}
                          </Text>
                        </View>
                        {renderItemDetails(customization, cIndex, true)}
                      </View>
                    ),
                  )}
                </View>
              )}
              <View style={styles.divider} />
            </View>
          ))}
        {productsQuote.isError &&
          provider.errorCode !== '' &&
          provider.errorCode !== '40002' &&
          provider.error && (
            <Text variant="bodyMedium" style={styles.error}>
              {provider.error}
            </Text>
          )}
      </View>
    );
  };

  const updateDeliveryAddress = (newAddress: any) => {
    setDeliveryAddress(newAddress);
    onCheckoutFromCart(newAddress);
    addressSheet.current.close();
  };

  const showPaymentOption = () => {
    fulfillmentSheet.current.close();
    paymentSheet.current.open();
  };

  useEffect(() => {
    clearDataAndNavigate().then(() => {});
  }, [eventData]);

  useEffect(() => {
    setDeliveryAddress(address);
    setBillingAddress(address);
  }, []);

  useEffect(() => {
    if (!isFocused) {
      addressSheet.current.close();
      fulfillmentSheet.current.close();
    }
  }, [isFocused]);

  const cartTotal = getItemsTotal(productsQuote?.providers);
  return (
    <>
      <View style={styles.summaryCard}>
        <ScrollView style={styles.list}>
          <View style={styles.listContent}>
            {productsQuote?.providers.map((provider: any, pindex: number) =>
              renderOutOfStockItems(provider, pindex),
            )}

            {productsQuote?.providers.map((provider: any, pindex: number) =>
              renderItems(provider, pindex),
            )}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.addressContainer}>
            <View style={styles.address}>
              <Text variant={'bodyMedium'}>
                Delivering to {deliveryAddress?.address?.tag}
              </Text>
              <Text variant={'labelMedium'}>
                {deliveryAddress?.address?.street},{' '}
                {deliveryAddress?.address?.landmark
                  ? `${deliveryAddress?.address?.landmark},`
                  : ''}{' '}
                {deliveryAddress?.address?.city},{' '}
                {deliveryAddress?.address?.state},{' '}
                {deliveryAddress?.address?.areaCode}{' '}
              </Text>
              <Text variant={'labelMedium'}>
                {deliveryAddress?.descriptor?.name} (
                {deliveryAddress?.descriptor?.phone})
              </Text>
            </View>
            <View>
              <Button
                mode={'outlined'}
                onPress={() => addressSheet.current.open()}>
                Change
              </Button>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.addressContainer}>
            <View>
              <Text variant="bodyMedium" style={styles.total}>
                ₹{cartTotal}
              </Text>
            </View>
            <View>
              <Button
                mode={'contained'}
                onPress={() => fulfillmentSheet.current.open()}>
                View Delivery Options
              </Button>
            </View>
          </View>
        </View>
      </View>
      <RBSheet
        closeOnPressMask
        ref={fulfillmentSheet}
        height={screenHeight / 2}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <Fulfillment
          showPaymentOption={showPaymentOption}
          selectedFulfillment={selectedFulfillment}
          setSelectedFulfillment={setSelectedFulfillment}
          cartItems={updatedCartItems}
          productsQuote={productsQuote}
          closeFulfilment={() => fulfillmentSheet.current.close()}
          cartTotal={cartTotal}
        />
      </RBSheet>
      <RBSheet
        closeOnPressMask
        ref={addressSheet}
        height={screenHeight / 2}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <AddressList
          deliveryAddress={deliveryAddress}
          setBillingAddress={setBillingAddress}
          setDeliveryAddress={updateDeliveryAddress}
          closeSheet={() => addressSheet.current.close()}
        />
      </RBSheet>
      <RBSheet
        closeOnPressMask
        ref={paymentSheet}
        height={screenHeight / 2}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <Payment
          productsQuote={productsQuote}
          cartItems={cartItems}
          updatedCartItemsData={updatedCartItems}
          billingAddress={billingAddress}
          deliveryAddress={deliveryAddress}
          selectedFulfillmentId={selectedFulfillment}
          responseReceivedIds={updatedCartItems.map(item =>
            item?.message?.quote?.provider?.id.toString(),
          )}
          fulfilmentList={updatedCartItems[0]?.message?.quote?.fulfillments}
          setUpdateCartItemsDataOnInitialize={data => setUpdatedCartItems(data)}
          closePaymentSheet={() => paymentSheet.current.close()}
          handleConfirmOrder={handleConfirmOrder}
          confirmOrderLoading={confirmOrderLoading}
          setActivePaymentMethod={setActivePaymentMethod}
          activePaymentMethod={activePaymentMethod}
        />
      </RBSheet>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    summaryCard: {
      flex: 1,
      paddingTop: 20,
    },
    list: {
      flex: 1,
      paddingHorizontal: 16,
    },
    listContent: {
      paddingBottom: 16,
    },
    summaryDivider: {
      marginVertical: 12,
      height: 1,
      backgroundColor: '#CACDD8',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    outOfStockRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    stockQuantity: {
      flexDirection: 'row',
    },
    cartQuantity: {
      color: colors.error,
    },
    divider: {
      height: 1,
      backgroundColor: '#CACDD8',
      marginVertical: 12,
    },
    error: {
      color: colors.error,
    },
    summaryCustomizationPriceLabel: {
      color: '#A2A6B0',
    },
    summaryItemPriceLabel: {
      color: '#151515',
    },
    summaryCustomizationPriceValue: {
      color: '#A2A6B0',
    },
    summaryItemPriceValue: {
      color: '#151515',
    },
    summaryCustomizationTaxLabel: {
      color: '#eb9494',
    },
    summaryItemTaxLabel: {
      color: colors.red,
    },
    summaryCustomizationDiscountLabel: {
      color: '#b1e3b1',
    },
    summaryItemDiscountLabel: {
      color: 'green',
    },
    field: {
      marginBottom: 8,
    },
    customizationContainer: {
      paddingLeft: 8,
    },
    total: {
      fontWeight: '700',
    },
    buttonContainer: {
      marginVertical: 24,
    },
    footer: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      backgroundColor: '#fff',
      elevation: 10,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    addressContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    address: {
      flexShrink: 1,
    },
    rbSheet: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
  });

export default Summary;
