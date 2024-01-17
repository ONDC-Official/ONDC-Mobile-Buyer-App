import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import ProductImages from './components/ProductImages';
import {FASHION_DOMAIN} from '../../../../utils/constants';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import VariationsRenderer from '../../../../components/products/VariationsRenderer';
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
      <View style={styles.imagesContainer}>
        <ProductImages
          roundedCorner={true}
          images={[product?.item_details?.descriptor?.symbol].concat(
            product?.item_details?.descriptor?.images,
          )}
        />
      </View>
      <View style={styles.tagContainer}>
        <VegNonVegTag tags={product?.item_details?.tags} />
      </View>
      <View style={styles.details}>
        <Text variant="titleSmall" style={styles.title}>
          {product?.item_details?.descriptor?.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text variant="labelMedium" style={styles.price}>
            ₹{product?.item_details?.price?.value}
          </Text>
          <Text
            variant="labelMedium"
            style={[styles.price, styles.maximumAmount]}>
            ₹{Number(product?.item_details?.price?.maximum_value).toFixed(0)}
          </Text>
        </View>
        <Text variant={'labelMedium'} style={styles.description}>
          {product?.item_details?.descriptor?.short_desc}
        </Text>
      </View>
      <View>
        <VariationsRenderer
          product={product}
          variationState={variationState}
          setVariationState={setVariationState}
          chartImage={product?.attributes?.size_chart || ''}
          isFashion={product?.context?.domain === FASHION_DOMAIN}
        />
        <View style={styles.customizationContainer}>{children}</View>
        <View style={styles.aboutContainer}>
          <AboutProduct product={product} />
        </View>
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
      marginBottom: 4,
      fontWeight: '600',
    },
    price: {
      color: colors.primary,
      fontWeight: '600',
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
    tagContainer: {
      marginLeft: 16,
    },
    imagesContainer: {
      borderRadius: 8,
      paddingHorizontal: 16,
    },
    description: {
      color: '#1A1A1A',
      fontWeight: '400',
      marginTop: 4,
      marginBottom: 8,
    },
    customizationContainer: {
      padding: 16,
      backgroundColor: '#FAFAFA',
    },
    aboutContainer: {
      paddingHorizontal: 16,
    },
  });

export default ProductDetails;
