import React from 'react';
import {Chip, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';

interface OrderStatus {
  status: string;
}

const OrderStatus: React.FC<OrderStatus> = ({status}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  switch (status) {
    case 'Created':
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.primary}
          style={styles.created}>
          {status}
        </Chip>
      );

    case 'Shipped':
    case 'Updated':
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.primary}
          style={styles.shipped}>
          {status}
        </Chip>
      );

    case 'Delivered':
    case 'Active':
    case 'Completed':
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.surface}
          style={styles.completed}>
          {status}
        </Chip>
      );

    case 'Returned':
    case 'Cancelled':
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.primary}
          style={styles.cancelled}>
          {status}
        </Chip>
      );

    default:
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.primary}
          style={styles.created}>
          {status}
        </Chip>
      );
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    created: {backgroundColor: colors.statusBackground},
    shipped: {backgroundColor: colors.shippedBackground},
    completed: {backgroundColor: colors.deliveredBackground},
    cancelled: {backgroundColor: colors.cancelledBackground},
  });

export default OrderStatus;
