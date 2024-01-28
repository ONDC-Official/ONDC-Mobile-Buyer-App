import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useSelector} from 'react-redux';

const PaymentMethods = ({navigation}: {navigation: any}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  const {location, contact} = orderDetails?.fulfillments[0]?.end;

  return (
    <View style={styles.pageContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'arrow-back'} size={20} color={'#000'} />
        </TouchableOpacity>
        <Text variant={'titleSmall'} style={styles.pageTitle}>
          Delivery Address
        </Text>
      </View>
      <View style={styles.pageContent}>
        <View style={styles.container}>
          <Text variant={'titleSmall'} style={styles.title}>
            Delivery Address
          </Text>
          {!!location?.address?.name && (
            <Text variant={'bodyMedium'} style={styles.name}>
              {location?.address?.name}
            </Text>
          )}
          <Text variant={'bodySmall'} style={styles.normalText}>
            {contact?.email} {contact?.phone}
          </Text>
          <Text variant={'bodySmall'} style={styles.normalText}>
            {location?.address?.locality}, {location?.address?.building},{' '}
            {location?.address?.city}, {location?.address?.state},{' '}
            {location?.address?.country} - {location?.address?.area_code}
          </Text>
        </View>

        <View style={styles.container}>
          <Text variant={'titleSmall'} style={styles.title}>
            Payment Methods
          </Text>
          <Text variant={'bodySmall'}>
            {orderDetails?.payment?.type === 'ON-FULFILLMENT'
              ? 'Cash On Delivery'
              : 'Prepaid'}
          </Text>
          <Divider style={styles.divider} />
          <Text variant={'titleSmall'} style={styles.title}>
            Billed Address
          </Text>
          {!!orderDetails?.billing?.name && (
            <Text variant={'bodyMedium'} style={styles.name}>
              {orderDetails?.billing?.name}, {orderDetails?.billing?.phone}
            </Text>
          )}
          <Text variant={'bodySmall'}>
            {orderDetails?.billing?.address?.locality},{' '}
            {orderDetails?.billing?.address?.building},{' '}
            {orderDetails?.billing?.address?.city},{' '}
            {orderDetails?.billing?.address?.state},{' '}
            {orderDetails?.billing?.address?.country} -{' '}
            {orderDetails?.billing?.address?.areaCode}
          </Text>
        </View>

        <View style={styles.container}>
          <Text variant={'titleSmall'} style={styles.title}>
            Customer Details
          </Text>
          <View style={styles.customerDetails}>
            <Text variant={'bodyMedium'} style={styles.name}>
              Order Number
            </Text>
            <Text variant={'bodySmall'} style={styles.normalText}>
              {orderDetails?.id}
            </Text>
          </View>
          <View style={styles.customerDetails}>
            <Text variant={'bodyMedium'} style={styles.name}>
              Customer Name
            </Text>
            <Text variant={'bodySmall'} style={styles.normalText}>
              {orderDetails?.billing?.name}
            </Text>
          </View>
          <Text variant={'bodyMedium'} style={styles.name}>
            Phone Number
          </Text>
          <Text variant={'bodySmall'} style={styles.normalText}>
            {orderDetails?.billing?.phone}
          </Text>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    pageTitle: {
      marginLeft: 20,
    },
    pageContent: {
      backgroundColor: '#FAFAFA',
      padding: 16,
      flex: 1,
    },
    container: {
      borderRadius: 8,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#E8E8E8',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
      marginBottom: 12,
    },
    title: {
      marginBottom: 4,
    },
    divider: {
      marginVertical: 12,
    },
    name: {
      color: '#1A1A1A',
      marginBottom: 4,
    },
    normalText: {
      color: '#686868',
      marginBottom: 4,
    },
    customerDetails: {
      marginBottom: 12,
    },
  });

export default PaymentMethods;
