import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Wishlist from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {useTranslation} from 'react-i18next';

import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import {useAppTheme} from '../../../../utils/theme';
import useFormatNumber from '../../../../hooks/useFormatNumber';

interface GridProductUI {
  navigateToProductDetails: () => void;
  disabled: boolean;
  imageSource: any;
  isFBDomain: boolean;
  product: any;
  currency: any;
  addItemToWishlist: () => void;
  cartItemDetails: any;
  removeQuantityClick: () => void;
  productLoading: boolean;
  incrementProductQuantity: () => void;
  addToCart: () => void;
  deleteItemFromWishlist: () => void;
  addedToWishlist: boolean;
}

const GridProductUI: React.FC<GridProductUI> = ({
  navigateToProductDetails,
  disabled,
  imageSource,
  isFBDomain,
  product,
  currency,
  addItemToWishlist,
  cartItemDetails,
  removeQuantityClick,
  productLoading,
  incrementProductQuantity,
  addToCart,
  deleteItemFromWishlist,
  addedToWishlist,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {formatNumber} = useFormatNumber();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToProductDetails} disabled={disabled}>
        {disabled ? (
          <Grayscale>
            <FastImage
              style={styles.gridImage}
              source={imageSource}
              resizeMode={FastImage.resizeMode.cover}
            />
          </Grayscale>
        ) : (
          <FastImage
            style={styles.gridImage}
            source={imageSource}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}

        {isFBDomain && (
          <View style={styles.vegNonVegContainer}>
            <VegNonVegTag tags={product.item_details.tags} />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={navigateToProductDetails}
        disabled={disabled}
        style={styles.meta}>
        <Text
          variant={'labelLarge'}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={styles.name}>
          {product?.item_details?.descriptor?.name}
        </Text>
        <Text
          variant={'labelSmall'}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={styles.provider}>
          {product?.item_details?.descriptor?.short_desc}
        </Text>
        <View style={styles.footerContainer}>
          <View style={styles.priceText}>
            {Number(product?.item_details?.price?.maximum_value) !==
            Number(product?.item_details?.price?.value) ? (
              <Text variant={'labelSmall'} style={styles.amountStrike}>
                {currency}
                {formatNumber(
                  Number(product?.item_details?.price?.maximum_value),
                )}
              </Text>
            ) : (
              <View style={styles.amountStrikeEmpty} />
            )}
            <Text variant={'labelLarge'} style={styles.amount}>
              {currency}
              {formatNumber(product?.item_details?.price?.value)}
            </Text>
          </View>
          {cartItemDetails?.productQuantity > 0 ? (
            <View
              style={[
                styles.quantityView,
                disabled ? styles.disabledButton : {},
              ]}>
              <TouchableOpacity
                disabled={disabled}
                onPress={removeQuantityClick}
                style={styles.iconButton}>
                <Icon name={'minus'} color={theme.colors.primary} size={20} />
              </TouchableOpacity>
              <View style={styles.quantityContainer}>
                {productLoading ? (
                  <ActivityIndicator size={14} color={theme.colors.primary} />
                ) : (
                  <Text variant={'bodyLarge'} style={styles.quantity}>
                    {formatNumber(cartItemDetails?.productQuantity)}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                disabled={disabled}
                onPress={incrementProductQuantity}
                style={styles.iconButton}>
                <Icon name={'plus'} color={theme.colors.primary} size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              disabled={disabled}
              style={[
                styles.quantityView,
                disabled ? styles.disabledButton : {},
              ]}
              onPress={addToCart}>
              <Text
                variant={'bodyLarge'}
                style={[styles.quantity, disabled ? styles.disabledText : {}]}>
                {t('Cart.FBProduct.Add')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {addedToWishlist ? (
        <TouchableOpacity
          style={styles.wishlist}
          onPress={deleteItemFromWishlist}>
          <Wishlist
            name="cards-heart"
            size={20}
            color={theme.colors.error600}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.wishlist} onPress={addItemToWishlist}>
          <Wishlist
            name="cards-heart-outline"
            size={20}
            color={theme.colors.error600}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 15,
    },
    meta: {
      flex: 1,
      marginTop: 12,
    },
    gridImage: {
      width: '100%',
      height: 173,
      borderRadius: 15,
    },
    wishlist: {
      position: 'absolute',
      top: 4,
      left: 4,
      height: 28,
      width: 28,
      borderRadius: 28,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      color: colors.neutral400,
    },
    provider: {
      color: colors.neutral300,
      marginTop: 4,
    },
    amount: {
      color: colors.neutral400,
    },
    amountStrike: {
      color: colors.neutral200,
      textDecorationLine: 'line-through',
    },
    amountStrikeEmpty: {
      height: 18,
    },
    vegNonVegContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      width: '100%',
      paddingTop: 12,
      paddingRight: 12,
    },
    footerContainer: {
      flexDirection: 'row',
    },
    priceText: {
      flex: 1,
    },
    quantityView: {
      height: 28,
      width: 72,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: colors.primary,
      alignSelf: 'flex-end',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    disabledButton: {
      borderColor: colors.neutral200,
    },
    iconButton: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledText: {
      color: colors.neutral200,
    },
    quantity: {
      color: colors.primary,
    },
  });

export default GridProductUI;
