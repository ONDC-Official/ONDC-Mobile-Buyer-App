import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button, IconButton, Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';
import {getCustomizations, showToastWithGravity} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, ITEM_DETAILS} from '../../../../utils/apiActions';
import FBProductCustomization from './FBProductCustomization';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import useCartItems from '../../../../hooks/useCartItems';
import userUpdateCartItem from '../../../../hooks/userUpdateCartItem';
import {areCustomisationsSame} from '../../product/details/ProductDetails';

interface FBProduct {
  product: any;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const screenHeight: number = Dimensions.get('screen').height;

const CancelToken = axios.CancelToken;
const FBProduct: React.FC<FBProduct> = ({product}) => {
  const source = useRef<any>(null);
  const theme = useTheme();
  const {uid} = useSelector(({authReducer}) => authReducer);
  const customizationSheet = useRef<any>(null);
  const productSource = useRef<any>(null);
  const styles = makeStyles(theme.colors);
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const [itemOutOfStock, setItemOutOfStock] = useState<boolean>(false);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [customizationState, setCustomizationState] = useState<any>({});
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [itemQty, setItemQty] = useState<number>(1);
  const [customizationPrices, setCustomizationPrices] = useState<number>(0);
  const {getCartItems} = useCartItems();
  const {updateCartItem} = userUpdateCartItem();

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

  const addDetailsToCart = async () => {
    setProductLoading(true);
    try {
      const url = `${API_BASE_URL}/clientApis/v2/cart/${uid}`;

      let customisations = await getCustomizations(
        productDetails,
        customizationState,
      );

      const subtotal =
        productDetails?.item_details?.price?.value + customizationPrices;

      const payload: any = {
        id: productDetails.id,
        local_id: productDetails.local_id,
        bpp_id: productDetails.bpp_details.bpp_id,
        bpp_uri: productDetails.context.bpp_uri,
        domain: productDetails.context.domain,
        tags: productDetails.item_details.tags,
        customisationState: customizationState,
        quantity: {
          count: itemQty,
        },
        provider: {
          id: productDetails.bpp_details.bpp_id,
          locations: productDetails.locations,
          ...productDetails.provider_details,
        },
        product: {
          id: productDetails.id,
          subtotal,
          ...productDetails.item_details,
        },
        customisations,
        hasCustomisations: true,
      };

      console.log(JSON.stringify(payload, undefined, 4));
      const cartItems = await getCartItems();

      let items: any[] = [];
      items = cartItems.filter((ci: any) => ci.item.id === payload.id);

      if (items.length > 0 && customisations && customisations.length > 0) {
        items = cartItems.filter((ci: any) => {
          return ci.item.customisations.length === customisations.length;
        });
      }

      if (items.length === 0) {
        source.current = CancelToken.source();
        await postDataWithAuth(url, payload, source.current.token);
        setCustomizationState({});
        setProductLoading(false);
        showToastWithGravity('Item added to cart successfully.');
        hideCustomization();
      } else {
        const currentCount = Number(items[0].item.quantity.count);
        const maxCount = Number(items[0].item.product.quantity.maximum.count);

        if (currentCount < maxCount) {
          if (!customisations) {
            await updateCartItem(cartItems, true, items[0]._id);
            showToastWithGravity('Item quantity updated in your cart.');
            setCustomizationState({});
            setProductLoading(false);
            hideCustomization();
          } else {
            const currentIds = customisations.map(item => item.id);
            let matchingCustomisation = null;

            for (let i = 0; i < items.length; i++) {
              let existingIds = items[i].item.customisations.map(
                item => item.id,
              );
              const areSame = areCustomisationsSame(existingIds, currentIds);
              if (areSame) {
                matchingCustomisation = items[i];
              }
            }

            if (matchingCustomisation) {
              await updateCartItem(cartItems, true, matchingCustomisation._id);
              showToastWithGravity('Item quantity updated in your cart');
              setCustomizationState({});
              setProductLoading(false);
              hideCustomization();
            } else {
              await postDataWithAuth(url, payload, source.current.token);
              setCustomizationState({});
              setProductLoading(false);
              showToastWithGravity('Item added to cart successfully.');
              hideCustomization();
            }
          }
        } else {
          showToastWithGravity(
            'The maximum available quantity for item is already in your cart.',
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProductLoading(false);
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

  const calculateSubtotal = (groupId: any, state: any) => {
    let group = state[groupId];
    if (!group) {
      return;
    }

    let prices = group.selected.map(
      (selectedGroup: any) => selectedGroup.price,
    );
    setCustomizationPrices(prevState => {
      return prevState + prices.reduce((a, b) => a + b, 0);
    });

    group?.childs?.map((child: any) => {
      calculateSubtotal(child, state);
    });
  };

  useEffect(() => {
    if (customizationState && customizationState.firstGroup) {
      setCustomizationPrices(0);
      calculateSubtotal(customizationState.firstGroup?.id, customizationState);
    }
  }, [customizationState]);

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

        <View style={styles.customizationButtons}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.incrementButton}
              onPress={() => {
                if (itemQty > 1) {
                  setItemQty(itemQty - 1);
                }
              }}>
              <Icon name={'minus'} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text variant={'bodyMedium'} style={styles.quantity}>
              {itemQty}
            </Text>
            <TouchableOpacity
              disabled={itemOutOfStock}
              style={styles.incrementButton}
              onPress={() => setItemQty(itemQty + 1)}>
              <Icon name={'plus'} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <Button
            disabled={itemOutOfStock}
            mode="contained"
            style={styles.addToCardButton}
            onPress={addDetailsToCart}>
            Add Item Total - ₹
            {(product?.item_details?.price.value + customizationPrices) *
              itemQty}
          </Button>
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
      borderBottomWidth: 1,
    },
    title: {
      color: '#1A1A1A',
    },
    customizationContainer: {
      padding: 16,
    },
    customizationButtons: {
      marginTop: 28,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    quantityContainer: {
      borderRadius: 6,
      borderColor: '#E8E8E8',
      borderWidth: 1,
      backgroundColor: '#FFF',
      flexDirection: 'row',
      height: 40,
      flex: 1,
      alignItems: 'center',
      marginRight: 18,
    },
    quantity: {
      flex: 1,
      alignItems: 'center',
      textAlign: 'center',
    },
    incrementButton: {
      paddingHorizontal: 10,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    productTag: {
      marginTop: -118,
      marginLeft: 98,
    },
    addToCardButton: {
      flex: 1,
      borderRadius: 8,
    },
  });

export default FBProduct;
