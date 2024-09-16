import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Grayscale} from 'react-native-color-matrix-image-filters';
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
import {makeGlobalStyles} from '../../../../styles/styles';
import Customizations from '../../../../components/customization/Customizations';
import ManageQuantity from '../../../../components/customization/ManageQuantity';
import useUpdateSpecificItemCount from '../../../../hooks/useUpdateSpecificItemCount';
import useCustomizationStateHelper from '../../../../hooks/useCustomizationStateHelper';
import CustomizationFooterButtons from './CustomizationFooterButtons';
import FBProductDetails from '../../product/details/FBProductDetails';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';
import {useAppTheme} from '../../../../utils/theme';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import {updateCartItems} from '../../../../toolkit/reducer/cart';
import {areCustomisationsSame} from '../../product/details/ProductDetails';

interface FBProduct {
  product: any;
  provider: any;
  isOpen: boolean;
}

const NoImageAvailable = require('../../../../assets/noImage.png');
const screenHeight: number = Dimensions.get('screen').height;

const CancelToken = axios.CancelToken;
const FBProduct: React.FC<FBProduct> = ({product, isOpen}) => {
  const {formatNumber} = useFormatNumber();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const globalStyles = makeGlobalStyles(theme.colors);
  const {deleteDataWithAuth, getDataWithAuth, postDataWithAuth} =
    useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const {uid} = useSelector(({auth}) => auth);
  const {cartItems} = useSelector(({cart}) => cart);
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
  const [defaultPrice, setDefaultPrice] = useState<any>(0);

  const customizable = useMemo(() => {
    return !!product?.item_details?.tags?.find(
      (item: any) => item.code === 'custom_group',
    );
  }, [product]);

  const showCustomization = () => {
    setTimeout(() => {
      customizationSheet.current.open();
    }, 200);
  };

  const hideCustomization = () => customizationSheet.current.close();

  const showQuantitySheet = () => quantitySheet.current.open();

  const hideQuantitySheet = () => quantitySheet.current.close();

  const hideProductDetails = () => productDetailsSheet.current.close();

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

  const removeQuantityClick = () => {
    if (cartItemDetails?.items.length === 1) {
      const cartItem = cartItemDetails?.items[0];
      if (cartItem?.item?.quantity?.count === 1) {
        setProductLoading(true);
        deleteCartItem(cartItem?._id)
          .then(() => {
            setProductLoading(false);
          })
          .catch(() => {
            setProductLoading(false);
          });
      } else {
        setProductLoading(true);
        updateSpecificItem(
          cartItem?.item?.location_details.id,
          cartItem?.item?.id,
          false,
          cartItem?._id,
        )
          .then(() => {
            setProductLoading(false);
          })
          .catch(() => {
            setProductLoading(false);
          });
      }
    } else {
      showQuantitySheet();
    }
  };

  const incrementProductQuantity = async () => {
    if (customizable) {
      showQuantitySheet();
    } else {
      let items: any[] = cartItemDetails.items.filter(
        (ci: any) => ci.item.id === product.id,
      );
      if (items.length > 0) {
        try {
          setProductLoading(true);
          await updateSpecificItem(
            items[0]?.item?.location_details.id,
            items[0]?.item?.id,
            true,
            items[0]?._id,
          );
        } catch (e) {
          console.log(e);
        } finally {
          setProductLoading(false);
        }
      }
    }
  };

  const addToCart = async () => {
    if (customizable) {
      if (productDetails) {
        showCustomization();
      } else {
        await getProductDetails();
      }
    } else {
      await addNonCustomizableProduct();
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
        location_details: productDetails.location_details,
        product: {
          id: productDetails.id,
          subtotal,
          ...productDetails.item_details,
        },
        customisations,
        hasCustomisations: true,
      };

      const newCartItems = JSON.parse(JSON.stringify(cartItems));
      let providerCart: any = newCartItems?.find(
        (cart: any) => cart.location_id === product.location_details.id,
      );
      if (providerCart) {
        let items: any[] = [];
        items = providerCart.items.filter(
          (ci: any) => ci.item.id === payload.id,
        );

        if (items.length > 0 && customisations && customisations.length > 0) {
          items = providerCart.items.filter(
            (ci: any) =>
              ci.item.customisations &&
              ci.item.customisations.length === customisations?.length,
          );
        }

        source.current = CancelToken.source();
        if (items.length === 0) {
          await postDataWithAuth(url, payload, source.current.token);
          setCustomizationState({});
          setProductLoading(false);
          showToastWithGravity(
            t('Product Summary.Item added to cart successfully'),
          );
          hideCustomization();
        } else {
          const currentCount = Number(items[0].item.quantity.count);
          const maxCount = Number(items[0].item.product.quantity.maximum.count);

          if (currentCount < maxCount) {
            if (!customisations) {
              await updateCartItem(cartItems, true, items[0]._id);
              showToastWithGravity(
                t('Product Summary.Item quantity updated in your cart'),
              );
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
                await updateCartItem(
                  cartItems,
                  true,
                  matchingCustomisation._id,
                );
                showToastWithGravity(
                  t('Product Summary.Item quantity updated in your cart'),
                );
                setCustomizationState({});
                setProductLoading(false);
                hideCustomization();
              } else {
                source.current = CancelToken.source();
                await postDataWithAuth(url, payload, source.current.token);
                setCustomizationState({});
                setProductLoading(false);
                showToastWithGravity(
                  t('Product Summary.Item added to cart successfully'),
                );
                hideCustomization();
              }
            }
          } else {
            showToastWithGravity(
              t(
                'Product Summary.The maximum available quantity for item is already in your cart.',
              ),
            );
          }
        }
      } else {
        source.current = CancelToken.source();
        await postDataWithAuth(url, payload, source.current.token);
        setCustomizationState({});
        setProductLoading(false);
        showToastWithGravity(
          t('Product Summary.Item added to cart successfully'),
        );
        hideCustomization();
      }
      await getCartItems();
    } catch (error) {
      console.log(error);
    } finally {
      setProductLoading(false);
    }
  };

  const addNonCustomizableProduct = async () => {
    try {
      setApiInProgress(true);
      productSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ITEM_DETAILS}?id=${product.id}`,
        productSource.current.token,
      );
      setProductDetails(data);

      const subtotal = data?.item_details?.price?.value;

      const payload: any = {
        id: data.id,
        local_id: data.local_id,
        bpp_id: data.bpp_details.bpp_id,
        bpp_uri: data.context.bpp_uri,
        contextCity: data.context.city,
        domain: data.context.domain,
        tags: data.item_details.tags,
        customisationState: customizationState,
        quantity: {
          count: itemQty,
        },
        provider: {
          id: data.bpp_details.bpp_id,
          locations: data.locations,
          ...data.provider_details,
        },
        location_details: data.location_details,
        product: {
          id: data.id,
          subtotal,
          ...data.item_details,
        },
        customisations: null,
        hasCustomisations: false,
      };

      const url = `${API_BASE_URL}${CART}/${uid}`;
      source.current = CancelToken.source();
      await postDataWithAuth(url, payload, source.current.token);
      setCustomizationState({});
      showToastWithGravity(
        t('Product Summary.Item added to cart successfully'),
      );
      await getCartItems();
      setProductLoading(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiInProgress(false);
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
    locationId: any,
    itemId: any,
    increment: boolean,
    uniqueId: any,
  ) => {
    await updateSpecificCartItem(
      locationId,
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
      await getCartItems();
    } catch (error) {
      console.log(error);
    } finally {
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    if (product && cartItems.length > 0) {
      let providerCart: any = cartItems?.find(
        (cart: any) => cart.location_id === product.location_details.id,
      );

      if (providerCart) {
        let items: any[] = providerCart?.items?.filter(
          (one: any) => one.item.id === product.id,
        );
        let quantity = 0;
        const productQuantity = items?.reduce(
          (accumulator, item) => accumulator + item.item.quantity.count,
          quantity,
        );
        setCartItemDetails({items, productQuantity});
      } else {
        setCartItemDetails({items: [], productQuantity: 0});
      }
    } else {
      setCartItemDetails({items: [], productQuantity: 0});
      quantitySheet.current.close();
    }
  }, [product, cartItems]);

  useEffect(() => {
    let rangePriceTag = null;
    let price = 0;
    if (product?.item_details?.price?.tags) {
      const defaultSelectionTag = product?.item_details?.price?.tags.find(
        (item: any) => item.code === 'default_selection',
      );
      if (defaultSelectionTag) {
        const findDefaultTag = defaultSelectionTag.list.find(
          (item: any) => item.code === 'value',
        );
        if (findDefaultTag) {
          price = findDefaultTag.value;
        }
      } else {
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
    }
    setPriceRange(rangePriceTag);
    setDefaultPrice(price);
  }, [product]);

  const inStock =
    Number(product?.item_details?.quantity?.available?.count) >= 1;
  const disabled = apiInProgress || !inStock || !isOpen;

  const currency = useMemo(
    () => CURRENCY_SYMBOLS[product?.item_details?.price?.currency],
    [product, CURRENCY_SYMBOLS],
  );

  const productImageSource = useMemo(() => {
    if (product?.item_details?.descriptor.symbol) {
      return {uri: product?.item_details?.descriptor.symbol};
    } else if (product?.item_details?.descriptor?.images?.length > 0) {
      return {uri: product?.item_details?.descriptor.images[0]};
    } else {
      return NoImageAvailable;
    }
  }, [product?.item_details?.descriptor]);

  const renderPrice = () => {
    if (defaultPrice) {
      return (
        <Text variant={'bodyLarge'} style={styles.price}>
          {currency}
          {formatNumber(defaultPrice.toFixed(2))}
        </Text>
      );
    } else if (priceRange) {
      const min = formatNumber(priceRange?.minPrice.toFixed(2));
      const max = formatNumber(priceRange?.maxPrice.toFixed(2));
      return (
        <Text variant={'bodyLarge'} style={styles.price}>
          {currency}{min}- {currency}{max}
        </Text>
      );
    } else if (product?.item_details?.price?.value) {
      return (
        <Text variant={'bodyLarge'} style={styles.price}>
          {currency}
          {formatNumber(product?.item_details?.price?.value.toFixed(2))}
        </Text>
      );
    } else {
      return <></>;
    }
  };

  // @ts-ignore
  return (
    <>
      <View style={styles.product}>
        <TouchableOpacity
          style={styles.meta}
          disabled={disabled}
          onPress={showProductDetails}>
          <Text
            variant={'labelLarge'}
            style={styles.name}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {product?.item_details?.descriptor?.name}
          </Text>
          <Text
            variant={'labelSmall'}
            style={styles.category}
            numberOfLines={5}
            ellipsizeMode={'tail'}>
            {product?.item_details?.descriptor?.short_desc}
          </Text>
          {renderPrice()}
        </TouchableOpacity>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.imageContainer}
            disabled={disabled}
            onPress={showProductDetails}>
            {disabled ? (
              <Grayscale>
                <FastImage style={styles.image} source={productImageSource} />
              </Grayscale>
            ) : (
              <FastImage style={styles.image} source={productImageSource} />
            )}
            <View style={styles.productTag}>
              <VegNonVegTag tags={product?.item_details?.tags} />
            </View>
          </TouchableOpacity>
          {cartItemDetails?.productQuantity > 0 ? (
            <View style={styles.buttonContainer}>
              <View
                style={[
                  disabled
                    ? globalStyles.disabledOutlineButton
                    : globalStyles.outlineButton,
                  styles.quantityContainer,
                  styles.actionButton,
                ]}>
                <TouchableOpacity
                  onPress={removeQuantityClick}
                  disabled={disabled}>
                  <Icon name={'minus'} color={theme.colors.primary} size={18} />
                </TouchableOpacity>
                <Text
                  variant={'bodyLarge'}
                  style={[
                    disabled
                      ? globalStyles.disabledOutlineButtonText
                      : globalStyles.outlineButtonText,
                  ]}>
                  {productLoading ? (
                    <ActivityIndicator size={18} />
                  ) : (
                    formatNumber(cartItemDetails?.productQuantity)
                  )}
                </Text>
                <TouchableOpacity
                  disabled={disabled}
                  onPress={incrementProductQuantity}>
                  <Icon name={'plus'} color={theme.colors.primary} size={18} />
                </TouchableOpacity>
              </View>
              {customizable && (
                <Text variant={'labelSmall'} style={styles.customise}>
                  {t('Cart.FBProduct.Customizable')}
                </Text>
              )}
            </View>
          ) : inStock ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  disabled
                    ? globalStyles.disabledOutlineButton
                    : globalStyles.outlineButton,
                  styles.addButton,
                  styles.actionButton,
                ]}
                onPress={addToCart}
                disabled={disabled}>
                <Text
                  variant={'bodyLarge'}
                  style={[
                    disabled
                      ? globalStyles.disabledOutlineButtonText
                      : globalStyles.outlineButtonText,
                  ]}>
                  {t('Cart.FBProduct.Add')}
                </Text>
                {apiInProgress || productLoading ? (
                  <ActivityIndicator size={18} />
                ) : (
                  <Icon
                    name={'plus'}
                    color={
                      disabled ? theme.colors.disabled : theme.colors.primary
                    }
                    size={18}
                  />
                )}
              </TouchableOpacity>
              {customizable && (
                <Text variant={'labelSmall'} style={styles.customise}>
                  {t('Cart.FBProduct.Customizable')}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.outOfStockButtonContainer}>
              <Text variant={'bodyLarge'} style={[styles.outOfStock]}>
                {t('Cart.FBProduct.Out of stock')}
              </Text>
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
                <Text
                  variant={'titleMedium'}
                  style={styles.title}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}>
                  {product?.item_details?.descriptor?.name}
                </Text>
                <Text variant={'labelLarge'} style={styles.prize}>
                  {currency}
                  {formatNumber(product?.item_details?.price?.value)}
                </Text>
              </View>
            </View>
            <ScrollView
              contentContainerStyle={styles.customizationContainer}
              showsVerticalScrollIndicator={false}>
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
                variant={'headlineSmall'}
                style={styles.title}
                ellipsizeMode={'tail'}>
                {t('Cart.Customization for')}
              </Text>
            </View>
            <View style={styles.quantitySheetContainer}>
              <View style={styles.customizationListContainer}>
                <View style={styles.customizationList}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {cartItemDetails?.items?.map((item: any) => (
                      <View key={item?._id} style={styles.cartItem}>
                        <View style={styles.productMeta}>
                          <VegNonVegTag tags={item.item?.tags} />
                          <Text
                            variant={'bodyLarge'}
                            style={styles.customizationName}>
                            {item?.item?.product?.descriptor?.name}
                          </Text>
                          <Customizations cartItem={item} />
                          <Text variant="bodyLarge" style={styles.cartQuantity}>
                            ₹
                            {item.item.hasCustomisations
                              ? formatNumber(
                                  Number(
                                    (
                                      getPriceWithCustomisations(item) *
                                      Number(item?.item?.quantity?.count)
                                    ).toFixed(2),
                                  ),
                                )
                              : formatNumber(
                                  Number(
                                    item?.item?.product?.subtotal *
                                      Number(item?.item?.quantity?.count),
                                  ).toFixed(2),
                                )}
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
                </View>
                <TouchableOpacity
                  style={styles.addNewCustomizationButton}
                  onPress={addNewCustomization}>
                  <Text
                    variant={'bodyLarge'}
                    style={styles.addNewCustomizationLabel}>
                    {t('Cart.Add new customization')}
                  </Text>
                </TouchableOpacity>
              </View>
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.productDetails}>
              <FBProductDetails product={productDetails} inStock={inStock}>
                {inStock ? (
                  <FBProductCustomization
                    hideProductDetails
                    product={productDetails}
                    customizationState={customizationState}
                    setCustomizationState={setCustomizationState}
                    setItemOutOfStock={setItemOutOfStock}
                  />
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
                <View style={[styles.outOfStockSheetButton]}>
                  <Text
                    variant={'labelSmall'}
                    style={[styles.outOfStockSheetButtonText]}>
                    {t('Cart.FBProduct.Out of stock')}
                  </Text>
                </View>
              </View>
            )}
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
    },
    outOfStockButtonContainer: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      opacity: 0.9,
      width: 126,
      paddingVertical: 10,
      marginTop: 50,
    },
    buttonContainer: {
      marginTop: -32,
    },
    field: {
      marginBottom: 12,
    },
    customizationName: {
      color: colors.neutral400,
      marginTop: 8,
      marginBottom: 4,
    },
    name: {
      color: colors.neutral400,
    },
    price: {
      color: colors.neutral400,
    },
    category: {
      color: colors.neutral300,
      marginBottom: 4,
    },
    actionButton: {
      width: 88,
      borderRadius: 8,
      borderWidth: 1,
      paddingVertical: 7,
      backgroundColor: colors.white,
    },
    quantityContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    addButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 17,
    },
    outOfStockContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 10,
    },
    outOfStockButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    outOfStock: {
      textAlign: 'center',
      color: colors.neutral300,
    },
    customise: {
      textAlign: 'center',
      color: colors.neutral300,
      marginTop: 4,
    },
    rbSheet: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
    sheetContainer: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      backgroundColor: colors.neutral50,
      flex: 1,
    },
    header: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      backgroundColor: colors.white,
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleContainer: {
      marginLeft: 8,
    },
    title: {
      color: colors.neutral400,
      flexShrink: 1,
    },
    prize: {
      color: colors.primary,
    },
    customizationContainer: {
      padding: 16,
      backgroundColor: colors.neutral50,
    },
    quantitySheetContainer: {
      padding: 16,
      flex: 1,
      backgroundColor: colors.neutral50,
    },
    customizationListContainer: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.neutral100,
      flex: 1,
    },
    customizationList: {
      flex: 1,
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
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral100,
      marginBottom: 8,
      paddingBottom: 8,
    },
    productMeta: {
      flex: 1,
    },
    addNewCustomizationButton: {
      paddingVertical: 8,
    },
    addNewCustomizationLabel: {
      color: colors.primary,
      textAlign: 'center',
    },
    cartQuantity: {
      marginTop: 4,
      color: colors.neutral400,
    },
    productDetails: {
      height: screenHeight - 200,
    },
    sheetProductSymbol: {
      width: 36,
      height: 36,
    },
    outOfStockSheetButton: {
      borderRadius: 8,
      backgroundColor: colors.neutral300,
      paddingVertical: 13,
      alignItems: 'center',
      marginHorizontal: 24,
      width: Dimensions.get('screen').width - 48,
    },
    outOfStockSheetButtonText: {
      color: colors.white,
    },
  });

export default FBProduct;
