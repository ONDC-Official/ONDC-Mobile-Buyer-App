import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Text, useTheme} from 'react-native-paper';
import React from 'react';
import {makeGlobalStyles} from '../../../../styles/styles';

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
  const theme = useTheme();
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
        <Text variant={'bodyMedium'} style={styles.quantity}>
          {itemQty}
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
            variant={'bodyMedium'}
            style={
              itemOutOfStock || productLoading
                ? globalStyles.disabledContainedButtonText
                : globalStyles.containedButtonText
            }>
            {update ? 'Update' : 'Add'} Item Total - ₹
            {(product?.item_details?.price.value + customizationPrices) *
              itemQty}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    product: {
      paddingHorizontal: 16,
      flexDirection: 'row',
    },
    customizationButtons: {
      marginVertical: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    quantityContainer: {
      borderRadius: 8,
      borderColor: '#008ECC',
      borderWidth: 1,
      backgroundColor: '#ECF3F8',
      flexDirection: 'row',
      height: 44,
      alignItems: 'center',
      marginRight: 15,
      padding: 10,
    },
    quantity: {
      alignItems: 'center',
      textAlign: 'center',
      minWidth: 36,
      color: '#008ECC',
    },
    decrementButton: {
      marginRight: 4,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    incrementButton: {
      marginLeft: 4,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
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
