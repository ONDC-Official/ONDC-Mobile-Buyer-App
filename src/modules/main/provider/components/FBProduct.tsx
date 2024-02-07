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
import {Button, Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
import useCustomizationStateHelper from '../../../../hooks/useCustomizationStateHelper';
import CustomizationFooterButtons from './CustomizationFooterButtons';
import FBProductDetails from '../../product/details/FBProductDetails';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';

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
  const {deleteDataWithAuth, getDataWithAuth, postDataWithAuth} =
    useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const {uid} = useSelector(({authReducer}) => authReducer);
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const {getCartItems} = useCartItems();
  const {updateCartItem} = userUpdateCartItem();
  const {updatingCartItem, updateSpecificCartItem} =
    useUpdateSpecificItemCount();
  const {customizationState, setCustomizationState, customizationPrices} =
    useCustomizationStateHelper();
  const dispatch = useDispatch();
  const source = useRef<any>(null);
  const customizationSheet = useRef<any>(null);
  const quantitySheet = useRef<any>(null);
  const productDetailsSheet = useRef<any>(null);
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
  const [itemQty, setItemQty] = useState<number>(1);
  const [priceRange, setPriceRange] = useState<any>(null);

  const customizable = !!product?.item_details?.tags?.find(
    (item: any) => item.code === 'custom_group',
  );

  const showCustomization = () => customizationSheet.current.open();

  const hideCustomization = () => customizationSheet.current.close();

  const showQuantitySheet = () => quantitySheet.current.open();

  const hideQuantitySheet = () => quantitySheet.current.close();

  const hideProductDetails = () => productDetailsSheet.current.close();

  const removeQuantityClick = () => {
    if (cartItemDetails?.items.length === 1) {
      const cartItem = cartItems[0];
      if (cartItem?.item?.quantity?.count === 1) {
        deleteCartItem(cartItem?._id).then(() => {});
      } else {
        updateSpecificItem(cartItem?.item?.id, false, cartItem?._id).then(
          () => {},
        );
      }
    } else {
      showQuantitySheet();
    }
  };

  const addNewCustomization = () => {
    setItemQty(1);
    hideQuantitySheet();
    addToCart().then(() => {});
  };

  const showProductDetails = async () => {
    setItemQty(1);
    hideQuantitySheet();
    if (!productDetails) {
      await getProductDetails(true);
    }
    productDetailsSheet.current.open();
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
        contextCity: productDetails.context.city,
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
          return ci.item.customisations.length === customisations?.length;
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

  const getProductDetails = async (preventCustomizeOpening = false) => {
    try {
      setApiInProgress(true);
      productSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ITEM_DETAILS}?id=${product.id}`,
        productSource.current.token,
      );
      setProductDetails(data);
      if (!preventCustomizeOpening) {
        showCustomization();
      }
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
    } else {
      setCartItemDetails({items: [], productQuantity: 0});
      quantitySheet.current.close();
    }
  }, [product, cartItems]);

  useEffect(() => {
    let rangePriceTag = null;
    if (product?.item_details?.price?.tags) {
      const findRangePriceTag = product?.item_details?.price?.tags.find(
        (item: any) => item.code === 'range',
      );
      if (findRangePriceTag) {
        const findLowerPriceObj = findRangePriceTag.list.find(
          (item: any) => item.code === 'lower',
        );
        const findUpperPriceObj = findRangePriceTag.list.find(
          (item: any) => item.code === 'upper',
        );
        rangePriceTag = {
          maxPrice: findUpperPriceObj.value,
          minPrice: findLowerPriceObj.value,
        };
      }
    }
    setPriceRange(rangePriceTag);
  }, [product]);

  const inStock =
    Number(product?.item_details?.quantity?.available?.count) >= 1;
  const disabled = apiInProgress || !inStock;

  // @ts-ignore
  return (
    <>
      <View style={styles.product}>
        <TouchableOpacity style={styles.meta} onPress={showProductDetails}>
          <Text variant={'titleSmall'} style={styles.field}>
            {product?.item_details?.descriptor?.name}
          </Text>
          <Text variant={'titleMedium'} style={styles.field}>
            {priceRange
              ? `₹${priceRange?.minPrice} - ₹${priceRange?.maxPrice}`
              : `${CURRENCY_SYMBOLS[product?.item_details?.price?.currency]} ${
                  product?.item_details?.price?.value
                }`}
          </Text>
          <Text variant={'bodyMedium'} style={styles.field}>
            {product?.item_details?.descriptor?.short_desc}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={showProductDetails}>
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
          </TouchableOpacity>
          {cartItemDetails?.productQuantity > 0 ? (
            <View>
              <View
                style={[
                  disabled
                    ? globalStyles.disabledOutlineButton
                    : globalStyles.outlineButton,
                  styles.addButton,
                ]}>
                <TouchableOpacity
                  onPress={removeQuantityClick}
                  disabled={disabled}>
                  <Icon name={'minus'} color={theme.colors.primary} size={14} />
                </TouchableOpacity>
                <Text
                  variant={'titleSmall'}
                  style={[
                    disabled
                      ? globalStyles.disabledOutlineButtonText
                      : globalStyles.outlineButtonText,
                  ]}>
                  {cartItemDetails?.productQuantity}
                </Text>
                <TouchableOpacity
                  disabled={disabled}
                  onPress={showQuantitySheet}>
                  <Icon name={'plus'} color={theme.colors.primary} size={14} />
                </TouchableOpacity>
              </View>
              {customizable && (
                <Text variant={'labelSmall'} style={styles.customise}>
                  Customizable
                </Text>
              )}
            </View>
          ) : inStock ? (
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
            <View>
              <View
                style={[
                  globalStyles.disabledOutlineButton,
                  styles.outOfStockButton,
                ]}>
                <Text
                  variant={'labelSmall'}
                  style={[
                    globalStyles.disabledOutlineButtonText,
                    styles.outOfStock,
                  ]}>
                  Out of stock
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      {/*@ts-ignore*/}
      <RBSheet
        ref={customizationSheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <CloseSheetContainer closeSheet={hideCustomization}>
          <View style={styles.sheetContainer}>
            <View style={styles.header}>
              <FastImage
                source={{uri: product?.item_details?.descriptor?.symbol}}
                style={styles.sheetProductSymbol}
              />
              <View style={styles.titleContainer}>
                <Text variant={'titleSmall'} style={styles.title}>
                  {product?.item_details?.descriptor?.name}
                </Text>
                <Text variant={'labelMedium'} style={styles.prize}>
                  {CURRENCY_SYMBOLS[product?.item_details?.price?.currency]}
                  {product?.item_details?.price?.value}
                </Text>
              </View>
            </View>
            <ScrollView style={styles.customizationContainer}>
              <FBProductCustomization
                product={productDetails}
                customizationState={customizationState}
                setCustomizationState={setCustomizationState}
                setItemOutOfStock={setItemOutOfStock}
              />
            </ScrollView>

            <CustomizationFooterButtons
              productLoading={productLoading}
              itemQty={itemQty}
              setItemQty={setItemQty}
              itemOutOfStock={itemOutOfStock}
              addDetailsToCart={addDetailsToCart}
              product={product}
              customizationPrices={customizationPrices}
            />
          </View>
        </CloseSheetContainer>
      </RBSheet>
      {/*@ts-ignore*/}
      <RBSheet
        ref={quantitySheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <CloseSheetContainer closeSheet={hideQuantitySheet}>
          <View style={styles.sheetContainer}>
            <View style={styles.header}>
              <Text
                variant={'titleSmall'}
                style={styles.title}
                ellipsizeMode={'tail'}>
                Customizations for{' '}
                {cartItemDetails?.items[0]?.item?.product?.descriptor?.name}
              </Text>
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
              <Button onPress={addNewCustomization}>
                Add new customization
              </Button>
            </View>
          </View>
        </CloseSheetContainer>
      </RBSheet>
      {/*@ts-ignore*/}
      <RBSheet
        ref={productDetailsSheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <CloseSheetContainer closeSheet={hideProductDetails}>
          <View style={styles.sheetContainer}>
            <View style={styles.productDetails}>
              <ScrollView style={styles.productDetails}>
                <FBProductDetails product={productDetails}>
                  {inStock ? (
                    <>
                      <FBProductCustomization
                        hideProductDetails
                        product={productDetails}
                        customizationState={customizationState}
                        setCustomizationState={setCustomizationState}
                        setItemOutOfStock={setItemOutOfStock}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </FBProductDetails>
              </ScrollView>
              {inStock ? (
                <CustomizationFooterButtons
                  productLoading={productLoading}
                  itemQty={itemQty}
                  setItemQty={setItemQty}
                  itemOutOfStock={itemOutOfStock}
                  addDetailsToCart={addDetailsToCart}
                  product={product}
                  customizationPrices={customizationPrices}
                />
              ) : (
                <View style={styles.outOfStockContainer}>
                  <View
                    style={[
                      globalStyles.disabledOutlineButton,
                      styles.outOfStockButton,
                    ]}>
                    <Text
                      variant={'labelSmall'}
                      style={[
                        globalStyles.disabledOutlineButtonText,
                        styles.outOfStock,
                      ]}>
                      Out of stock
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </CloseSheetContainer>
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
    outOfStockContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 10,
    },
    outOfStockButton: {
      width: 90,
      borderRadius: 8,
      borderWidth: 1,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    outOfStock: {
      textAlign: 'center',
    },
    customise: {
      textAlign: 'center',
      color: '#979797',
    },
    rbSheet: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
    sheetContainer: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      backgroundColor: '#FFF',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleContainer: {
      marginLeft: 8,
    },
    title: {
      color: '#1A1A1A',
      flexShrink: 1,
    },
    prize: {
      color: '#008ECC',
    },
    customizationContainer: {
      padding: 16,
      backgroundColor: '#FAFAFA',
    },
    quantity: {
      alignItems: 'center',
      textAlign: 'center',
      minWidth: 50,
    },
    productTag: {
      marginTop: -118,
      marginLeft: 98,
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
    productDetails: {
      flex: 1,
    },
    sheetProductSymbol: {
      width: 36,
      height: 36,
    },
  });

export default FBProduct;
