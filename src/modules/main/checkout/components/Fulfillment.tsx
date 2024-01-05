import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import React from 'react';
import moment from 'moment';

interface Fulfillment {
  selectedFulfillment: any;
  setSelectedFulfillment: (newValue: any) => void;
  cartItems: any[];
  productsQuote: any;
  closeFulfilment: () => void;
  cartTotal: string;
  showPaymentOption: () => void;
}

const Fulfillment: React.FC<Fulfillment> = ({
  selectedFulfillment,
  setSelectedFulfillment,
  cartItems,
  productsQuote,
  closeFulfilment,
  cartTotal,
  showPaymentOption,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const renderDeliveryLine = (quote: any, key: any) => (
    <View style={styles.summaryRow} key={`d-quote-${key}-price`}>
      <Text variant="bodySmall">{quote?.title}</Text>
      <Text variant="bodySmall">₹{Number(quote?.value).toFixed(2)}</Text>
    </View>
  );

  const orderTotal = Number(productsQuote?.total_payable).toFixed(2);
  return (
    <>
      <View style={styles.header}>
        <Text variant={'bodyMedium'}>Choose delivery/pickup</Text>
        <IconButton icon={'close-circle'} onPress={closeFulfilment} />
      </View>
      <ScrollView style={styles.listContainer}>
        {cartItems[0]?.message?.quote?.fulfillments?.map((fulfillment: any) => (
          <TouchableOpacity
            key={fulfillment.id}
            style={[
              styles.customerRow,
              fulfillment.id === selectedFulfillment
                ? styles.active
                : styles.normal,
            ]}
            onPress={() => setSelectedFulfillment(fulfillment.id)}>
            <Text variant={'bodyMedium'} style={styles.customerMeta}>
              {fulfillment['@ondc/org/category']}
            </Text>
            {fulfillment.hasOwnProperty('@ondc/org/TAT') && (
              <Text variant={'labelMedium'} style={styles.customerMeta}>
                Delivery By:{' '}
                {moment()
                  .add(moment.duration(fulfillment['@ondc/org/TAT']))
                  .format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            )}
          </TouchableOpacity>
        ))}
        <View style={styles.summaryRow}>
          <Text variant="bodyMedium">Item Total</Text>
          <Text variant="bodyMedium">₹{cartTotal}</Text>
        </View>
        {productsQuote?.providers.map((provider: any, pindex: number) => {
          const {delivery} = provider;
          return (
            <View key={`delivery${pindex}`}>
              {delivery.delivery &&
                renderDeliveryLine(delivery.delivery, 'delivery')}
              {delivery.discount &&
                renderDeliveryLine(delivery.discount, 'discount')}
              {delivery.tax && renderDeliveryLine(delivery.tax, 'tax')}
              {delivery.packing &&
                renderDeliveryLine(delivery.packing, 'packing')}
              {delivery.misc && renderDeliveryLine(delivery.misc, 'misc')}
            </View>
          );
        })}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text variant="bodyLarge">To Pay</Text>
          <Text variant="titleSmall">₹{orderTotal}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={showPaymentOption}>
          <Text variant={'labelLarge'} style={styles.buttonLabel}>
            Proceed to Pay ₹{orderTotal}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    listContainer: {
      padding: 16,
      backgroundColor: '#F9F9F9',
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
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
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
      backgroundColor: '#CACDD8',
    },
    header: {
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      marginTop: 20,
      backgroundColor: colors.primary,
      borderRadius: 22,
      padding: 12,
      alignItems: 'center',
    },
    buttonLabel: {
      color: '#fff',
    },
  });

export default Fulfillment;
