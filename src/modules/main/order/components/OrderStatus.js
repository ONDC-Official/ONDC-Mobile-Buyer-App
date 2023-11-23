import React from "react";
import { Chip, withTheme } from "react-native-paper";

const OrderStatus = ({ status, theme }) => {
  switch (status) {
    case "Created":
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.primary}
          style={{ backgroundColor: theme.colors.statusBackground }}>
          {status}
        </Chip>
      );

    case "Shipped":
    case "Updated":
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.primary}
          style={{ backgroundColor: theme.colors.shippedBackground }}>
          {status}
        </Chip>
      );

    case "Delivered":
    case "Active":
    case "Completed":
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.surface}
          style={{ backgroundColor: theme.colors.deliveredBackground }}>
          {status}
        </Chip>
      );

    case "Returned":
    case "Cancelled":
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.primary}
          style={{ backgroundColor: theme.colors.cancelledBackground }}>
          {status}
        </Chip>
      );

    default:
      return (
        <Chip
          mode="flat"
          selectedColor={theme.colors.primary}
          style={{ backgroundColor: theme.colors.statusBackground }}>
          {status}
        </Chip>
      );
  }
};

export default withTheme(OrderStatus);
