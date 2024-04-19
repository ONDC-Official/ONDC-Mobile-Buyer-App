import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CURRENCY_SYMBOLS, FB_DOMAIN} from '../../../../utils/constants';
import {useAppTheme} from '../../../../utils/theme';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';

interface Product {
  product: any;
  search?: boolean;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const Product: React.FC<Product> = ({product, search = false}) => {
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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={navigateToProductDetails}>
      <FastImage
        style={styles.gridImage}
        source={
          product?.item_details?.descriptor?.symbol
            ? {uri: product?.item_details?.descriptor?.symbol}
            : NoImageAvailable
        }
        resizeMode={FastImage.resizeMode.contain}
      />
      {isFBDomain && (
        <View style={styles.vegNonVegContainer}>
          <VegNonVegTag tags={product.item_details.tags} />
        </View>
      )}
      <Text
        variant={'labelMedium'}
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
        {product?.provider_details?.descriptor?.name}
      </Text>
      <View style={styles.row}>
        <Text variant={'bodyLarge'} style={styles.amount}>
          {CURRENCY_SYMBOLS[product?.item_details?.price?.currency]}
          {product?.item_details?.price?.value}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      flex: 1,
      marginBottom: 20,
    },
    gridImage: {
      width: '100%',
      height: 180,
      borderRadius: 12,
      marginBottom: 12,
    },
    name: {
      color: colors.neutral400,
      marginBottom: 8,
    },
    provider: {
      color: colors.neutral300,
      marginBottom: 8,
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
