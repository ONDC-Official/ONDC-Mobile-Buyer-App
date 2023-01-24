import React from 'react';
import {Chip, withTheme} from 'react-native-paper';

const OrderStatus = ({status, theme}) => (
  <Chip mode="outlined" selectedColor={theme.colors.primary}>
    {status}
  </Chip>
);

export default withTheme(OrderStatus);
