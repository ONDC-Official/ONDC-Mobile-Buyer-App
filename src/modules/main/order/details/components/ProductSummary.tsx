import {Button, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {CURRENCY_SYMBOLS} from '../../../../../utils/constants';
import {useAppTheme} from '../../../../../utils/theme';
import {isItemCustomization} from '../../../../../utils/utils';

const ProductSummary = ({
  items,
  quote,
  fulfilment,
}: {
  items: any[];
  quote: any;
  fulfilment: any;
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant={'headlineSmall'} style={styles.sectionTitle}>
          {t('Product Summary.Your Items')}
        </Text>
      </View>
      {items.map((item, index) => {
        const cancellable = item?.product['@ondc/org/cancellable'];
        const returnable = item?.product['@ondc/org/returnable'];
        const itemCustomization = isItemCustomization(item.tags);

        if (itemCustomization) {
          return <View key={item.id} />;
        }

        const associatedItems = items.filter(
          (one: any) =>
            one.parent_item_id === item.parent_item_id && one.id !== item.id,
        );

        let returnedCount = 0;
        const returnFulfilments = orderDetails.fulfillments.filter(
          (fulfilment: any) => fulfilment.type === 'Return',
        );
        returnFulfilments.forEach((fulfillment: any) => {
          const returnTag = fulfillment.tags.find(
            (tag: any) => tag.code === 'return_request',
          );
          const itemTag = returnTag.list.find(
            (tag: any) => tag.code === 'item_id',
          );
          const itemQuantityTag = returnTag.list.find(
            (tag: any) => tag.code === 'item_quantity',
          );
          if (itemTag && itemQuantityTag) {
            if (itemTag.value === item.id) {
              returnedCount += Number(itemQuantityTag.value);
            }
          }
        });

        return (
          <View
            key={item.id}
            style={[styles.item, index > 0 ? styles.itemBorderTop : {}]}>
            <View style={styles.itemMeta}>
              <FastImage
                source={{uri: item?.product?.descriptor?.symbol}}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  <Text variant={'bodyLarge'} style={styles.itemName}>
                    {item?.product?.descriptor?.name}
                  </Text>
                  <View style={styles.itemQuantityContainer}>
                    <Text variant={'labelSmall'} style={styles.quantity}>
                      {t('Fulfillment.Qty')} {item?.quantity?.count}
                    </Text>
                    <Text variant={'labelLarge'} style={styles.itemPrice}>
                      {CURRENCY_SYMBOLS[item?.product?.price?.currency]}
                      {Number(
                        item?.quantity?.count * item?.product?.price?.value,
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>
                {item.product?.quantity?.unitized &&
                  Object.keys(item.product?.quantity?.unitized).map(one => (
                    <Text
                      variant={'labelSmall'}
                      style={styles.label}
                      key={item.product?.quantity?.unitized[one].value}>
                      {item.product?.quantity?.unitized[one].value}{' '}
                      {item.product?.quantity?.unitized[one].unit}
                    </Text>
                  ))}
                <View style={styles.chipContainer}>
                  {cancellable ? (
                    <View style={styles.chip}>
                      <Text variant={'labelSmall'} style={styles.chipLabel}>
                        {t('Profile.Cancellable')}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.chip}>
                      <Text variant={'labelSmall'} style={styles.chipLabel}>
                        {t('Profile.Non-cancellable')}
                      </Text>
                    </View>
                  )}
                  {returnable ? (
                    <View style={styles.chip}>
                      <Text variant={'labelSmall'} style={styles.chipLabel}>
                        {t('Profile.Returnable')}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.chip}>
                      <Text variant={'labelSmall'} style={styles.chipLabel}>
                        {t('Profile.Non-returnable')}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {returnable &&
              (fulfilment?.state?.descriptor?.code === 'Order-delivered' ||
                fulfilment?.state?.descriptor?.code === 'Completed') &&
              item.quantity?.count - returnedCount > 0 && (
                <Button
                  mode={'outlined'}
                  compact
                  style={styles.returnItem}
                  onPress={() =>
                    navigation.navigate('ReturnItem', {
                      item,
                      maxReturnCount: item.quantity?.count - returnedCount,
                      associatedItems,
                      providerId: orderDetails?.provider?.id,
                      state: orderDetails?.state,
                      orderId: orderDetails?.id,
                      bppId: orderDetails?.bppId,
                      bppUrl: orderDetails?.bpp_uri,
                      transactionId: orderDetails?.transactionId,
                    })
                  }>
                  {t('Return Item.Return Item')}
                </Button>
              )}
          </View>
        );
      })}
      <View style={styles.summaryContainer}>
        {quote?.breakup
          ?.filter((one: any) => one['@ondc/org/title_type'] !== 'item')
          .map((one: any) => (
            <View key={one?.title} style={styles.summaryRow}>
              <Text variant={'labelMedium'} style={styles.taxName}>
                {one?.title}
              </Text>
              <Text variant={'labelMedium'} style={styles.taxValue}>
                {CURRENCY_SYMBOLS[one?.price?.currency]}
                {one?.price?.value}
              </Text>
            </View>
          ))}
      </View>
      <View style={styles.divider} />
      <View style={styles.grossTotal}>
        <Text variant={'titleMedium'} style={styles.grossTotalLabel}>
          {t('Product Summary.Order Total')}
        </Text>
        <Text variant={'headlineSmall'} style={styles.grossTotalValue}>
          {CURRENCY_SYMBOLS[quote?.price?.currency]}
          {quote?.price?.value}
        </Text>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: colors.neutral100,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      marginTop: 12,
      paddingBottom: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    providerMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerImage: {
      width: 30,
      height: 30,
      marginRight: 8,
    },
    sectionTitle: {
      color: colors.neutral400,
    },
    callButton: {
      width: 28,
      height: 28,
      borderWidth: 1,
      borderRadius: 28,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    orderId: {
      marginBottom: 12,
    },
    item: {
      paddingVertical: 12,
    },
    itemBorderTop: {
      borderTopColor: colors.neutral100,
      borderTopWidth: 1,
    },
    itemImage: {
      width: 32,
      height: 32,
      borderRadius: 8,
      marginRight: 10,
    },
    itemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    itemDetails: {
      flex: 1,
    },
    itemHeader: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chipContainer: {
      flexDirection: 'row',
      marginTop: 4,
    },
    returnItem: {
      borderRadius: 8,
      marginTop: 12,
      borderColor: colors.primary,
    },
    chip: {
      marginRight: 4,
      backgroundColor: colors.neutral100,
      paddingHorizontal: 8,
      borderRadius: 22,
    },
    chipLabel: {
      color: colors.neutral300,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemQuantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemName: {
      color: colors.neutral400,
    },
    quantity: {
      color: colors.neutral300,
    },
    itemPrice: {
      color: colors.neutral300,
      marginLeft: 12,
    },
    summaryContainer: {
      marginTop: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    taxName: {
      color: colors.neutral400,
    },
    taxValue: {
      color: colors.neutral400,
      fontWeight: '700',
    },
    divider: {
      marginVertical: 20,
      width: '100%',
      height: 1,
      backgroundColor: colors.neutral100,
    },
    grossTotal: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    grossTotalLabel: {
      color: colors.neutral400,
    },
    grossTotalValue: {
      color: colors.primary,
    },
    label: {
      color: colors.neutral300,
    },
  });

export default ProductSummary;
