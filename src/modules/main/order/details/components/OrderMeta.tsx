import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import CancelOrderButton from './CancelOrderButton';
import {useAppTheme} from '../../../../../utils/theme';

const OrderMeta = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);
  const {address} = orderDetails?.fulfillments[0]?.end?.location;

  return (
    <View style={styles.container}>
      <Text variant={'headlineSmall'} style={styles.title}>
        Order Details
      </Text>
      <View style={styles.metaContainer}>
        <Text variant={'bodyLarge'} style={styles.label}>
          Order Number
        </Text>
        <Text variant={'bodyMedium'} style={styles.value}>
          {orderDetails?.id}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text variant={'bodyLarge'} style={styles.label}>
          Payment mode
        </Text>
        <Text variant={'bodyMedium'} style={styles.value}>
          {orderDetails?.payment?.type === 'ON-FULFILLMENT'
            ? 'Cash on delivery'
            : 'Prepaid'}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text variant={'bodyLarge'} style={styles.label}>
          Date
        </Text>
        <Text variant={'bodyMedium'} style={styles.value}>
          {moment(orderDetails?.createdAt).format('DD/MM/YY hh:mm a')}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text variant={'bodyLarge'} style={styles.label}>
          Phone Number
        </Text>
        <Text variant={'bodyMedium'} style={styles.value}>
          {orderDetails?.billing?.phone}
        </Text>
      </View>
      <View>
        <Text variant={'bodyLarge'} style={styles.label}>
          Delivery Address
        </Text>
        <Text variant={'bodyMedium'} style={styles.value}>
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
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral100,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      marginBottom: 12,
      marginTop: 12,
    },
    title: {
      color: colors.neutral400,
      marginBottom: 12,
    },
    metaContainer: {
      marginBottom: 16,
    },
    label: {
      color: colors.neutral400,
      marginBottom: 8,
    },
    value: {
      color: colors.neutral300,
    },
  });

export default OrderMeta;
