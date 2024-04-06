import moment from 'moment';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OrderStatus from './OrderStatus';
import {CURRENCY_SYMBOLS, FB_DOMAIN} from '../../../../utils/constants';
import {useAppTheme} from '../../../../utils/theme';
import {isItemCustomization} from '../../../../utils/utils';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';

interface Order {
  order: any;
}

/**
 * Component to render single card on orders screen
 * @param order: single order object
 * @constructor
 * @returns {JSX.Element}
 */
const OrderHeader: React.FC<Order> = ({order}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetails = () =>
    navigation.navigate('OrderDetails', {orderId: order.id});

  order.state = order.items?.every(
    (item: any) => item.cancellation_status === 'Cancelled',
  )
    ? 'Cancelled'
    : order.state;

  return (
    <TouchableOpacity onPress={navigateToDetails} style={styles.container}>
      <View style={styles.header}>
        <FastImage
          source={{uri: order?.provider?.descriptor?.symbol}}
          style={styles.providerImage}
        />
        <View style={styles.providerNameContainer}>
          <Text variant={'bodyLarge'} style={styles.providerName}>
            {order?.provider?.descriptor?.name}
          </Text>
          <Text variant={'labelMedium'} style={styles.providerAddress}>
            {order?.fulfillments[0]?.start?.location?.address?.locality}{' '}
            {order?.fulfillments[0]?.start?.location?.address?.city}
          </Text>
        </View>
        <View>{order.state && <OrderStatus status={order.state} />}</View>
      </View>
      <View style={styles.orderDetails}>
        {order?.items?.map((item: any) => {
          const isCustomization = isItemCustomization(item?.tags);

          if (isCustomization) {
            return <View key={`${item?.id}${item.fulfillment_id}`} />;
          }

          return (
            <View
              key={`${item?.id}${item.fulfillment_id}`}
              style={styles.itemContainer}>
              {order.domain === FB_DOMAIN && (
                <View style={styles.iconContainer}>
                  <VegNonVegTag tags={item?.product?.tags} size={'small'} />
                </View>
              )}
              <Text
                key={`${item?.id}${item.fulfillment_id}`}
                variant={'labelMedium'}
                style={styles.item}>
                {item?.quantity?.count} x {item?.product?.descriptor?.name}
              </Text>
            </View>
          );
        })}
        <View style={styles.paymentDetails}>
          <Text style={styles.date} variant={'labelSmall'}>
            {moment(order?.createdAt).format('DD MMM YYYY hh:mm a')}
          </Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amount} variant={'labelLarge'}>
              {CURRENCY_SYMBOLS[order?.payment?.params?.currency]}
              {order?.payment?.params?.amount}
            </Text>
            <Icon
              name={'keyboard-arrow-right'}
              size={16}
              color={theme.colors.neutral300}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderHeader;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.primary50,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    providerImage: {
      width: 32,
      height: 32,
    },
    providerName: {
      color: colors.neutral400,
    },
    providerAddress: {
      color: colors.neutral300,
    },
    providerNameContainer: {
      flex: 1,
      paddingHorizontal: 8,
    },
    itemContainer: {
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      marginRight: 8,
    },
    item: {
      color: colors.neutral300,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    orderDetails: {
      padding: 12,
      borderBottomWidth: 1,
      borderLeftColor: colors.neutral100,
      borderRightColor: colors.neutral100,
      borderBottomColor: colors.neutral100,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    paymentDetails: {
      borderTopWidth: 1,
      borderColor: colors.neutral100,
      paddingTop: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    date: {
      color: colors.neutral400,
    },
    amount: {
      color: colors.neutral400,
      alignItems: 'center',
      marginRight: 8,
    },
    amountContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
  });
