import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';
import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';
import {useAppTheme} from '../../../../utils/theme';
import {useTranslation} from 'react-i18next';
import {makeGlobalStyles} from '../../../../styles/styles';

const screenHeight = Dimensions.get('screen').height;

interface Fulfillment {
  selectedFulfillmentList: any[];
  setSelectedFulfillmentList: (newValue: any[]) => void;
  cartItems: any[];
  items: any[];
  productsQuote: any;
  closeFulfilment: () => void;
  cartTotal: string;
  showPaymentOption: () => void;
}

const Fulfillment: React.FC<Fulfillment> = ({
  selectedFulfillmentList = [],
  setSelectedFulfillmentList,
  cartItems,
  items,
  productsQuote,
  closeFulfilment,
  cartTotal,
  showPaymentOption,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const globalStyles = makeGlobalStyles(theme.colors);
  const pagerRef = useRef<any>();
  const [page, setPage] = useState<number>(0);

  const renderDeliveryLine = (quote: any, key: any) => (
    <View style={styles.summaryRow} key={`d-quote-${key}-price`}>
      <Text variant="labelLarge" style={styles.subTotal}>
        {quote?.title}
      </Text>
      <Text variant="labelLarge" style={styles.subTotal}>
        ₹{Number(quote?.value).toFixed(2)}
      </Text>
    </View>
  );

  const exploreOtherStores = () => {
    closeFulfilment();
    navigation.navigate('Dashboard');
  };

  const onPageSelected = (e: any) => {
    const {position} = e.nativeEvent;
    setPage(position);
  };

  const showPreviousFulfilment = () => {
    const nextPage = page - 1;
    setPage(nextPage);
    pagerRef.current?.setPage(nextPage);
  };

  const showNextFulfilment = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    pagerRef.current?.setPage(nextPage);
  };

  const orderTotal = Number(productsQuote?.total_payable).toFixed(2);
  const uniqueIdsSet = new Set(
    cartItems[0]?.message?.quote?.fulfillments.map(
      (fulfilment: any) => fulfilment.id,
    ),
  );

  const heightOfPager =
    cartItems[0]?.message?.quote?.fulfillments.length * 100 + 170;

  // Convert Set back to an array if needed
  const unqiueFulfillments = Array.from(uniqueIdsSet);

  const uniqueItems = cartItems[0]?.message?.quote?.items.filter(
    (item: any) => {
      if (item.hasOwnProperty('tags')) {
        const typeTag = item?.tags?.find((tag: any) => tag.code === 'type');
        if (typeTag) {
          const itemCode = typeTag.list.find((tag: any) => tag.code === 'type');
          if (itemCode) {
            return itemCode.value === 'item';
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  );

  return (
    <CloseSheetContainer closeSheet={closeFulfilment}>
      <View style={styles.sheetContainer}>
        <View style={styles.header}>
          <Text variant={'titleLarge'} style={styles.title}>
            {t('Fulfillment.Choose delivery/pickup')}
          </Text>
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
                {t(
                  'Fulfillment.Please try ordering from another store or try again later',
                )}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={exploreOtherStores}>
                <Text variant={'labelLarge'} style={styles.buttonLabel}>
                  {t('Fulfillment.Explore Other Stores')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <PagerView
                initialPage={page}
                onPageSelected={onPageSelected}
                ref={pagerRef}
                style={{
                  height: heightOfPager,
                  backgroundColor: theme.colors.white,
                }}>
                {unqiueFulfillments.map((fulfillmentId: any, index) => {
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
                  const fulfilmentList: any[] =
                    cartItems[0]?.message?.quote?.fulfillments.filter(
                      (fulfillment: any) => fulfillment.id === fulfillmentId,
                    );

                  return (
                    <View key={fulfillmentId}>
                      <View style={styles.fulfilmentSummary}>
                        <View style={styles.fulfilmentCountContainer}>
                          <View>
                            {unqiueFulfillments.length > 1 && (
                              <Text
                                variant={'bodyLarge'}
                                style={styles.fulfilmentCount}>
                                {t('Fulfillment.Fulfilment no', {
                                  current: index + 1,
                                  total: unqiueFulfillments.length,
                                })}
                              </Text>
                            )}
                            <Text
                              variant={'labelMedium'}
                              style={styles.itemCount}>
                              {filteredProducts.length > 1
                                ? `${filteredProducts.length} ${t(
                                    'Fulfillment.Items',
                                  )}`
                                : `${filteredProducts.length} ${t(
                                    'Fulfillment.Item',
                                  )}`}
                            </Text>
                          </View>
                          {unqiueFulfillments.length > 1 && (
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity
                                onPress={showPreviousFulfilment}>
                                <Icon
                                  name={'keyboard-arrow-left'}
                                  size={24}
                                  color={theme.colors.primary}
                                />
                              </TouchableOpacity>
                              <View style={styles.nextPrevSpace} />
                              <TouchableOpacity onPress={showNextFulfilment}>
                                <Icon
                                  name={'keyboard-arrow-right'}
                                  size={24}
                                  color={theme.colors.primary}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                        <ScrollView horizontal>
                          {filteredProducts?.map((item: any) => {
                            const singleProduct = items?.find(
                              (one: any) => one.item.product.id === item.id,
                            );

                            let itemTotal =
                              singleProduct.item.product.price.value *
                              singleProduct.item.quantity.count;
                            singleProduct?.item?.customisations?.forEach(
                              (customization: any) => {
                                itemTotal +=
                                  customization.quantity.count *
                                  customization.item_details.price.value;
                              },
                            );
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
                                  variant={'labelSmall'}
                                  style={styles.productQuantity}>
                                  {t('Fulfillment.Qty')}{' '}
                                  {singleProduct?.item?.quantity?.count}
                                </Text>
                              </View>
                            );
                          })}
                        </ScrollView>
                        {unqiueFulfillments.length > 1 && (
                          <View style={styles.fulfilmentTotal}>
                            <Text
                              variant={'bodyMedium'}
                              style={styles.itemsTotal}>
                              {t('Fulfillment.Items Total')}
                            </Text>
                            <Text
                              variant={'bodyMedium'}
                              style={styles.itemsTotal}>
                              ₹{fulfillmentTotal.toFixed(2)}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.listContainer}>
                        <ScrollView>
                          {fulfilmentList.map((fulfilment: any) => {
                            const fulfilmentPresent: boolean =
                              selectedFulfillmentList.includes(fulfilment.id);
                            return (
                              <View
                                key={`${fulfilment.id}${fulfilment.type}`}
                                style={styles.fulfilment}>
                                <RadioButton.Android
                                  value={fulfilment['@ondc/org/category']}
                                  status={
                                    fulfilmentPresent ? 'checked' : 'unchecked'
                                  }
                                  onPress={() => {
                                    if (!fulfilmentPresent) {
                                      setSelectedFulfillmentList(
                                        selectedFulfillmentList.concat([
                                          fulfilment.id,
                                        ]),
                                      );
                                    }
                                  }}
                                />
                                <View style={styles.customerMeta}>
                                  <Text
                                    variant={'bodyMedium'}
                                    style={styles.fulfilmentCategory}>
                                    {fulfilment['@ondc/org/category']}
                                  </Text>
                                  {fulfilment.hasOwnProperty(
                                    '@ondc/org/TAT',
                                  ) && (
                                    <Text
                                      variant={'bodyLarge'}
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
                      </View>
                    </View>
                  );
                })}
              </PagerView>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text variant="bodyLarge" style={styles.subTotal}>
                    {t('Fulfillment.Item Total')}{' '}
                    {unqiueFulfillments.length > 0
                      ? `(${uniqueItems?.length} ${t('Fulfillment.Items')})`
                      : ''}
                  </Text>
                  <Text variant="bodyLarge" style={styles.subTotal}>
                    ₹{cartTotal}
                  </Text>
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
                  <Text variant="titleMedium" style={styles.toPay}>
                    {t('Fulfillment.To Pay')}
                  </Text>
                  <Text variant="headlineSmall" style={styles.totalOrder}>
                    ₹{orderTotal}
                  </Text>
                </View>
                <TouchableOpacity
                  disabled={selectedFulfillmentList.length === 0}
                  style={[
                    styles.button,
                    selectedFulfillmentList.length === 0
                      ? globalStyles.disabledContainedButton
                      : {},
                  ]}
                  onPress={showPaymentOption}>
                  <Text variant={'bodyLarge'} style={styles.buttonLabel}>
                    {t('Fulfillment.Proceed to Pay')}
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
      backgroundColor: colors.neutral50,
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
    fulfilmentCategory: {
      color: colors.neutral400,
    },
    duration: {
      color: colors.success600,
      marginTop: 4,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    toPay: {
      color: colors.neutral400,
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
      backgroundColor: colors.neutral100,
    },
    sheetContainer: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      backgroundColor: colors.white,
      maxHeight: screenHeight - 150,
    },
    header: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral100,
    },
    title: {
      color: colors.neutral400,
    },
    button: {
      marginTop: 28,
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 13,
      alignItems: 'center',
      height: 44,
    },
    buttonLabel: {
      color: colors.white,
    },
    errorContainer: {
      alignItems: 'center',
    },
    errorMessage: {
      marginTop: 8,
    },
    fulfilmentSummary: {
      backgroundColor: colors.white,
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
      color: colors.neutral400,
      marginVertical: 4,
      width: 85,
    },
    productQuantity: {
      color: colors.neutral300,
    },
    fulfilmentTotal: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    itemsTotal: {
      color: colors.neutral400,
    },
    fulfilment: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    summaryContainer: {
      padding: 16,
      backgroundColor: colors.white,
    },
    fulfilmentCountContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
    },
    fulfilmentCount: {
      color: colors.neutral400,
    },
    itemCount: {
      color: colors.neutral400,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nextPrevSpace: {
      width: 20,
    },
    totalOrder: {
      color: colors.primary,
    },
    subTotal: {
      color: colors.neutral400,
    },
  });

export default Fulfillment;
