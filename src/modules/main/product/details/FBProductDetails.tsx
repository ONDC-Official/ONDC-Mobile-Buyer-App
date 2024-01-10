import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import ProductImages from './components/ProductImages';
import {FASHION_DOMAIN} from '../../../../utils/constants';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import VariationsRenderer from '../../../../components/products/VariationsRenderer';
import StockAvailability from '../../../../components/products/StockAvailability';
import AboutProduct from './components/AboutProduct';

interface ProductDetails {
  product: any;
  children: any;
}

const ProductDetails: React.FC<ProductDetails> = ({product, children}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const [variationState, setVariationState] = useState<any[]>([]);

  return (
    <>
      <ProductImages
        images={[product?.item_details?.descriptor?.symbol].concat(
          product?.item_details?.descriptor?.images,
        )}
      />
      <View style={styles.details}>
        <View style={styles.stockRow}>
          <VegNonVegTag tags={product?.item_details?.tags} showLabel />
        </View>
        <StockAvailability
          available={
            Number(product?.item_details?.quantity?.available?.count) >= 1
          }
        />
        <Text variant="titleMedium" style={styles.title}>
          {product?.item_details?.descriptor?.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text variant="titleMedium" style={styles.price}>
            ₹{product?.item_details?.price?.value}
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.price, styles.maximumAmount]}>
            ₹{Number(product?.item_details?.price?.maximum_value).toFixed(0)}
          </Text>
        </View>
        <View style={styles.divider} />
        <VariationsRenderer
          product={product}
          variationState={variationState}
          setVariationState={setVariationState}
          chartImage={product?.attributes?.size_chart || ''}
          isFashion={product?.context?.domain === FASHION_DOMAIN}
        />
        {children}
        <AboutProduct product={product} />
      </View>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    stockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    details: {
      padding: 16,
    },
    title: {
      color: '#222',
      marginBottom: 10,
    },
    price: {
      color: '#222',
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    maximumAmount: {
      marginLeft: 12,
      textDecorationLine: 'line-through',
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: '#E0E0E0',
      marginVertical: 20,
    },
  });

export default ProductDetails;
