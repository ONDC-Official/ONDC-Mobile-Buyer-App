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
        <View style={[styles.container, styles.created]}>
          <Text variant={'labelLarge'} style={styles.createdLabel}>
            {status}
          </Text>
        </View>
      );

    case 'Shipped':
    case 'Updated':
      return (
        <View style={[styles.container, styles.shipped]}>
          <Text variant={'labelLarge'} style={styles.createdLabel}>
            {status}
          </Text>
        </View>
      );

    case 'Delivered':
    case 'Active':
    case 'Completed':
      return (
        <View style={[styles.container, styles.completed]}>
          <Text variant={'labelLarge'} style={styles.completedLabel}>
            {status}
          </Text>
        </View>
      );

    case 'Returned':
    case 'Cancelled':
      return (
        <View style={[styles.container, styles.cancelled]}>
          <Text variant={'labelLarge'} style={styles.cancelledLabel}>
            {status}
          </Text>
        </View>
      );

    default:
      return (
        <View style={[styles.container, styles.created]}>
          <Text variant={'labelLarge'} style={styles.createdLabel}>
            {status}
          </Text>
        </View>
      );
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 21,
    },
    created: {
      backgroundColor: colors.primary50,
    },
    shipped: {
      backgroundColor: colors.primary50,
    },
    completed: {
      backgroundColor: colors.success50,
    },
    cancelled: {
      backgroundColor: colors.error50,
    },
    createdLabel: {
      color: colors.primary,
    },
    cancelledLabel: {
      color: colors.error600,
    },
    completedLabel: {
      color: colors.success600,
    },
  });

export default OrderStatus;
