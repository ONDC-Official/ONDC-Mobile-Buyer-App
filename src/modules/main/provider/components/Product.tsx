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
import Wishlist from '../../../../assets/dashboard/Wishlist.svg';

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
        <View style={styles.priceView}>
          <View style={styles.priceText}>
            <Text variant={'labelMedium'} style={styles.amountStrike}>
              {CURRENCY_SYMBOLS[product?.item_details?.price?.currency]}
              {formatNumber(product?.item_details?.price?.value.toFixed(2))}
            </Text>
            <Text variant={'bodyLarge'} style={styles.amount}>
              {CURRENCY_SYMBOLS[product?.item_details?.price?.currency]}
              {formatNumber(product?.item_details?.price?.value.toFixed(2))}
            </Text>
          </View>
          <TouchableOpacity style={styles.quantityView}>
            <Text variant={'bodyLarge'} style={styles.quantityText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.wishlist}>
        <Wishlist width={28} height={28} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 15,
      marginHorizontal: 8,
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
    },
    name: {
      color: colors.neutral400,
      marginBottom: 2,
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
    priceView: {
      flexDirection: 'row',
    },
    priceText:{
      flex:1
    },
    quantityView:{
      height:28,
      width:72,
      borderWidth:1,
      borderRadius:8,
      borderColor:colors.primary,
      alignSelf:'flex-end',
      alignItems:'center',
      justifyContent:'center'
    },
    quantityText:{
      color:colors.primary
    }
  });

export default Product;
