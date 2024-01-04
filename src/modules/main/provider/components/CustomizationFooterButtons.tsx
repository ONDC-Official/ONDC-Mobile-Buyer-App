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
          style={styles.incrementButton}
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

const makeStyles = (colors: any) =>
  StyleSheet.create({
    product: {
      paddingHorizontal: 16,
      flexDirection: 'row',
    },
    customizationButtons: {
      marginTop: 28,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    quantityContainer: {
      borderRadius: 6,
      borderColor: '#E8E8E8',
      borderWidth: 1,
      backgroundColor: '#FFF',
      flexDirection: 'row',
      height: 40,
      alignItems: 'center',
      marginRight: 18,
    },
    quantity: {
      alignItems: 'center',
      textAlign: 'center',
      minWidth: 50,
    },
    incrementButton: {
      paddingHorizontal: 10,
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
