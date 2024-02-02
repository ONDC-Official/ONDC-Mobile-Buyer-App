import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import moment from 'moment/moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';

const ShippingDetails = ({fullfillmentId}: {fullfillmentId: string}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  const fulfilmentIndex = orderDetails?.fulfillments.findIndex(
    (one: any) => one.id === fullfillmentId,
  );

  return (
    <View style={styles.shippingContainer}>
      <Text variant={'bodyLarge'} style={styles.shippingTitle}>
        Shipment Details ({fulfilmentIndex + 1}/
        {orderDetails?.fulfillments.length})
      </Text>
      <Text variant={'bodyMedium'} style={styles.shippingTitle}>
        {orderDetails?.items?.length} Item(s) Arriving
      </Text>
      <TouchableOpacity
        style={styles.accordion}
        onPress={() => setShowDetails(!showDetails)}>
        {orderDetails?.state !== 'Completed' ? (
          <View style={styles.accordionTitle}>
            <Text variant={'labelMedium'} style={styles.arrivalLabel}>
              Arriving On:
            </Text>
            <Text variant={'labelMedium'} style={styles.arrivalDate}>
              {moment(
                orderDetails?.fulfillments[0]?.end?.time?.range?.end,
              ).format('DD-MM-YYYY')}
            </Text>
          </View>
        ) : (
          <View style={styles.accordionTitle}>
            <Text variant={'labelMedium'} style={styles.arrivalLabel}>
              Delivered On:
            </Text>
            <Text variant={'labelMedium'} style={styles.arrivalDate}>
              {moment(orderDetails?.updatedAt).format('DD-MM-YYYY')}
            </Text>
          </View>
        )}
        <Icon
          name={showDetails ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
        />
      </TouchableOpacity>
      {showDetails &&
        orderDetails?.orderHistory?.map((history: any, index: number) => (
          <View key={history?._id} style={styles.statusContainer}>
            <View style={styles.status}>
              <View>
                <Icon name={'check-circle'} color={'#419E6B'} size={20} />
                {index < orderDetails?.orderHistory.length - 1 && (
                  <View style={styles.link} />
                )}
              </View>
              <Text variant={'labelMedium'} style={styles.state}>
                {history?.state}
              </Text>
            </View>
            <Text variant={'labelMedium'}>
              {moment(history?.createdAt).format('ll')}
            </Text>
          </View>
        ))}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    shippingContainer: {
      borderRadius: 8,
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#E8E8E8',
      marginHorizontal: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      marginTop: 24,
      paddingBottom: 8,
    },
    shippingTitle: {
      marginBottom: 12,
      fontWeight: '600',
    },
    accordion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    accordionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    arrivalLabel: {
      color: '#686868',
    },
    arrivalDate: {
      color: '#1A1A1A',
      marginLeft: 8,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    status: {
      flexDirection: 'row',
    },
    link: {
      height: 30,
      borderLeftColor: '#419E6B',
      borderLeftWidth: 2,
      marginLeft: 9,
    },
    state: {
      fontWeight: '700',
      color: '#1D1D1D',
      paddingTop: 4,
      paddingLeft: 8,
    },
  });

export default ShippingDetails;
