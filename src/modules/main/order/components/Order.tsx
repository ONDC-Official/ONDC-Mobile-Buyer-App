import moment from 'moment';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import {Text, useTheme} from 'react-native-paper';
import OrderStatus from './OrderStatus';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CURRENCY_SYMBOLS, FB_DOMAIN} from '../../../../utils/constants';

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
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToDetails = () =>
    navigation.navigate('OrderDetails', {orderId: order.id});

  const navigateToProvider = () => {
    const routeParams: any = {
      brandId: `${order?.bppId}_${order?.domain}_${order?.provider?.id}`,
    };

    if (order?.domain === FB_DOMAIN) {
      routeParams.outletId = order?.provider?.locations[0]?.id;
    }
    navigation.navigate('BrandDetails', routeParams);
  };

  order.state = order.items?.every(
    (item: any) => item.cancellation_status === 'Cancelled',
  )
    ? 'Cancelled'
    : order.state;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={navigateToProvider}>
        <FastImage
          source={{uri: order?.provider?.descriptor?.symbol}}
          style={styles.providerImage}
        />
        <View style={styles.providerNameContainer}>
          <Text variant={'bodyMedium'}>
            {order?.provider?.descriptor?.name}
          </Text>
        </View>
        <View>{order.state && <OrderStatus status={order.state} />}</View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.orderDetails} onPress={navigateToDetails}>
        {order?.items?.map((item: any) => (
          <Text
            key={`${item?.id}${item.fulfillment_id}`}
            variant={'labelMedium'}
            style={styles.item}>
            {item?.quantity?.count} x {item?.product?.descriptor?.name}
          </Text>
        ))}
        <View style={styles.paymentDetails}>
          <Text style={styles.date} variant={'labelMedium'}>
            {moment(order?.createdAt).format('DD MMM YYYY hh:mm a')}
          </Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amount} variant={'labelMedium'}>
              {CURRENCY_SYMBOLS[order?.payment?.params?.currency]}
              {order?.payment?.params?.amount}
            </Text>
            <Icon name={'chevron-right'} size={10} color={'#686868'} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
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
      backgroundColor: '#ECF3F8',
      padding: 12,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    providerImage: {
      width: 32,
      height: 32,
    },
    providerNameContainer: {
      flex: 1,
      paddingHorizontal: 8,
    },
    item: {
      color: '#686868',
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    orderDetails: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderLeftColor: '#E8E8E8',
      borderRightColor: '#E8E8E8',
      borderBottomColor: '#E8E8E8',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      paddingHorizontal: 16,
    },
    paymentDetails: {
      borderTopWidth: 1,
      borderColor: '#E8E8E8',
      paddingTop: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    date: {
      color: '#1A1A1A',
    },
    amount: {
      color: '#1A1A1A',
      fontWeight: '700',
      alignItems: 'center',
      marginRight: 8,
    },
    amountContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
  });
