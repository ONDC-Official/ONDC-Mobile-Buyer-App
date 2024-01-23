import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import React from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import CancelOrderButton from './CancelOrderButton';

const OrderMeta = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);
  const {address} = orderDetails?.fulfillments[0]?.end?.location;

  return (
    <View style={styles.container}>
      <Text variant={'titleMedium'} style={styles.title}>
        Order Details
      </Text>
      <View style={styles.metaContainer}>
        <Text variant={'bodyMedium'} style={styles.label}>
          Order Number
        </Text>
        <Text variant={'bodySmall'} style={styles.value}>
          {orderDetails?.id}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text variant={'bodyMedium'} style={styles.label}>
          Payment mode
        </Text>
        <Text variant={'bodySmall'} style={styles.value}>
          {orderDetails?.payment?.type === 'ON-FULFILLMENT'
            ? 'Cash on delivery'
            : 'Prepaid'}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text variant={'bodyMedium'} style={styles.label}>
          Date
        </Text>
        <Text variant={'bodySmall'} style={styles.value}>
          {moment(orderDetails?.createdAt).format('DD/MM/YY hh:mm a')}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text variant={'bodyMedium'} style={styles.label}>
          Phone Number
        </Text>
        <Text variant={'bodySmall'} style={styles.value}>
          {orderDetails?.billing?.phone}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text variant={'bodyMedium'} style={styles.label}>
          Delivery Address
        </Text>
        <Text variant={'bodySmall'} style={styles.value}>
          {address?.locality}, {address?.building}, {address?.city},{' '}
          {address?.state}, {address?.country} - {address?.area_code}
        </Text>
      </View>
      <CancelOrderButton />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#E8E8E8',
      marginHorizontal: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      marginBottom: 12,
      marginTop: 12,
    },
    title: {
      color: '#1A1A1A',
      marginBottom: 12,
    },
    metaContainer: {
      marginBottom: 16,
    },
    label: {
      color: '#1A1A1A',
      marginBottom: 8,
    },
    value: {
      color: '#686868',
    },
  });

export default OrderMeta;
