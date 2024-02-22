import React from 'react';
import {Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '../../../../utils/theme';

interface OrderStatus {
  status: string;
}

const OrderStatus: React.FC<OrderStatus> = ({status}) => {
  const theme = useAppTheme();
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
          <Text variant={'labelMedium'} style={styles.completedLabel}>
            {status}
          </Text>
        </View>
      );

    case 'Returned':
    case 'Cancelled':
      return (
        <View style={styles.cancelled}>
          <Text variant={'labelMedium'} style={styles.cancelledLabel}>
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
      borderRadius: 21,
    },
    shipped: {
      backgroundColor: colors.shippedBackground,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 21,
    },
    completed: {
      backgroundColor: colors.deliveredBackground,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 21,
    },
    cancelled: {
      backgroundColor: colors.cancelledBackground,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 21,
    },
    createdLabel: {
      color: colors.primary,
      fontWeight: '600',
    },
    cancelledLabel: {
      color: colors.error,
      fontWeight: '600',
    },
    completedLabel: {
      color: colors.success,
      fontWeight: '600',
    },
  });

export default OrderStatus;
