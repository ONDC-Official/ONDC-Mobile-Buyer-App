import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button, IconButton, Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';
import {
  getCustomizations,
  getPriceWithCustomisations,
  showToastWithGravity,
} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, CART, ITEM_DETAILS} from '../../../../utils/apiActions';
import FBProductCustomization from './FBProductCustomization';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import useCartItems from '../../../../hooks/useCartItems';
import userUpdateCartItem from '../../../../hooks/userUpdateCartItem';
import {areCustomisationsSame} from '../../product/details/ProductDetails';
import {makeGlobalStyles} from '../../../../styles/styles';
import Customizations from '../../../../components/customization/Customizations';
import ManageQuantity from '../../../../components/customization/ManageQuantity';
import useUpdateSpecificItemCount from '../../../../hooks/useUpdateSpecificItemCount';
import {updateCartItems} from '../../../../redux/cart/actions';
import StockAvailability from '../../../../components/products/StockAvailability';

interface FBProduct {
  product: any;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const screenHeight: number = Dimensions.get('screen').height;

const CancelToken = axios.CancelToken;
const FBProduct: React.FC<FBProduct> = ({product}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const globalStyles = makeGlobalStyles(theme.colors);
  const source = useRef<any>(null);
  const {uid} = useSelector(({authReducer}) => authReducer);
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const customizationSheet = useRef<any>(null);
  const quantitySheet = useRef<any>(null);
  const productSource = useRef<any>(null);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const [itemOutOfStock, setItemOutOfStock] = useState<boolean>(false);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [cartItemDetails, setCartItemDetails] = useState<any>({
    items: [],
    productQuantity: 0,
  });
  const [productDetails, setProductDetails] = useState<any>(null);
  const [customizationState, setCustomizationState] = useState<any>({});
  const {deleteDataWithAuth, getDataWithAuth, postDataWithAuth} =
    useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [itemQty, setItemQty] = useState<number>(1);
  const [customizationPrices, setCustomizationPrices] = useState<number>(0);
  const {getCartItems} = useCartItems();
  const {updateCartItem} = userUpdateCartItem();
  const {updatingCartItem, updateSpecificCartItem} =
    useUpdateSpecificItemCount();
  const dispatch = useDispatch();

  const customizable =
    product?.item_details?.tags.findIndex(
      (item: any) => item.code === 'custom_group',
    ) > -1;

  const showCustomization = () => customizationSheet.current.open();

  const hideCustomization = () => customizationSheet.current.close();

  const showQuantitySheet = () => quantitySheet.current.open();

  const hideQuantitySheet = () => quantitySheet.current.close();

  const addNewCustomization = () => {
    setItemQty(1);
    hideQuantitySheet();
    addToCart().then(() => {});
  };

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
      const url = `${API_BASE_URL}${CART}/${uid}`;

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

      let items: any[] = [];
      items = cartItems.filter((ci: any) => ci.item.id === payload.id);

      if (items.length > 0 && customisations && customisations.length > 0) {
        items = cartItems.filter((ci: any) => {
          return ci.item.customisations.length === customisations.length;
        });
      }

      source.current = CancelToken.source();
      if (items.length === 0) {
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
                (item: any) => item.id,
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
      await getCartItems();
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

  const setCartItems = (items: any[]) => {
    dispatch(updateCartItems(items));
  };

  const updateSpecificItem = async (
    itemId: any,
    increment: boolean,
    uniqueId: any,
  ) => {
    await updateSpecificCartItem(
      itemId,
      increment,
      uniqueId,
      cartItems,
      setCartItems,
    );
  };

  const deleteCartItem = async (itemId: any) => {
    try {
      setItemToDelete(itemId);
      source.current = CancelToken.source();
      await deleteDataWithAuth(
        `${API_BASE_URL}${CART}/${uid}/${itemId}`,
        source.current.token,
      );
      const list = cartItems.filter((item: any) => item._id !== itemId);
      dispatch(updateCartItems(list));
    } catch (error) {
    } finally {
      setItemToDelete(null);
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

  useEffect(() => {
    if (product && cartItems.length > 0) {
      let items: any[] = cartItems.filter(
        (ci: any) => ci.item.id === product.id,
      );
      let quantity = 0;
      const productQuantity = items.reduce(
        (accumulator, item) => accumulator + item.item.quantity.count,
        quantity,
      );
      setCartItemDetails({items, productQuantity});
    }
  }, [product, cartItems]);

  const disabled =
    apiInProgress ||
    !(Number(product?.item_details?.quantity?.available?.count) >= 1);

  return (
    <>
      <View key={product?.item_details?.id}>
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
            {cartItemDetails?.productQuantity > 0 ? (
              <TouchableOpacity
                style={[
                  disabled
                    ? globalStyles.disabledOutlineButton
                    : globalStyles.outlineButton,
                  styles.addButton,
                ]}
                onPress={showQuantitySheet}
                disabled={disabled}>
                <Icon name={'minus'} color={theme.colors.primary} size={14} />
                <Text
                  variant={'titleSmall'}
                  style={[
                    disabled
                      ? globalStyles.disabledOutlineButtonText
                      : globalStyles.outlineButtonText,
                  ]}>
                  {cartItemDetails?.productQuantity}
                </Text>
                <Icon name={'plus'} color={theme.colors.primary} size={14} />
              </TouchableOpacity>
            ) : Number(product?.item_details?.quantity?.available?.count) >=
              1 ? (
              <View>
                <TouchableOpacity
                  style={[
                    disabled
                      ? globalStyles.disabledOutlineButton
                      : globalStyles.outlineButton,
                    styles.addButton,
                  ]}
                  onPress={addToCart}
                  disabled={disabled}>
                  <Text
                    variant={'titleSmall'}
                    style={[
                      disabled
                        ? globalStyles.disabledOutlineButtonText
                        : globalStyles.outlineButtonText,
                    ]}>
                    Add
                  </Text>
                  {apiInProgress ? (
                    <ActivityIndicator size={16} />
                  ) : (
                    <Icon
                      name={'plus'}
                      color={
                        disabled ? theme.colors.disabled : theme.colors.primary
                      }
                      size={16}
                    />
                  )}
                </TouchableOpacity>
                {customizable && (
                  <Text variant={'labelSmall'} style={styles.customise}>
                    Customizable
                  </Text>
                )}
              </View>
            ) : (
              <StockAvailability available={false} />
            )}
          </View>
        </View>
      </View>
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
        <ScrollView style={styles.customizationContainer}>
          <FBProductCustomization
            product={productDetails}
            customizationState={customizationState}
            setCustomizationState={setCustomizationState}
            setItemOutOfStock={setItemOutOfStock}
          />
        </ScrollView>

        <View style={styles.customizationButtons}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              disabled={productLoading}
              style={styles.incrementButton}
              onPress={() => {
                if (itemQty > 1) {
                  setItemQty(itemQty - 1);
                }
              }}>
              <Icon
                name={'minus'}
                color={
                  productLoading ? theme.colors.border : theme.colors.primary
                }
              />
            </TouchableOpacity>
            <Text variant={'bodyMedium'} style={styles.quantity}>
              {itemQty}
            </Text>
            <TouchableOpacity
              disabled={productLoading || itemOutOfStock}
              style={styles.incrementButton}
              onPress={() => setItemQty(itemQty + 1)}>
              <Icon
                name={'plus'}
                color={
                  productLoading ? theme.colors.border : theme.colors.primary
                }
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            disabled={itemOutOfStock || productLoading}
            style={[
              styles.addToCardButton,
              itemOutOfStock || productLoading
                ? globalStyles.disabledContainedButton
                : globalStyles.containedButton,
            ]}
            onPress={addDetailsToCart}>
            {productLoading ? (
              <ActivityIndicator size={14} color={theme.colors.primary} />
            ) : (
              <Text
                variant={'bodyMedium'}
                style={
                  itemOutOfStock || productLoading
                    ? globalStyles.disabledContainedButtonText
                    : globalStyles.containedButtonText
                }>
                Add Item Total - ₹
                {(product?.item_details?.price.value + customizationPrices) *
                  itemQty}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </RBSheet>
      <RBSheet
        ref={quantitySheet}
        height={screenHeight - 150}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <View style={styles.header}>
          <Text
            variant={'titleSmall'}
            style={styles.title}
            ellipsizeMode={'tail'}>
            Customizations for $
            {cartItemDetails?.items[0]?.item?.product?.descriptor?.name}
          </Text>
          <IconButton icon={'close'} onPress={hideQuantitySheet} />
        </View>
        <ScrollView style={styles.customizationContainer}>
          {cartItemDetails?.items?.map((item: any) => (
            <View key={item?._id} style={styles.cartItem}>
              <View style={styles.productMeta}>
                <Text variant={'bodyMedium'}>
                  {item?.item?.product?.descriptor?.name}
                </Text>
                <Customizations cartItem={item} />
                <Text variant="titleSmall" style={styles.cartQuantity}>
                  ₹{' '}
                  {item.item.hasCustomisations
                    ? Number(getPriceWithCustomisations(item)) *
                      Number(item?.item?.quantity?.count)
                    : Number(item?.item?.product?.subtotal)}
                </Text>
              </View>
              <ManageQuantity
                allowDelete
                cartItem={item}
                updatingCartItem={updatingCartItem ?? itemToDelete}
                deleteCartItem={deleteCartItem}
                updateCartItem={updateSpecificItem}
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.addNewCustomizationButton}>
          <Button onPress={addNewCustomization}>Add new customization</Button>
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
    addButton: {
      width: 90,
      borderRadius: 8,
      borderWidth: 1,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    customise: {
      textAlign: 'center',
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
      marginBottom: 20,
    },
    quantityContainer: {
      borderRadius: 6,
      borderColor: '#E8E8E8',
      borderWidth: 1,
      backgroundColor: '#FFF',
      flexDirection: 'row',
      height: 40,
      alignItems: 'center',
      marginRight: 18,
    },
    quantity: {
      alignItems: 'center',
      textAlign: 'center',
      minWidth: 50,
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
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    cartItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    productMeta: {
      flex: 1,
    },
    addNewCustomizationButton: {
      marginVertical: 16,
    },
    cartQuantity: {
      marginTop: 4,
    },
  });

export default FBProduct;
