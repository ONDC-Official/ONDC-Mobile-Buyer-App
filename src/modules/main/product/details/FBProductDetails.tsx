import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import ProductImages from './components/ProductImages';
import {FASHION_DOMAIN} from '../../../../utils/constants';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import VariationsRenderer from '../../../../components/products/VariationsRenderer';
import AboutProduct from './components/AboutProduct';
import {useAppTheme} from '../../../../utils/theme';

interface ProductDetails {
  product: any;
  children: any;
}

const ProductDetails: React.FC<ProductDetails> = ({product, children}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const [variationState, setVariationState] = useState<any[]>([]);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.imagesContainer}>
          <ProductImages
            roundedCorner={true}
            images={[product?.item_details?.descriptor?.symbol].concat(
              product?.item_details?.descriptor?.images,
            )}
          />
        </View>
        <VegNonVegTag tags={product?.item_details?.tags} />
        <Text variant="titleLarge" style={styles.title}>
          {product?.item_details?.descriptor?.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text variant="labelLarge" style={styles.price}>
            ₹{product?.item_details?.price?.value}
          </Text>
        </View>
        <Text variant={'labelSmall'} style={styles.description}>
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
    title: {
      color: colors.neutral400,
      marginTop: 8,
      marginBottom: 4,
    },
    price: {
      color: colors.primary,
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
      backgroundColor: colors.neutral100,
      marginVertical: 20,
    },
    header: {
      paddingTop: 14,
      paddingBottom: 8,
      paddingHorizontal: 16,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      backgroundColor: colors.white,
    },
    imagesContainer: {
      borderRadius: 8,
    },
    description: {
      color: colors.neutral400,
      marginTop: 8,
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
