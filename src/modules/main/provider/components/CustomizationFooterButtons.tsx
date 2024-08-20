import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Text} from 'react-native-paper';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {hasNotch} from 'react-native-device-info';
import {makeGlobalStyles} from '../../../../styles/styles';
import {useAppTheme} from '../../../../utils/theme';
import useFormatNumber from '../../../../hooks/useFormatNumber';

const CustomizationFooterButtons = ({
  productLoading,
  itemQty,
  setItemQty,
  itemOutOfStock,
  addDetailsToCart,
  product,
  customizationPrices,
  update = false,
}: {
  productLoading: boolean;
  itemQty: number;
  setItemQty: (quantity: number) => void;
  itemOutOfStock: boolean;
  addDetailsToCart: () => void;
  product: any;
  customizationPrices: any;
  update?: boolean;
}) => {
  const {formatNumber} = useFormatNumber();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const globalStyles = makeGlobalStyles(theme.colors);
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.customizationButtons}>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          disabled={productLoading}
          style={styles.decrementButton}
          onPress={() => {
            if (itemQty > 1) {
              setItemQty(itemQty - 1);
            }
          }}>
          <Icon
            name={'minus'}
            color={productLoading ? theme.colors.border : theme.colors.primary}
          />
        </TouchableOpacity>
        <Text variant={'titleMedium'} style={styles.quantity}>
          {formatNumber(itemQty)}
        </Text>
        <TouchableOpacity
          disabled={productLoading || itemOutOfStock}
          style={styles.incrementButton}
          onPress={() => setItemQty(itemQty + 1)}>
          <Icon
            name={'plus'}
            color={productLoading ? theme.colors.border : theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        disabled={itemOutOfStock || productLoading}
        style={[
          styles.addToCardButton,
          itemOutOfStock || productLoading
            ? globalStyles.disabledContainedButton
            : globalStyles.containedButton,
        ]}
        onPress={addDetailsToCart}>
        {productLoading ? (
          <ActivityIndicator size={14} color={theme.colors.primary} />
        ) : (
          <Text
            variant={'bodyLarge'}
            style={
              itemOutOfStock || productLoading
                ? globalStyles.disabledContainedButtonText
                : globalStyles.containedButtonText
            }>
            {update
              ? t('Product Summary.Update Item Total', {
                  total: `₹${formatNumber(
                    Number(
                      (product?.item_details?.price.value +
                        customizationPrices) *
                        itemQty,
                    ).toFixed(2),
                  )}`,
                })
              : t('Product Summary.Add Item Total', {
                  total: `₹${formatNumber(
                    Number(
                      (
                        (product?.item_details?.price.value +
                          customizationPrices) *
                        itemQty
                      ).toFixed(2),
                    ),
                  )}`,
                })}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    product: {
      paddingHorizontal: 16,
      flexDirection: 'row',
    },
    customizationButtons: {
      marginBottom: hasNotch() ? 16 : 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      backgroundColor: colors.neutral50,
    },
    quantityContainer: {
      borderRadius: 8,
      borderColor: colors.primary,
      borderWidth: 1,
      backgroundColor: colors.primary50,
      flexDirection: 'row',
      height: 44,
      width: 108,
      alignItems: 'center',
      marginRight: 15,
      padding: 12,
    },
    quantity: {
      alignItems: 'center',
      textAlign: 'center',
      minWidth: 36,
      color: colors.primary,
    },
    decrementButton: {
      marginRight: 4,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
    },
    incrementButton: {
      marginLeft: 4,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
    },
    addToCardButton: {
      flex: 1,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
  });

export default CustomizationFooterButtons;
