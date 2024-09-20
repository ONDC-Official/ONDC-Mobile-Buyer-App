import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import {useAppTheme} from '../../../../utils/theme';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import {makeGlobalStyles} from '../../../../styles/styles';

interface ListProductUI {
  defaultPrice: any;
  disabled: boolean;
  currency: any;
  priceRange: any;
  product: any;
  productLoading: boolean;
  showProductDetails: () => void;
  productImageSource: any;
  cartItemDetails: any;
  removeQuantityClick: () => void;
  incrementProductQuantity: () => void;
  customizable: boolean;
  inStock: boolean;
  addToCart: () => {};
}

const ListProductUI: React.FC<ListProductUI> = ({
  defaultPrice,
  disabled,
  currency,
  priceRange,
  product,
  productLoading,
  showProductDetails,
  productImageSource,
  cartItemDetails,
  removeQuantityClick,
  incrementProductQuantity,
  customizable,
  inStock,
  addToCart,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const globalStyles = makeGlobalStyles(theme.colors);
  const {formatNumber} = useFormatNumber();

  const renderPrice = () => {
    if (defaultPrice) {
      console.log('defaultPrice', defaultPrice, typeof defaultPrice);
      return (
        <Text variant={'labelLarge'} style={styles.price}>
          {currency}
          {formatNumber(defaultPrice)}
        </Text>
      );
    } else if (priceRange) {
      const min = formatNumber(priceRange?.minPrice);
      const max = formatNumber(priceRange?.maxPrice);
      return (
        <Text variant={'labelLarge'} style={styles.price}>
          {currency}
          {min}- {currency}
          {max}
        </Text>
      );
    } else if (product?.item_details?.price?.value) {
      return (
        <Text variant={'labelLarge'} style={styles.price}>
          {currency}
          {formatNumber(product?.item_details?.price?.value)}
        </Text>
      );
    } else {
      return <></>;
    }
  };

  // @ts-ignore
  return (
    <>
      <View style={styles.product}>
        <TouchableOpacity
          style={styles.meta}
          disabled={disabled}
          onPress={showProductDetails}>
          <Text
            variant={'labelLarge'}
            style={styles.name}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {product?.item_details?.descriptor?.name}
          </Text>
          <Text
            variant={'labelSmall'}
            style={styles.category}
            numberOfLines={5}
            ellipsizeMode={'tail'}>
            {product?.item_details?.descriptor?.short_desc}
          </Text>
          {renderPrice()}
        </TouchableOpacity>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.imageContainer}
            disabled={disabled}
            onPress={showProductDetails}>
            {disabled ? (
              <Grayscale>
                <FastImage style={styles.image} source={productImageSource} />
              </Grayscale>
            ) : (
              <FastImage style={styles.image} source={productImageSource} />
            )}
            <View style={styles.productTag}>
              <VegNonVegTag tags={product?.item_details?.tags} />
            </View>
          </TouchableOpacity>
          {cartItemDetails?.productQuantity > 0 ? (
            <View style={styles.buttonContainer}>
              <View
                style={[
                  disabled
                    ? globalStyles.disabledOutlineButton
                    : globalStyles.outlineButton,
                  styles.quantityContainer,
                  styles.actionButton,
                ]}>
                <TouchableOpacity
                  onPress={removeQuantityClick}
                  disabled={disabled}>
                  <Icon name={'minus'} color={theme.colors.primary} size={18} />
                </TouchableOpacity>
                <Text
                  variant={'bodyLarge'}
                  style={[
                    disabled
                      ? globalStyles.disabledOutlineButtonText
                      : globalStyles.outlineButtonText,
                  ]}>
                  {productLoading ? (
                    <ActivityIndicator size={18} />
                  ) : (
                    formatNumber(cartItemDetails?.productQuantity)
                  )}
                </Text>
                <TouchableOpacity
                  disabled={disabled}
                  onPress={incrementProductQuantity}>
                  <Icon name={'plus'} color={theme.colors.primary} size={18} />
                </TouchableOpacity>
              </View>
              {customizable && (
                <Text variant={'labelSmall'} style={styles.customise}>
                  {t('Cart.FBProduct.Customizable')}
                </Text>
              )}
            </View>
          ) : inStock ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  disabled
                    ? globalStyles.disabledOutlineButton
                    : globalStyles.outlineButton,
                  styles.addButton,
                  styles.actionButton,
                ]}
                onPress={addToCart}
                disabled={disabled}>
                <Text
                  variant={'bodyLarge'}
                  style={[
                    disabled
                      ? globalStyles.disabledOutlineButtonText
                      : globalStyles.outlineButtonText,
                  ]}>
                  {t('Cart.FBProduct.Add')}
                </Text>
              </TouchableOpacity>
              {customizable && (
                <Text variant={'labelSmall'} style={styles.customise}>
                  {t('Cart.FBProduct.Customizable')}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.outOfStockButtonContainer}>
              <Text variant={'bodyLarge'} style={styles.outOfStock}>
                {t('Cart.List.Out of stock')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    product: {
      paddingHorizontal: 16,
      flexDirection: 'row',
    },
    meta: {
      flex: 1,
      paddingRight: 20,
    },
    actionContainer: {
      width: 126,
      alignItems: 'center',
    },
    imageContainer: {
      marginBottom: 12,
      height: 126,
    },
    image: {
      width: 126,
      height: 126,
      borderRadius: 16,
    },
    outOfStockButtonContainer: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      opacity: 0.9,
      width: 126,
      paddingVertical: 10,
      marginTop: 50,
    },
    buttonContainer: {
      marginTop: -28,
    },
    name: {
      color: colors.neutral400,
    },
    price: {
      color: colors.neutral400,
    },
    category: {
      color: colors.neutral300,
      marginBottom: 4,
    },
    actionButton: {
      width: 72,
      height: 28,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: colors.white,
    },
    quantityContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    addButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 17,
    },
    outOfStock: {
      textAlign: 'center',
      color: colors.neutral300,
    },
    customise: {
      textAlign: 'center',
      color: colors.neutral300,
      marginTop: 4,
    },
    productTag: {
      marginTop: -118,
      marginLeft: 98,
    },
  });

export default ListProductUI;
