import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import moment from 'moment/moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {useAppTheme} from '../../../../../utils/theme';

const ShippingDetails = ({fullfillmentId}: {fullfillmentId: string}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  const fulfilmentIndex = orderDetails?.fulfillments.findIndex(
    (one: any) => one.id === fullfillmentId,
  );

  const fulfillmentHistory = orderDetails?.fulfillmentHistory.filter(
    (one: any) => one.id === fullfillmentId,
  );

  const fulfilment = orderDetails?.fulfillments[fulfilmentIndex];

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
              {moment(fulfilment?.end?.time?.range?.end).format('DD-MM-YYYY')}
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
        fulfillmentHistory.map((history: any, index: number) => (
          <View key={history?._id} style={styles.statusContainer}>
            <View style={styles.status}>
              <View>
                <Icon name={'check-circle'} color={'#419E6B'} size={20} />
                {index < fulfillmentHistory.length - 1 && (
                  <View style={styles.link} />
                )}
              </View>
              <Text variant={'labelMedium'} style={styles.state}>
                {history?.state.replace(/-/g, ' ')}
              </Text>
            </View>
            <Text variant={'labelMedium'} style={styles.timestamp}>
              {moment(history?.createdAt).format('ddd, DD MMM hh:mm A')}
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
      marginBottom: 12,
    },
    arrivalLabel: {
      color: '#686868',
    },
    arrivalDate: {
      color: colors.neutral400,
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
    timestamp: {
      paddingTop: 4,
      color: '#8A8A8A',
    },
  });

export default ShippingDetails;
