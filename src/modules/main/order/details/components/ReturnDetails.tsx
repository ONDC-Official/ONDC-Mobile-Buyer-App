import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import moment from 'moment/moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';

const ReturnDetails = ({fulfilmentId}: {fulfilmentId: string}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  const fulfillmentHistory = orderDetails?.fulfillmentHistory.filter(
    (one: any) => one.id === fulfilmentId,
  );

  const returnInitiated = fulfillmentHistory.find(
    (one: any) => one.state === 'Return_Initiated',
  );

  const fulfilment = orderDetails?.fulfillments.find((one: any) => one.id === fulfilmentId);
  const returnTag = fulfilment.tags.find(
    (tag: any) => tag.code === 'return_request',
  );
  const itemTag = returnTag.list.find(
    (tag: any) => tag.code === 'item_quantity',
  );

  return (
    <View style={styles.shippingContainer}>
      <Text variant={'bodyLarge'} style={styles.shippingTitle}>
        Return Details
      </Text>
      <Text variant={'bodyMedium'} style={styles.shippingTitle}>
        {itemTag.value} Item(s) Returned
      </Text>
      <TouchableOpacity
        style={styles.accordion}
        onPress={() => setShowDetails(!showDetails)}>
        <View style={styles.accordionTitle}>
          <Text variant={'labelMedium'} style={styles.arrivalLabel}>
            Return On:
          </Text>
          <Text variant={'labelMedium'} style={styles.arrivalDate}>
            {moment(returnInitiated.createdAt).format('DD-MM-YYYY')}
          </Text>
        </View>
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
    timestamp: {
      paddingTop: 4,
      color: '#8A8A8A',
    },
  });

export default ReturnDetails;
