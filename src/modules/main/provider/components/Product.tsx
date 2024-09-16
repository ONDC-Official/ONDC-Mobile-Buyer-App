import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Grayscale} from 'react-native-color-matrix-image-filters';

import {CURRENCY_SYMBOLS, FB_DOMAIN} from '../../../../utils/constants';
import {useAppTheme} from '../../../../utils/theme';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import useFormatNumber from '../../../../hooks/useFormatNumber';

interface Product {
  product: any;
  search?: boolean;
  isOpen: boolean;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const Product: React.FC<Product> = ({product, search = false, isOpen}) => {
  const {formatNumber} = useFormatNumber();
  const isFBDomain = product.context.domain === FB_DOMAIN;
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToProductDetails = () => {
    if (search) {
      const routeParams: any = {
        brandId: product.provider_details.id,
      };

      if (product.location_details) {
        routeParams.outletId = product.location_details.id;
      }
      navigation.navigate('BrandDetails', routeParams);
    } else {
      navigation.navigate('ProductDetails', {productId: product.id});
    }
  };

  const inStock =
    Number(product?.item_details?.quantity?.available?.count) >= 1;
  const disabled = !inStock || !isOpen;

  let imageSource = NoImageAvailable;
  if (product?.item_details?.descriptor?.symbol) {
    imageSource = {
      uri: product?.item_details?.descriptor?.symbol,
    };
  } else if (product?.item_details?.descriptor?.images?.length > 0) {
    imageSource = {
      uri: product?.item_details?.descriptor?.images[0],
    };
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={navigateToProductDetails}
      disabled={disabled}>
      <View style={styles.meta}>
        <Text
          variant={'labelLarge'}
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={styles.name}>
          {product?.item_details?.descriptor?.name}
        </Text>
        <Text
          variant={'labelSmall'}
          numberOfLines={4}
          ellipsizeMode={'tail'}
          style={styles.provider}>
          {search
            ? product?.provider_details?.descriptor?.name
            : product?.item_details?.descriptor?.short_desc}
        </Text>
        <Text variant={'bodyLarge'} style={styles.amount}>
          {CURRENCY_SYMBOLS[product?.item_details?.price?.currency]}
          {formatNumber(product?.item_details?.price?.value.toFixed(2))}
        </Text>
      </View>
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
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    meta: {
      flex: 1,
      paddingRight: 20,
    },
    gridImage: {
      width: 126,
      height: 126,
      borderRadius: 15,
    },
    name: {
      color: colors.neutral400,
      marginBottom: 2,
    },
    provider: {
      color: colors.neutral300,
      marginBottom: 2,
    },
    amount: {
      color: colors.neutral400,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    vegNonVegContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      width: '100%',
      paddingTop: 12,
      paddingRight: 12,
    },
  });

export default Product;
