import {Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  CANCELLATION_REASONS,
  CANCELLATION_REASONS_SELLER,
  CURRENCY_SYMBOLS,
  RETURN_REASONS,
} from '../../../../../utils/constants';
import ReturnStatus from './ReturnStatus';
import {useAppTheme} from '../../../../../utils/theme';
import {isItemCustomization} from '../../../../../utils/utils';

const today = moment();

const SingleItem = ({
  item,
  customizations,
}: {
  item: any;
  customizations: any[];
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const itemCustomization = isItemCustomization(item.tags);

  if (itemCustomization) {
    return <View key={item.id} />;
  }

  const itemCustomizationList = customizations?.filter(
    (obj: any) => obj.parent_item_id === item.parent_item_id,
  );

  return (
    <View key={item.id} style={styles.item}>
      <FastImage
        source={{uri: item?.product?.descriptor?.symbol}}
        style={styles.itemImage}
      />
      <View style={styles.itemMeta}>
        <View style={styles.itemTitleRow}>
          <Text variant={'labelMedium'} style={styles.itemName}>
            {item?.product?.descriptor?.name}
          </Text>
          <View style={styles.quantityContainer}>
            <Text variant={'labelMedium'} style={styles.quantity}>
              {t('Fulfillment.Qty')} {item?.quantity?.count}
            </Text>
            <Text variant={'labelLarge'} style={styles.price}>
              {CURRENCY_SYMBOLS[item?.product?.price?.currency]}
              {Number(
                item?.quantity?.count * item?.product?.price?.value,
              ).toFixed(2)}
            </Text>
          </View>
        </View>
        {itemCustomizationList?.length > 0 && (
          <Text variant={'labelSmall'} style={styles.label}>
            {itemCustomizationList?.map((customization: any, index: number) => {
              const isLastItem = index === itemCustomizationList?.length - 1;
              return `${
                customization?.product?.item_details?.descriptor?.name
              } (₹${customization?.product?.item_details?.price?.value})${
                isLastItem ? '' : ' + '
              }`;
            })}
          </Text>
        )}
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
        <View style={styles.itemTags}>
          {item?.product['@ondc/org/cancellable'] ? (
            <View style={styles.chip}>
              <Text variant={'labelSmall'} style={styles.chipText}>
                {t('Profile.Cancellable')}
              </Text>
            </View>
          ) : (
            <View style={styles.chip}>
              <Text variant={'labelSmall'} style={styles.chipText}>
                {t('Profile.Non-cancellable')}
              </Text>
            </View>
          )}
          {item?.product['@ondc/org/returnable'] ? (
            <View style={styles.chip}>
              <Text variant={'labelSmall'} style={styles.chipText}>
                {t('Profile.Returnable')}
              </Text>
            </View>
          ) : (
            <View style={styles.chip}>
              <Text variant={'labelSmall'} style={styles.chipText}>
                {t('Profile.Non-returnable')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const ItemDetails = ({
  fulfillments,
  items,
}: {
  fulfillments: any[];
  items: any[];
}) => {
  const {t} = useTranslation();
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [shipmentFulfillmentList, setShipmentFulfillmentList] = useState<any[]>(
    [],
  );
  const [returnFulfillmentList, setReturnFulfillmentList] = useState<any[]>([]);
  const [cancelFulfillmentList, setCancelFulfillmentList] = useState<any[]>([]);

  const renderReason = (reasonId: string) => {
    const value = RETURN_REASONS.find(one => one.key === reasonId)?.value;

    return (
      <Text variant={'labelSmall'} style={styles.reason}>
        {t(`Return Reason.${value}`)}
      </Text>
    );
  };

  const renderCancelReason = (reasonId: string) => {
    let value = CANCELLATION_REASONS.find(one => one.key === reasonId)?.value;

    if (value) {
      return (
        <Text variant={'labelSmall'} style={styles.reason}>
          {t(`Cancellation Reason.${value}`)}
        </Text>
      );
    } else {
      value = CANCELLATION_REASONS_SELLER.find(
        one => one.key === reasonId,
      )?.value;
      return (
        <Text variant={'labelSmall'} style={styles.reason}>
          {t(`Cancellation Reason.${value}`)}
        </Text>
      );
    }
  };

  useEffect(() => {
    const shipments: any[] = [];
    const returns: any[] = [];
    const cancels: any[] = [];

    fulfillments.forEach((fulfillment: any) => {
      switch (fulfillment.type) {
        case 'Delivery':
          shipments.push(fulfillment);
          break;

        case 'Return':
          returns.push(fulfillment);
          break;

        case 'Cancel':
          cancels.push(fulfillment);
          break;
      }
    });
    setShipmentFulfillmentList(shipments);
    setReturnFulfillmentList(returns);
    setCancelFulfillmentList(cancels);
  }, [fulfillments]);

  return (
    <>
      {shipmentFulfillmentList.length > 0 && (
        <View>
          <Text variant={'titleLarge'} style={styles.fulfilmentTitle}>
            {t('Profile.Shipment Details')}
          </Text>
          {shipmentFulfillmentList?.map((fulfillment: any) => {
            const endDate = fulfillment?.end?.time?.timestamp
              ? moment(fulfillment?.end?.time?.timestamp)
              : moment(fulfillment?.end?.time?.range?.end);
            const filteredItems = items.filter(
              item => item.fulfillment_id === fulfillment.id,
            );
            const customizations = filteredItems?.filter(obj =>
              obj?.tags?.some(
                (tag: any) =>
                  tag?.code === 'type' &&
                  tag?.list?.some(
                    (item: any) =>
                      item?.code === 'type' && item?.value === 'customization',
                  ),
              ),
            );

            return (
              <View key={fulfillment.id} style={styles.container}>
                <View style={styles.header}>
                  {fulfillment?.end?.time?.timestamp ? (
                    <View>
                      <Text variant={'labelSmall'} style={styles.deliveryDate}>
                        {t('Shipment Details.Delivered On')}{' '}
                      </Text>
                      <Text variant={'labelSmall'} style={styles.deliveryDate}>
                        {today.isSame(endDate, 'day')
                          ? endDate.format('hh:mm a')
                          : endDate.format('Do MMM')}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text variant={'labelSmall'} style={styles.deliveryDate}>
                        {t('Item Details.Items will be delivered by')}{' '}
                      </Text>
                      <Text variant={'labelSmall'} style={styles.deliveryDate}>
                        {today.isSame(endDate, 'day')
                          ? endDate.format('hh:mm a')
                          : endDate.format('Do MMM')}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.statusContainer}
                    onPress={() =>
                      navigation.navigate('OrderProductDetails', {
                        fulfillmentId: fulfillment.id,
                      })
                    }>
                    <ReturnStatus code={fulfillment?.state?.descriptor?.code} />
                    <Icon
                      name={'keyboard-arrow-right'}
                      size={20}
                      color={theme.colors.neutral300}
                    />
                  </TouchableOpacity>
                </View>
                {filteredItems.map((item, index) =>
                  item?.quantity?.count > 0 ? (
                    <SingleItem
                      key={`${item.id}${index}ShipmentFulfillment`}
                      item={item}
                      customizations={customizations}
                    />
                  ) : (
                    <View key={`${item.id}${index}ShipmentFulfillment`} />
                  ),
                )}
              </View>
            );
          })}
        </View>
      )}

      {returnFulfillmentList.length > 0 && (
        <View>
          <Text variant={'titleLarge'} style={styles.fulfilmentTitle}>
            {t('Item Details.Return Details')}
          </Text>
          {returnFulfillmentList?.map((fulfillment: any) => {
            const isReturnInitiated =
              fulfillment?.state?.descriptor?.code === 'Return_Initiated';
            const fulfillmentHistory = orderDetails.fulfillmentHistory.filter(
              (one: any) => fulfillment.id === one.id,
            );
            const returnInitiated = fulfillmentHistory.find(
              (one: any) => one.state === 'Return_Initiated',
            );

            let itemId: any = null;
            let reasonId: any = null;
            const returnTag = fulfillment.tags.find(
              (tag: any) => tag.code === 'return_request',
            );
            if (isReturnInitiated) {
              const itemTag = returnTag.list.find(
                (tag: any) => tag.code === 'item_id',
              );
              itemId = itemTag.value;
            }
            const reasonIdTag = returnTag.list.find(
              (tag: any) => tag.code === 'reason_id',
            );
            reasonId = reasonIdTag.value;

            return (
              <View key={fulfillment.id} style={styles.container}>
                <View style={styles.header}>
                  <View>
                    <Text variant={'labelSmall'} style={styles.deliveryDate}>
                      {t('Item Details.Return initiated on')}
                    </Text>
                    <Text variant={'labelSmall'} style={styles.deliveryDate}>
                      {returnInitiated
                        ? today.isSame(moment(returnInitiated.createdAt), 'day')
                          ? moment(returnInitiated.createdAt).format('hh:mm a')
                          : moment(returnInitiated.createdAt).format('Do MMM')
                        : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.statusContainer}
                    onPress={() =>
                      navigation.navigate('OrderReturnDetails', {
                        fulfillmentId: fulfillment.id,
                      })
                    }>
                    <ReturnStatus
                      code={fulfillment?.state?.descriptor?.code}
                      fulfilment={fulfillmentHistory.find(
                        (one: any) =>
                          one.state === fulfillment?.state?.descriptor?.code,
                      )}
                    />
                    <Icon
                      name={'keyboard-arrow-right'}
                      size={20}
                      color={theme.colors.neutral300}
                    />
                  </TouchableOpacity>
                </View>
                {fulfillment?.state?.descriptor?.code === 'Return_Initiated'
                  ? items
                      .filter(item => item.id === itemId)
                      .map((item, index) => (
                        <SingleItem
                          key={`${item.id}${index}ReturnFulfillment`}
                          item={item}
                        />
                      ))
                  : items
                      .filter(item => item.fulfillment_id === fulfillment.id)
                      .map((item, index) => (
                        <SingleItem
                          key={`${item.id}${index}ReturnFulfillment`}
                          item={item}
                        />
                      ))}
                <View style={styles.footer}>{renderReason(reasonId)}</View>
              </View>
            );
          })}
        </View>
      )}

      {cancelFulfillmentList.length > 0 && (
        <View>
          <Text variant={'titleLarge'} style={styles.fulfilmentTitle}>
            {t('Item Details.Cancel Details')}
          </Text>
          {cancelFulfillmentList?.map((fulfillment: any) => {
            const isReturnInitiated =
              fulfillment?.state?.descriptor?.code === 'Cancelled';

            const fulfillmentHistory = orderDetails.fulfillmentHistory.filter(
              (one: any) => fulfillment.id === one.id,
            );
            const cancelInitiated = fulfillmentHistory.find(
              (one: any) => one.state === 'Cancelled',
            );

            let itemId: any = null;
            let cancelId: any = null;
            if (isReturnInitiated) {
              const cancelTag = fulfillment.tags.find(
                (tag: any) => tag.code === 'cancel_request',
              );
              const returnTag = fulfillment.tags.find(
                (tag: any) => tag.code === 'quote_trail',
              );
              const reasonIdTag = cancelTag.list.find(
                (tag: any) => tag.code === 'reason_id',
              );
              const itemTag = returnTag.list.find(
                (tag: any) => tag.code === 'id',
              );
              itemId = itemTag.value;
              cancelId = reasonIdTag.value;
            }

            return (
              <View key={fulfillment.id} style={styles.container}>
                <View style={styles.header}>
                  <View>
                    <Text variant={'labelSmall'} style={styles.deliveryDate}>
                      {t('Item Details.Cancelled on')}
                    </Text>
                    <Text variant={'labelSmall'} style={styles.deliveryDate}>
                      {today.isSame(moment(cancelInitiated.createdAt), 'day')
                        ? moment(cancelInitiated.createdAt).format('hh:mm a')
                        : moment(cancelInitiated.createdAt).format('Do MMM')}
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <ReturnStatus code={fulfillment?.state?.descriptor?.code} />
                  </View>
                </View>
                {fulfillment?.state?.descriptor?.code === 'Cancelled'
                  ? items
                      .filter(
                        item =>
                          item.id === itemId &&
                          item.fulfillment_id === fulfillment.id,
                      )
                      .map((item, index) => (
                        <SingleItem
                          key={`${item.id}${index}CancelFulfillment`}
                          item={item}
                        />
                      ))
                  : items
                      .filter(item => item.fulfillment_id === fulfillment.id)
                      .map((item, index) => (
                        <SingleItem
                          key={`${item.id}${index}CancelFulfillment`}
                          item={item}
                        />
                      ))}
                <View style={styles.footer}>
                  {renderCancelReason(cancelId)}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      backgroundColor: colors.white,
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
      paddingBottom: 12,
      marginBottom: 12,
      borderBottomColor: colors.neutral100,
      borderBottomWidth: 1,
    },
    footer: {
      paddingTop: 12,
      borderTopColor: colors.neutral100,
      borderTopWidth: 1,
    },
    reason: {
      color: colors.neutral300,
    },
    item: {
      marginBottom: 12,
      flexDirection: 'row',
    },
    itemImage: {
      width: 44,
      height: 44,
      borderRadius: 8,
      marginRight: 10,
    },
    itemMeta: {
      flex: 1,
    },
    itemTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantity: {
      color: colors.neutral300,
    },
    itemName: {
      color: colors.neutral400,
      flex: 1,
    },
    itemTags: {
      flexDirection: 'row',
    },
    chip: {
      marginRight: 4,
      backgroundColor: colors.neutral100,
      paddingHorizontal: 8,
      borderRadius: 22,
    },
    chipText: {
      color: colors.neutral300,
    },
    deliveryDate: {
      color: colors.neutral300,
      flex: 1,
      flexWrap: 'wrap',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-end',
      gap: 8,
    },
    price: {
      marginLeft: 12,
      color: colors.neutral300,
    },
    label: {
      color: colors.neutral300,
    },
    fulfilmentTitle: {
      marginTop: 20,
      color: colors.neutral400,
      paddingHorizontal: 16,
    },
  });

export default ItemDetails;
