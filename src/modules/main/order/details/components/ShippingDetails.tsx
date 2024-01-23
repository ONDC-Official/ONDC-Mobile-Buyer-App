import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import moment from 'moment/moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState} from 'react';

const ShippingDetails = ({orderDetails}: {orderDetails: any}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [showDetails, setShowDetails] = useState<boolean>(true);

  return (
    <View style={styles.shippingContainer}>
      <Text variant={'bodyLarge'} style={styles.shippingTitle}>
        Shipment Details
      </Text>
      <Text variant={'bodyMedium'} style={styles.shippingTitle}>
        {orderDetails?.items?.length} Item(s) Arriving
      </Text>
      <TouchableOpacity
        style={styles.accordion}
        onPress={() => setShowDetails(!showDetails)}>
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
        <Icon
          name={showDetails ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
        />
      </TouchableOpacity>
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
  });

export default ShippingDetails;
