import {Text} from 'react-native-paper';
import React from 'react';
import {StyleSheet} from 'react-native';
import useFormatNumber from '../../../../../hooks/useFormatNumber';
import {useAppTheme} from '../../../../../utils/theme';

const ItemCustomization = ({
  itemCustomizationList,
}: {
  itemCustomizationList: any;
}) => {
  const {formatNumber} = useFormatNumber();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  if (itemCustomizationList?.length > 0) {
    return (
      <Text variant={'labelSmall'} style={styles.label}>
        {itemCustomizationList?.map((customization: any, index: number) => {
          const isLastItem = index === itemCustomizationList?.length - 1;
          return `${
            customization?.product?.item_details?.descriptor?.name
          } (₹${formatNumber(
            customization?.product?.item_details?.price?.value,
          )})${isLastItem ? '' : ' + '}`;
        })}
      </Text>
    );
  } else {
    return <></>;
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    label: {
      color: colors.neutral300,
    },
  });

export default ItemCustomization;
