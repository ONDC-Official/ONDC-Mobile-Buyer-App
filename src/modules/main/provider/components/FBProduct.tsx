import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import {IconButton, Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';
import {showToastWithGravity} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, ITEM_DETAILS} from '../../../../utils/apiActions';
import FBProductCustomization from './FBProductCustomization';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';

interface FBProduct {
  product: any;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const screenHeight: number = Dimensions.get('screen').height;

const CancelToken = axios.CancelToken;
const FBProduct: React.FC<FBProduct> = ({product}) => {
  const theme = useTheme();
  const customizationSheet = useRef<any>(null);
  const productSource = useRef<any>(null);
  const styles = makeStyles(theme.colors);
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const [itemOutOfStock, setItemOutOfStock] = useState<boolean>(false);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [customizationState, setCustomizationState] = useState<any>({});
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToProductDetails = () =>
    navigation.navigate('ProductDetails', {productId: product.id});

  const customizable =
    product?.item_details?.tags.findIndex(
      (item: any) => item.code === 'custom_group',
    ) > -1;

  const showCustomization = () => customizationSheet.current.open();

  const hideCustomization = () => customizationSheet.current.close();

  const addToCart = async () => {
    if (customizable) {
      if (productDetails) {
        showCustomization();
      } else {
        await getProductDetails();
      }
    } else {
      showToastWithGravity('Product added to cart');
    }
  };

  const getProductDetails = async () => {
    try {
      setApiInProgress(true);
      productSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ITEM_DETAILS}?id=${product.id}`,
        productSource.current.token,
      );
      setProductDetails(data);
      showCustomization();
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiInProgress(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={navigateToProductDetails}
        key={product?.item_details?.id}
        disabled={apiInProgress}>
        <View style={styles.product}>
          <View style={styles.meta}>
            <Text variant={'titleSmall'} style={styles.field}>
              {product?.item_details?.descriptor?.name}
            </Text>
            <Text variant={'titleMedium'} style={styles.field}>
              {CURRENCY_SYMBOLS[product?.item_details?.price?.currency]}{' '}
              {product?.item_details?.price?.value}
            </Text>
            <Text variant={'bodyMedium'} style={styles.field}>
              {product?.item_details?.descriptor?.short_desc}
            </Text>
          </View>
          <View style={styles.actionContainer}>
            <View style={styles.imageContainer}>
              <FastImage
                style={styles.image}
                source={
                  product?.item_details?.descriptor.symbol
                    ? {uri: product?.item_details?.descriptor.symbol}
                    : NoImageAvailable
                }
              />
              <View style={styles.productTag}>
                <VegNonVegTag tags={product?.item_details?.tags} />
              </View>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={addToCart}
              disabled={apiInProgress}>
              <Text variant={'titleSmall'} style={styles.addText}>
                Add
              </Text>
              {apiInProgress ? (
                <ActivityIndicator size={16} />
              ) : (
                <Icon name={'plus'} color={theme.colors.primary} size={16} />
              )}
            </TouchableOpacity>
            {customizable && (
              <Text variant={'labelSmall'} style={styles.customise}>
                Customizable
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <RBSheet
        ref={customizationSheet}
        height={screenHeight - 150}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <View style={styles.header}>
          <Text variant={'titleSmall'} style={styles.title}>
            Customize
          </Text>
          <IconButton icon={'close'} onPress={hideCustomization} />
        </View>
        <View style={styles.customizationContainer}>
          <FBProductCustomization
            product={productDetails}
            customizationState={customizationState}
            setCustomizationState={setCustomizationState}
            setItemOutOfStock={setItemOutOfStock}
          />
        </View>
      </RBSheet>
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
      borderRadius: 15,
      background: '#F5F5F5',
    },
    field: {
      marginBottom: 12,
    },
    addText: {
      color: colors.primary,
    },
    addButton: {
      width: 90,
      borderRadius: 8,
      borderColor: colors.primary,
      borderWidth: 1,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    customise: {
      color: '#979797',
    },
    rbSheet: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: '#ababab',
      borderWidth: 1,
    },
    title: {
      color: '#1A1A1A',
    },
    customizationContainer: {
      padding: 16,
    },
    productTag: {
      marginTop: -118,
      marginLeft: 98,
    },
  });

export default FBProduct;
