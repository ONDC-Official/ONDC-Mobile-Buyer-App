import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, Text, useTheme} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {getStoredData, removeData} from '../../../../utils/storage';
import {ORDER_PAYMENT_METHODS, SSE_TIMEOUT} from '../../../../utils/constants';
import {
  constructQuoteObject,
  showToastWithGravity,
} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import axios from 'axios';
import {API_BASE_URL} from '../../../../utils/apiActions';

interface Summary {
  cartItems: any[];
  productsQuote: any;
  deliveryAddress: any;
  initLoading: boolean;
  activePaymentMethod: string;
}

const CancelToken = axios.CancelToken;

const Summary: React.FC<Summary> = ({
  cartItems,
  productsQuote,
  initLoading,
  deliveryAddress,
  activePaymentMethod,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const source = useRef<any>(null);
  const {token, uid} = useSelector(({authReducer}) => authReducer);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const [eventData, setEventData] = useState<any[]>([]);
  const {handleApiError} = useNetworkErrorHandling();
  const eventTimeOutRef = useRef<any[]>([]);
  const responseRef = useRef<any[]>([]);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [confirmOrderLoading, setConfirmOrderLoading] =
    useState<boolean>(false);

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

  const renderDeliveryLine = (quote: any, key: any) => (
    <View style={styles.summaryRow} key={`d-quote-${key}-price`}>
      <Text variant="bodyMedium">{quote?.title}</Text>
      <Text variant="bodyMedium">₹{Number(quote?.value).toFixed(2)}</Text>
    </View>
  );

  const getDeliveryTotalAmount = (providers: any[]) => {
    let total = 0;
    providers.forEach((provider: any) => {
      const data = provider.delivery;
      if (data.delivery) {
        total = total + parseFloat(data.delivery.value);
      }
      if (data.discount) {
        total = total + parseFloat(data.discount.value);
      }
      if (data.tax) {
        total = total + parseFloat(data.tax.value);
      }
      if (data.packing) {
        total = total + parseFloat(data.packing.value);
      }
      if (data.misc) {
        total = total + parseFloat(data.misc.value);
      }
    });
    return total.toFixed(2);
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
        `${API_BASE_URL}/clientApis/v2/on_confirm_order?messageIds=${messageId}`,
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
        `${API_BASE_URL}/clientApis/events/v2?messageId=${messageId}`,
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
        `${API_BASE_URL}/clientApis/v2/confirm_order`,
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
            variant="bodyMedium"
            style={
              isCustomization
                ? styles.summaryCustomizationPriceLabel
                : styles.summaryItemPriceLabel
            }>
            {quote?.price?.title}
          </Text>
          <Text
            variant="bodyMedium"
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
              variant="bodyMedium"
              style={
                isCustomization
                  ? styles.summaryCustomizationTaxLabel
                  : styles.summaryItemTaxLabel
              }>
              {quote?.tax.title}
            </Text>
            <Text
              variant="bodyMedium"
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
            <Text variant="bodyMedium" style={styles.summaryItemPriceValue}>
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
                      <Text variant="bodySmall">{outOfStockItems?.title}</Text>
                      <View style={styles.stockQuantity}>
                        <Text style={styles.stockQuantity} variant="bodyMedium">
                          {outOfStockItems?.cartQuantity}
                        </Text>
                        <Text variant="bodyMedium">
                          /{outOfStockItems?.quantity}
                        </Text>
                      </View>
                    </View>
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
                <Text variant="bodyLarge" style={styles.field}>
                  {quote?.title}
                </Text>
              </View>
              {renderItemDetails(quote, qIndex, false)}
              {quote?.customizations && (
                <View key={`quote-${qIndex}-customizations`}>
                  <Text variant="bodyMedium" style={styles.field}>
                    Customizations
                  </Text>
                  {Object.values(quote?.customizations).map(
                    (customization: any, cIndex: number) => (
                      <View style={styles.customizationContainer}>
                        <View key={`quote-${qIndex}-customizations-${cIndex}`}>
                          <Text variant="bodySmall">{customization.title}</Text>
                        </View>
                        {renderItemDetails(customization, cIndex, true)}
                      </View>
                    ),
                  )}
                </View>
              )}
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

  useEffect(() => {
    clearDataAndNavigate().then(() => {});
  }, [eventData]);

  return (
    <>
      <View style={styles.summaryCard}>
        <Text variant={'titleMedium'}>Summary</Text>
        <View style={styles.summaryDivider} />
        {productsQuote?.providers.map((provider, pindex) =>
          renderOutOfStockItems(provider, pindex),
        )}

        {productsQuote?.providers.map((provider, pindex) =>
          renderItems(provider, pindex),
        )}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text variant="bodyMedium">Total</Text>
          <Text variant="bodyMedium" style={styles.total}>
            ₹{getItemsTotal(productsQuote?.providers)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        {productsQuote?.providers.map((provider: any, pindex: number) => {
          const {delivery} = provider;
          return (
            <View key={`delivery${pindex}`}>
              {delivery.delivery &&
                renderDeliveryLine(delivery.delivery, 'delivery')}
              {delivery.discount &&
                renderDeliveryLine(delivery.discount, 'discount')}
              {delivery.tax && renderDeliveryLine(delivery.tax, 'tax')}
              {delivery.packing &&
                renderDeliveryLine(delivery.packing, 'packing')}
              {delivery.misc && renderDeliveryLine(delivery.misc, 'misc')}
              {delivery &&
                (delivery.delivery ||
                  delivery.discount ||
                  delivery.tax ||
                  delivery.packing ||
                  delivery.misc) && (
                  <View style={styles.summaryRow}>
                    <Text variant="bodyMedium">Total</Text>
                    <Text variant="bodyMedium">
                      ₹{getDeliveryTotalAmount(productsQuote?.providers)}
                    </Text>
                  </View>
                )}
            </View>
          );
        })}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text variant="bodyLarge">Order Total</Text>
          <Text variant="titleSmall">
            ₹{Number(productsQuote?.total_payable).toFixed(2)}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            disabled={
              activePaymentMethod === '' ||
              productsQuote.isError ||
              confirmOrderLoading ||
              initLoading
            }
            icon={() =>
              confirmOrderLoading || initLoading ? (
                <ActivityIndicator size={14} color={theme.colors.primary} />
              ) : (
                <></>
              )
            }
            onPress={handleConfirmOrder}>
            Proceed to Buy
          </Button>
        </View>
      </View>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    summaryCard: {
      paddingTop: 40,
      paddingHorizontal: 16,
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
      color: 'red',
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
  });

export default Summary;
