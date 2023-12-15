import React, {useEffect, useRef, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import OrderStatus from '../../components/OrderStatus';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

interface OrderSummary {
  orderDetails: any;
  onUpdateOrder: () => void;
  onUpdateTrackingDetails: () => void;
}

const OrderSummary: React.FC<OrderSummary> = ({
  orderDetails,
  onUpdateOrder,
  onUpdateTrackingDetails,
}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {person, contact, location} = orderDetails?.fulfillments[0]?.end;
  return (
    <View>
      <View style={styles.section}>
        <View style={styles.orderStatus}>
          {orderDetails?.state && <OrderStatus status={orderDetails?.state} />}
        </View>
        <View style={styles.orderNumberContainer}>
          <Text variant="labelMedium" style={styles.orderNumberLabel}>
            Order Number
          </Text>
          <Text variant="bodyMedium" style={styles.orderNumber}>
            {orderDetails?.id}
          </Text>
        </View>
        <View style={styles.orderNumberContainer}>
          <Text variant="labelMedium" style={styles.orderNumberLabel}>
            Order On
          </Text>
          <Text variant="bodyMedium" style={styles.orderNumber}>
            {moment(orderDetails?.createdAt).format('DD MMM YYYY')}
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text variant={'titleSmall'} style={styles.sectionTitle}>
          Shipping Address
        </Text>
        <Text variant={'bodyMedium'}>{person?.name}</Text>
        <Text variant={'bodySmall'} style={styles.addressDetails}>
          {contact?.phone}
        </Text>
        <Text variant={'bodySmall'} style={styles.addressDetails}>
          {location?.address?.building}, {location?.address?.locality},{' '}
          {location?.address?.city}, {location?.address?.state},{' '}
          {location?.address?.area_code}
        </Text>
      </View>
      <View style={styles.section}>
        <Text variant={'titleSmall'} style={styles.sectionTitle}>
          Shipment Details
        </Text>
        {orderDetails?.items?.map((item: any, index: number) => {
          const type = item?.tags?.find((one: any) => one.code === 'type');
          const isItem =
            type?.list?.findIndex(
              (one: any) => one.value === 'item' && one.code === 'type',
            ) > -1;
          if (isItem) {
            return (
              <View
                style={[
                  styles.product,
                  index < orderDetails?.items?.length - 1
                    ? styles.productDivider
                    : {},
                ]}
                key={item?.id}>
                <View style={styles.imageContainer}>
                  <FastImage
                    source={{uri: item?.product?.descriptor?.symbol}}
                    style={styles.image}
                  />
                </View>
                <View>
                  <Text variant={'labelMedium'} style={styles.productName}>
                    {item?.product?.descriptor?.name}
                  </Text>
                  <View style={styles.productMeta}>
                    <Text variant={'bodySmall'} style={styles.quantity}>
                      QTY: {item?.quantity?.count} *{' '}
                      {item?.product?.price?.value}
                    </Text>
                    <Text variant={'bodyMedium'} style={styles.productAmount}>
                      {item?.quantity?.count * item?.product?.price?.value}
                    </Text>
                  </View>
                </View>
              </View>
            );
          } else {
            return <View key={item?.id} />;
          }
        })}
      </View>
      <View style={styles.section}>
        <Text variant={'titleSmall'} style={styles.sectionTitle}>
          Payment Details
        </Text>
        <Text variant={'bodyMedium'}>Payment Method</Text>
        <Text variant={'bodySmall'} style={styles.addressDetails}>
          {orderDetails?.payment?.type === 'ON-FULFILLMENT'
            ? 'Cash on delivery'
            : 'Prepaid'}
        </Text>
        <View style={styles.divider} />
        <Text variant={'bodyMedium'} style={styles.addressField}>
          Billed Address
        </Text>
        <Text variant={'bodyMedium'} style={styles.addressField}>
          {orderDetails?.billing?.name}
        </Text>
        <Text variant={'bodySmall'} style={styles.addressDetails}>
          {orderDetails?.billing?.email}, {orderDetails?.billing?.phone}
        </Text>
        <Text variant={'bodySmall'} style={styles.addressDetails}>
          {orderDetails?.billing?.address?.building},{' '}
          {orderDetails?.billing?.address?.locality},{' '}
          {orderDetails?.billing?.address?.city},{' '}
          {orderDetails?.billing?.address?.state},{' '}
          {orderDetails?.billing?.address?.area_code}
        </Text>
      </View>
      <View style={styles.section}>
        <Text variant={'titleSmall'} style={styles.sectionTitle}>
          Customer Details
        </Text>
        <Text variant={'bodyMedium'} style={styles.fieldLabel}>
          Order Number
        </Text>
        <Text variant={'bodySmall'} style={styles.fieldValue}>
          {orderDetails?.id}
        </Text>

        <Text variant={'bodyMedium'} style={styles.fieldLabel}>
          Payment mode
        </Text>
        <Text variant={'bodySmall'} style={styles.fieldValue}>
          {orderDetails?.payment?.type === 'ON-FULFILLMENT'
            ? 'Cash on delivery'
            : 'Prepaid'}
        </Text>

        <Text variant={'bodyMedium'} style={styles.fieldLabel}>
          Customer Name
        </Text>
        <Text variant={'bodySmall'} style={styles.fieldValue}>
          {orderDetails?.billing?.name}
        </Text>

        <Text variant={'bodyMedium'} style={styles.fieldLabel}>
          Phone Number
        </Text>
        <Text variant={'bodySmall'} style={styles.fieldValue}>
          {orderDetails?.billing?.phone}
        </Text>

        <Text variant={'bodyMedium'} style={styles.fieldLabel}>
          Date
        </Text>
        <Text variant={'bodySmall'} style={styles.fieldValue}>
          {moment(orderDetails?.createdAt).format('DD/MM/yy')} at{' '}
          {moment(orderDetails?.createdAt).format('hh:mma')}
        </Text>

        <Text variant={'bodyMedium'} style={styles.fieldLabel}>
          Delivered To
        </Text>
        <Text variant={'bodySmall'} style={styles.fieldValue}>
          {person?.name}
        </Text>

        <View style={styles.actionContainer}>
        <Button
          mode="outlined"
          onPress={() => Linking.openURL(orderDetails?.documents?.[0]?.url)}
          disabled={!orderDetails?.documents}>
          Download Invoice
        </Button>
        </View>
      </View>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    orderStatus: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
      marginBottom: 24,
    },
    orderNumberContainer: {
      marginBottom: 12,
    },
    orderNumberLabel: {
      color: '#5F5F5F',
      marginBottom: 4,
    },
    orderNumber: {
      color: '#222',
    },
    section: {
      paddingHorizontal: 16,
      borderBottomWidth: 12,
      borderBottomColor: '#E8E8E8',
      paddingVertical: 28,
    },
    sectionTitle: {
      color: '#000',
      marginBottom: 12,
    },
    addressDetails: {
      marginTop: 8,
      color: '#686868',
    },
    product: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 16,
    },
    imageContainer: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: '#ECECEC',
      padding: 8,
      marginRight: 16,
    },
    image: {
      width: 64,
      height: 64,
    },
    productName: {
      fontWeight: 'bold',
      color: '#1D1D1D',
      marginBottom: 12,
    },
    productMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    quantity: {
      color: '#686868',
    },
    productAmount: {
      color: '#222',
    },
    productDivider: {
      borderBottomWidth: 1,
      borderBottomColor: '#CACDD8',
    },
    divider: {
      height: 1,
      backgroundColor: '#979797',
      marginTop: 8,
    },
    addressField: {
      marginTop: 12,
    },
    fieldLabel: {
      marginTop: 12,
      color: '#000',
    },
    fieldValue: {
      marginVertical: 8,
      color: '#1D1D1D',
    },
    actionContainer: {
      marginTop: 32,
    },
  });

export default OrderSummary;
