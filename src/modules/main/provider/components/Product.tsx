import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import React from 'react';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';

interface Product {
  isGrid: boolean;
  product: any;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const Product: React.FC<Product> = ({isGrid, product}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  if (isGrid) {
    return (
      <View style={styles.container}>
        <FastImage
          style={styles.gridImage}
          source={
            product?.item_details?.descriptor?.symbol
              ? {uri: product?.item_details?.descriptor?.symbol}
              : NoImageAvailable
          }
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text variant={'bodyMedium'} numberOfLines={2}>
          {product?.item_details?.descriptor?.name}
        </Text>
        <Text variant={'labelSmall'} numberOfLines={2}>
          {product?.provider_details?.descriptor?.name}
        </Text>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View>
            <Text variant={'labelMedium'} style={styles.amount}>
              {CURRENCY_SYMBOLS[product?.item_details?.price?.currency]}{' '}
              {product?.item_details?.price?.value}
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.horizontalRow}>
          <FastImage
            style={styles.horizontalImage}
            source={
              product?.item_details?.descriptor?.symbol
                ? {uri: product?.item_details?.descriptor?.symbol}
                : NoImageAvailable
            }
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={styles.metaContainer}>
            <Text variant={'bodyMedium'} numberOfLines={2}>
              {product?.item_details?.descriptor?.name}
            </Text>
            <Text variant={'labelSmall'} numberOfLines={2}>
              {product?.provider_details?.descriptor?.name}
            </Text>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View>
                <Text variant={'labelMedium'} style={styles.amount}>
                  {CURRENCY_SYMBOLS[product?.item_details?.price?.currency]}{' '}
                  {product?.item_details?.price?.value}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      flex: 1,
      marginBottom: 20,
    },
    gridImage: {
      width: '100%',
      height: 180,
      backgroundColor: '#ECECEC',
      borderRadius: 12,
      marginBottom: 10,
    },
    horizontalImage: {
      width: 173,
      height: 180,
      backgroundColor: '#ECECEC',
      borderRadius: 12,
      marginRight: 10,
    },
    divider: {
      marginVertical: 12,
      width: '100%',
      height: 1,
      backgroundColor: '#EDEDED',
    },
    amount: {
      fontWeight: '700',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    horizontalRow: {
      flexDirection: 'row',
    },
    metaContainer: {
      flex: 1,
    },
  });

export default Product;
