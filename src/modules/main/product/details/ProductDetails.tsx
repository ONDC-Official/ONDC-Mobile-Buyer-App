import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {Button, List, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';

import {API_BASE_URL, ITEM_DETAILS} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import ProductSkeleton from './components/ProductSkeleton';
import ProductImages from './components/ProductImages';
import {
  FASHION_DOMAIN,
  FB_DOMAIN,
  GROCERY_DOMAIN,
} from '../../../../utils/constants';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import VariationsRenderer from '../../../../components/products/VariationsRenderer';
import FBProductCustomization from '../../provider/components/FBProductCustomization';

interface ProductDetails {
  route: any;
  navigation: any;
}

const CancelToken = axios.CancelToken;

const ProductDetails: React.FC<ProductDetails> = ({
  navigation,
  route: {params},
}) => {
  const source = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [product, setProduct] = useState<any>(null);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const [itemOutOfStock, setItemOutOfStock] = useState<boolean>(false);
  const [addToCartLoading, setAddToCartLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(true);

  const [variationState, setVariationState] = useState<any[]>([]);
  const [customizationState, setCustomizationState] = useState<any>({});
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const handleAccordionPress = () => setExpanded(!expanded);

  const getProductDetails = async () => {
    try {
      setApiRequested(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ITEM_DETAILS}?id=${params.productId}`,
        source.current.token,
      );
      navigation.setOptions({
        headerTitle: data?.item_details?.descriptor?.name,
      });
      setProduct(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  const addToCart = (navigate: boolean) => {};

  const renderItemDetails = () => {
    let returnWindowValue: string = '0';
    if (product.item_details?.['@ondc/org/return_window']) {
      // Create a duration object from the ISO 8601 string
      const duration = moment.duration(
        product.item_details?.['@ondc/org/return_window'],
      );

      // Get the number of hours from the duration object
      returnWindowValue = duration.humanize();
    }

    const data: any = {
      'Available on COD':
        product.item_details?.['@ondc/org/available_on_cod']?.toString() ===
        'true'
          ? 'Yes'
          : 'No',
      Cancellable:
        product.item_details?.['@ondc/org/cancellable']?.toString() === 'true'
          ? 'Yes'
          : 'No',
      'Return window value': returnWindowValue,
      Returnable:
        product.item_details?.['@ondc/org/returnable']?.toString() === 'true'
          ? 'Yes'
          : 'No',
      'Customer care':
        product.item_details?.['@ondc/org/contact_details_consumer_care'],
      'Manufacturer name':
        product.item_details?.['@ondc/org/statutory_reqs_packaged_commodities']
          ?.manufacturer_or_packer_name,
      'Manufacturer address':
        product.item_details?.['@ondc/org/statutory_reqs_packaged_commodities']
          ?.manufacturer_or_packer_address,
    };

    return Object.keys(data).map(key => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        return (
          <View style={styles.aboutRow}>
            <Text variant="bodyLarge" style={styles.aboutTitle}>
              {key}
            </Text>
            <View style={styles.aboutSeparator} />
            <Text variant="bodyMedium" style={styles.aboutDetails}>
              {value}
            </Text>
          </View>
        );
      }
      return null; // Return null for fields with null or undefined values
    });
  };

  useEffect(() => {
    getProductDetails().then(() => {});

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, []);

  if (apiRequested) {
    return <ProductSkeleton />;
  }
  return (
    <ScrollView style={styles.container}>
      <ProductImages
        images={[product?.item_details?.descriptor?.symbol].concat(
          product?.item_details?.descriptor?.images,
        )}
      />
      <View style={styles.details}>
        {product?.context?.domain === FB_DOMAIN ||
        product?.context?.domain === GROCERY_DOMAIN ? (
          <View style={styles.stockRow}>
            <VegNonVegTag tags={product?.item_details?.tags} showLabel />
          </View>
        ) : parseInt(product?.item_details?.quantity?.available?.count) >= 1 ? (
          <View style={styles.stockRow}>
            <Icon name={'check'} color={'#419E6A'} />
            <Text variant={'bodyMedium'} style={styles.inStockLabel}>
              In stock
            </Text>
          </View>
        ) : (
          <View style={styles.stockRow}>
            <Icon name={'close'} color={'#D83232'} />
            <Text variant={'bodyMedium'} style={styles.outOfStockLabel}>
              Out of stock
            </Text>
          </View>
        )}
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
        {product?.context?.domain === FB_DOMAIN && (
          <>
            <View style={styles.divider} />
            <FBProductCustomization
              product={product}
              customizationState={customizationState}
              setCustomizationState={setCustomizationState}
              isEditFlow={false}
              setItemOutOfStock={setItemOutOfStock}
            />
          </>
        )}
        <View style={styles.buttonContainer}>
          <Button
            mode={'outlined'}
            style={styles.button}
            onPress={() => addToCart(false)}
            disabled={
              !(
                Number(product?.item_details?.quantity?.available?.count) >= 1
              ) ||
              itemOutOfStock ||
              addToCartLoading
            }>
            {addToCartLoading ? (
              <ActivityIndicator size={'small'} color={theme.colors.primary} />
            ) : (
              'Add to cart'
            )}
          </Button>
          <View style={styles.buttonSeparator} />
          <Button
            mode="contained"
            style={styles.button}
            disabled={
              !(
                Number(product?.item_details?.quantity?.available?.count) >= 1
              ) || itemOutOfStock
            }
            onPress={() => addToCart(true)}>
            Order now
          </Button>
        </View>
        <View style={styles.aboutContainer}>
          <List.Accordion
            expanded={expanded}
            onPress={handleAccordionPress}
            title={
              <Text variant={'titleSmall'} style={styles.about}>
                About
              </Text>
            }>
            {Object.keys(product?.attributes).map(key => (
              <View style={styles.aboutRow}>
                <Text variant="bodyLarge" style={styles.aboutTitle}>
                  {key}
                </Text>
                <View style={styles.aboutSeparator} />
                <Text variant="bodyMedium" style={styles.aboutDetails}>
                  {product?.attributes[key]}
                </Text>
              </View>
            ))}
            {renderItemDetails()}
          </List.Accordion>
        </View>
      </View>
    </ScrollView>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    stockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    inStockLabel: {
      color: '#419E6A',
      marginLeft: 6,
    },
    outOfStockLabel: {
      color: '#D83232',
      marginLeft: 6,
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
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      flex: 1,
      borderRadius: 8,
      borderColor: colors.primary,
    },
    buttonSeparator: {
      width: 15,
    },
    about: {
      color: '#222',
    },
    aboutContainer: {
      marginTop: 40,
    },
    aboutRow: {
      flexDirection: 'row',
      marginBottom: 30,
    },
    aboutTitle: {
      width: 130,
      color: '#787A80',
      textTransform: 'capitalize',
    },
    aboutSeparator: {
      width: 28,
    },
    aboutDetails: {
      flex: 1,
      color: '#1D1D1D',
    },
  });

export default ProductDetails;
