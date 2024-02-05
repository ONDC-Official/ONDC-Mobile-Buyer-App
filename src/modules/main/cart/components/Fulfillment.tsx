import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RadioButton, Text, useTheme} from 'react-native-paper';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';
import moment from 'moment';

interface Fulfillment {
  selectedFulfillment: any;
  setSelectedFulfillment: (newValue: any) => void;
  cartItems: any[];
  items: any[];
  productsQuote: any;
  closeFulfilment: () => void;
  cartTotal: string;
  showPaymentOption: () => void;
}

const Fulfillment: React.FC<Fulfillment> = ({
  selectedFulfillment,
  setSelectedFulfillment,
  cartItems,
  items,
  productsQuote,
  closeFulfilment,
  cartTotal,
  showPaymentOption,
}) => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const renderDeliveryLine = (quote: any, key: any) => (
    <View style={styles.summaryRow} key={`d-quote-${key}-price`}>
      <Text variant="bodySmall">{quote?.title}</Text>
      <Text variant="bodySmall">₹{Number(quote?.value).toFixed(2)}</Text>
    </View>
  );

  const exploreOtherStores = () => {
    closeFulfilment();
    navigation.navigate('Dashboard');
  };

  const orderTotal = Number(productsQuote?.total_payable).toFixed(2);
  const uniqueIdsSet = new Set(
    cartItems[0]?.message?.quote?.fulfillments.map(
      (fulfilment: any) => fulfilment.id,
    ),
  );

  const heightOfPager =
    cartItems[0]?.message?.quote?.fulfillments.length * 70 + 150;

  // Convert Set back to an array if needed
  const unqiueFulfillments = Array.from(uniqueIdsSet);

  return (
    <CloseSheetContainer closeSheet={closeFulfilment}>
      <View>
        <View style={styles.header}>
          <Text variant={'titleSmall'}>Choose delivery/pickup</Text>
        </View>
        <View>
          {productsQuote.isError ? (
            <View style={styles.errorContainer}>
              {productsQuote?.providers.map((provider: any, pindex: number) => (
                <View key={`delivery${pindex}`}>
                  <Text variant={'bodyLarge'}>{provider.error}</Text>
                </View>
              ))}
              <Text variant={'labelMedium'} style={styles.errorMessage}>
                Please try ordering from another store or try again later
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={exploreOtherStores}>
                <Text variant={'labelLarge'} style={styles.buttonLabel}>
                  Explore Other Stores
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <PagerView
                style={{height: heightOfPager, backgroundColor: '#fff'}}>
                {unqiueFulfillments.map((fulfillmentId: any) => {
                  const filteredProducts =
                    cartItems[0]?.message?.quote?.items?.filter((item: any) => {
                      let isItem = false;
                      if (item?.tags) {
                        const findTag = item?.tags.find(
                          (tag: any) => tag.code === 'type',
                        );
                        if (findTag) {
                          isItem =
                            findTag.list.findIndex(
                              (listItem: any) => listItem.value === 'item',
                            ) > -1;
                        }
                      } else {
                        isItem = true;
                      }
                      return isItem && item.fulfillment_id === fulfillmentId;
                    });
                  let fulfillmentTotal = 0;
                  const fulfilments =
                    cartItems[0]?.message?.quote?.fulfillments.filter(
                      (fulfillment: any) => fulfillment.id === fulfillmentId,
                    );

                  return (
                    <>
                      <View style={styles.fulfilmentSummary}>
                        <Text variant={'labelMedium'}>
                          {filteredProducts.length} Items
                        </Text>
                        <ScrollView horizontal>
                          {filteredProducts?.map((item: any) => {
                            const singleProduct = items?.find(
                              (one: any) => one.item.product.id === item.id,
                            );
                            const itemTotal =
                              singleProduct.item.product.price.value *
                              singleProduct.item.quantity.count;
                            fulfillmentTotal += itemTotal;

                            return (
                              <View
                                key={item.id}
                                style={styles.productContainer}>
                                <FastImage
                                  source={{
                                    uri: singleProduct?.item?.product
                                      ?.descriptor?.symbol,
                                  }}
                                  style={styles.productImage}
                                />
                                <Text
                                  variant={'labelMedium'}
                                  style={styles.productName}
                                  ellipsizeMode={'tail'}
                                  numberOfLines={2}>
                                  {
                                    singleProduct?.item?.product?.descriptor
                                      ?.name
                                  }
                                </Text>
                                <Text
                                  variant={'labelMedium'}
                                  style={styles.productQuantity}>
                                  Qty {singleProduct?.item?.quantity?.count}
                                </Text>
                              </View>
                            );
                          })}
                        </ScrollView>
                        <View style={styles.fulfilmentTotal}>
                          <Text
                            variant={'bodyMedium'}
                            style={styles.itemsTotal}>
                            Items Total
                          </Text>
                          <Text
                            variant={'bodyMedium'}
                            style={styles.itemsTotal}>
                            ₹{fulfillmentTotal.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                      <ScrollView contentContainerStyle={styles.listContainer}>
                        {fulfilments.map((fulfilment: any) => {
                          return (
                            <View
                              key={`${fulfilment.id}${fulfilment.type}`}
                              style={styles.fulfilment}>
                              <RadioButton.Android
                                value={fulfilment['@ondc/org/category']}
                                status={
                                  fulfilment.id === selectedFulfillment
                                    ? 'checked'
                                    : 'unchecked'
                                }
                                onPress={() =>
                                  setSelectedFulfillment(fulfilment.id)
                                }
                              />
                              <View style={styles.customerMeta}>
                                <Text variant={'bodyMedium'}>
                                  {fulfilment['@ondc/org/category']}
                                </Text>
                                {fulfilment.hasOwnProperty('@ondc/org/TAT') && (
                                  <Text
                                    variant={'labelMedium'}
                                    style={styles.duration}>
                                    {moment
                                      .duration(fulfilment['@ondc/org/TAT'])
                                      .humanize()}
                                  </Text>
                                )}
                              </View>
                            </View>
                          );
                        })}
                      </ScrollView>
                    </>
                  );
                })}
              </PagerView>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text variant="bodyMedium">Item Total</Text>
                  <Text variant="bodyMedium">₹{cartTotal}</Text>
                </View>
                {productsQuote?.providers.map(
                  (provider: any, pindex: number) => {
                    const {delivery} = provider;
                    return (
                      <View key={`delivery${pindex}`}>
                        {delivery.delivery &&
                          renderDeliveryLine(delivery.delivery, 'delivery')}
                        {delivery.discount &&
                          renderDeliveryLine(delivery.discount, 'discount')}
                        {delivery.tax &&
                          renderDeliveryLine(delivery.tax, 'tax')}
                        {delivery.packing &&
                          renderDeliveryLine(delivery.packing, 'packing')}
                        {delivery.misc &&
                          renderDeliveryLine(delivery.misc, 'misc')}
                      </View>
                    );
                  },
                )}
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text variant="bodyLarge">To Pay</Text>
                  <Text variant="titleSmall">₹{orderTotal}</Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={showPaymentOption}>
                  <Text variant={'labelLarge'} style={styles.buttonLabel}>
                    Proceed to Pay ₹{orderTotal}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </CloseSheetContainer>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    listContainer: {
      padding: 16,
      backgroundColor: '#FAFAFA',
    },
    customerRow: {
      marginBottom: 20,
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
    },
    customerMeta: {
      marginLeft: 12,
    },
    duration: {
      color: colors.success,
      marginTop: 4,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    active: {
      borderColor: colors.primary,
    },
    normal: {
      borderColor: colors.text,
    },
    summaryDivider: {
      marginBottom: 12,
      height: 1,
      backgroundColor: '#CACDD8',
    },
    header: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: '#fff',
    },
    button: {
      marginTop: 20,
      backgroundColor: colors.primary,
      borderRadius: 22,
      padding: 12,
      alignItems: 'center',
    },
    buttonLabel: {
      color: '#fff',
    },
    errorContainer: {
      alignItems: 'center',
    },
    errorMessage: {
      marginTop: 8,
    },
    fulfilmentSummary: {
      backgroundColor: '#fff',
      paddingHorizontal: 16,
    },
    productContainer: {
      marginRight: 12,
      marginTop: 12,
    },
    productImage: {
      width: 44,
      height: 44,
      borderRadius: 8,
    },
    productName: {
      color: '#1A1A1A',
      fontWeight: '500',
      marginVertical: 4,
      width: 85,
    },
    productQuantity: {
      color: '#686868',
    },
    fulfilmentTotal: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    itemsTotal: {
      color: '#1A1A1A',
    },
    fulfilment: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    summaryContainer: {
      padding: 16,
      backgroundColor: '#fff',
    },
  });

export default Fulfillment;
