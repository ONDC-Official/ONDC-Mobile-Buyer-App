import moment from 'moment';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import {Text, useTheme} from 'react-native-paper';
import OrderStatus from './OrderStatus';

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

  order.state = order.items?.every(
    (item: any) => item.cancellation_status === 'Cancelled',
  )
    ? 'Cancelled'
    : order.state;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant={'labelSmall'} style={styles.orderNumberLabel}>
            Order Number
          </Text>
          <Text variant={'labelSmall'} style={styles.orderNumber}>
            {order.id}
          </Text>
        </View>
        <View>{order.state && <OrderStatus status={order.state} />}</View>
      </View>
      <View style={styles.orderDateContainer}>
        <Text variant={'labelSmall'} style={styles.orderOn}>
          Order On:&nbsp;
        </Text>
        <Text variant={'labelSmall'} style={styles.orderDate}>
          {moment(order.createdAt).format('Do MMMM YYYY')}
        </Text>
      </View>
      <View style={styles.row}>
        <View style={styles.imagesRow}>
          {order?.items?.map((item: any) => {
            const type = item?.tags?.find((one: any) => one.code === 'type');
            const isItem =
              type?.list?.findIndex(
                (one: any) => one.value === 'item' && one.code === 'type',
              ) > -1;
            if (isItem) {
              return (
                <View style={styles.imageContainer} key={item?.id}>
                  <FastImage
                    source={{uri: item?.product?.descriptor?.symbol}}
                    style={styles.image}
                  />
                </View>
              );
            } else {
              return <View key={item?.id} />;
            }
          })}
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate('OrderDetails', {order: order})}>
          <Text style={styles.detailsLabel} variant={'labelMedium'}>
            Order Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderHeader;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    orderNumberLabel: {
      color: '#5F5F5F',
    },
    orderNumber: {
      color: '#222',
    },
    orderOn: {
      color: '#686868',
    },
    orderDateContainer: {
      marginVertical: 12,
      flexDirection: 'row',
    },
    orderDate: {
      color: '#151515',
    },
    imagesRow: {
      flexDirection: 'row',
    },
    imageContainer: {
      padding: 10,
      borderRadius: 8,
      width: 50,
      height: 50,
      marginRight: 8,
      backgroundColor: '#ECECEC',
    },
    image: {
      width: 30,
      height: 30,
    },
    detailsButton: {
      paddingVertical: 7,
      paddingHorizontal: 8,
      borderColor: colors.primary,
      borderRadius: 8,
      borderWidth: 1,
    },
    detailsLabel: {
      color: colors.primary,
    },
  });
