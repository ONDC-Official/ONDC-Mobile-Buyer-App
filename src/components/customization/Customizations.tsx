import {Text} from 'react-native-paper';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../utils/theme';
import useFormatNumber from '../../hooks/useFormatNumber';

const Customizations = ({cartItem}: {cartItem: any}) => {
  const {formatNumber} = useFormatNumber();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const {customisations} = cartItem.item;
  if (customisations && customisations.length > 0) {
    return (
      <Text variant={'labelSmall'} style={styles.label}>
        {customisations.map((customization: any, index: number) => {
          const isLastItem = index === customisations.length - 1;
          return `${
            customization.item_details.descriptor.name
          } (₹${formatNumber(customization.item_details.price.value)})${
            isLastItem ? '' : ' + '
          }`;
        })}
      </Text>
    );
  }

  return <></>;
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    label: {
      color: colors.neutral300,
    },
  });

export default Customizations;
