import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {withTheme} from 'react-native-paper';

import {ORDER_STATUS} from '../../../../utils/Constants';

const OrderStatus = ({status, theme}) => {
  const {colors} = theme;

  switch (status) {
    case ORDER_STATUS.created:
      return (
        <View
          style={[
            styles.orderStatus,
            {
              borderColor: colors.primary,
              backgroundColor: colors.statusBackground,
            },
          ]}>
          <Text style={{color: colors.primary}}>Created</Text>
        </View>
      );

    case ORDER_STATUS.shipped:
      return (
        <View
          style={[
            styles.orderStatus,
            {
              borderColor: colors.warning,
              backgroundColor: colors.shippedBackground,
            },
          ]}>
          <Text style={{color: colors.white}}>Shipped</Text>
        </View>
      );

    case ORDER_STATUS.delivered:
      return (
        <View
          style={[
            styles.orderStatus,
            {
              borderColor: colors.success,
              backgroundColor: colors.deliveredBackground,
            },
          ]}>
          <Text style={{color: colors.white}}>Delivered</Text>
        </View>
      );

    case ORDER_STATUS.active:
      return (
        <View
          style={[
            styles.orderStatus,
            {
              borderColor: colors.success,
              backgroundColor: colors.deliveredBackground,
            },
          ]}>
          <Text style={{color: colors.white}}>Active</Text>
        </View>
      );

    case ORDER_STATUS.cancelled:
      return (
        <View
          style={[
            styles.orderStatus,
            {
              borderColor: colors.error,
              backgroundColor: colors.cancelledBackground,
            },
          ]}>
          <Text style={{color: colors.error}}>Cancelled</Text>
        </View>
      );

    case ORDER_STATUS.returned:
      return (
        <View
          style={[
            styles.orderStatus,
            {
              borderColor: colors.error,
              backgroundColor: colors.cancelledBackground,
            },
          ]}>
          <Text style={{color: colors.error}}>Returned</Text>
        </View>
      );

    case ORDER_STATUS.replaced:
      return (
        <View
          style={[
            styles.orderStatus,
            {
              borderColor: colors.error,
              backgroundColor: colors.cancelledBackground,
            },
          ]}>
          <Text style={{color: colors.error}}>Replaced</Text>
        </View>
      );

    case ORDER_STATUS.updated:
      return (
        <View
          style={[
            styles.orderStatus,
            {
              borderColor: colors.warning,
              backgroundColor: colors.shippedBackground,
            },
          ]}>
          <Text style={{color: colors.white}}>Updated</Text>
        </View>
      );

    default:
      return (
        <View
          style={[
            styles.orderStatus,
            {
              borderColor: colors.primary,
              backgroundColor: colors.statusBackground,
            },
          ]}>
          <Text style={{color: colors.primary}}>Ordered</Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  orderStatus: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginLeft: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
  },
});

export default withTheme(OrderStatus);
