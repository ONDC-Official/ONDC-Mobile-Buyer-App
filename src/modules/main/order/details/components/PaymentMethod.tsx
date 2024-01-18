import {StyleSheet, View} from 'react-native';
import {Divider, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

const PaymentMethod = ({payment}: {payment: any}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Text variant={'titleSmall'} style={styles.title}>
        Payment Methods
      </Text>
      <View style={styles.modeContainer}>
        <Text variant={'bodySmall'} style={styles.mode}>
          {payment?.type === 'ON-FULFILLMENT' ? 'Cash On Delivery' : 'Prepaid'}
        </Text>
        <Icon name={'chevron-right'} size={20} color={'#686868'} />
      </View>
      <Divider style={styles.divider} />
      <Text variant={'titleSmall'} style={styles.title}>
        Shipping Address
      </Text>
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
      marginTop: 24,
      paddingBottom: 8,
    },
    title: {
      marginBottom: 4,
    },
    mode: {
      color: '#686868',
    },
    modeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    divider: {
      marginVertical: 12,
    },
  });

export default PaymentMethod;
