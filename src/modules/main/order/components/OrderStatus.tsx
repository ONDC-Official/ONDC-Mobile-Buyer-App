import React from 'react';
import {Text, useTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

interface OrderStatus {
  status: string;
}

const OrderStatus: React.FC<OrderStatus> = ({status}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  switch (status) {
    case 'Created':
      return (
        <View style={styles.created}>
          <Text variant={'labelMedium'} style={styles.createdLabel}>
            {status}
          </Text>
        </View>
      );

    case 'Shipped':
    case 'Updated':
      return (
        <View style={styles.shipped}>
          <Text variant={'labelMedium'} style={styles.createdLabel}>
            {status}
          </Text>
        </View>
      );

    case 'Delivered':
    case 'Active':
    case 'Completed':
      return (
        <View style={styles.completed}>
          <Text variant={'labelMedium'} style={styles.createdLabel}>
            {status}
          </Text>
        </View>
      );

    case 'Returned':
    case 'Cancelled':
      return (
        <View style={styles.cancelled}>
          <Text variant={'labelMedium'} style={styles.createdLabel}>
            {status}
          </Text>
        </View>
      );

    default:
      return (
        <View style={styles.created}>
          <Text variant={'labelMedium'} style={styles.createdLabel}>
            {status}
          </Text>
        </View>
      );
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    created: {
      backgroundColor: colors.statusBackground,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
    shipped: {
      backgroundColor: colors.shippedBackground,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
    completed: {
      backgroundColor: colors.deliveredBackground,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
    cancelled: {
      backgroundColor: colors.cancelledBackground,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
    createdLabel: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

export default OrderStatus;
