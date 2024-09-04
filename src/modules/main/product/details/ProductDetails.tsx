import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {API_BASE_URL, CART, ITEM_DETAILS} from '../../../../utils/apiActions';
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
import userUpdateCartItem from '../../../../hooks/userUpdateCartItem';
import {showInfoToast, showToastWithGravity} from '../../../../utils/utils';
import {makeGlobalStyles} from '../../../../styles/styles';
import AboutProduct from './components/AboutProduct';
import {useAppTheme} from '../../../../utils/theme';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import {updateCartItems} from '../../../../toolkit/reducer/cart';
import SizeChart from './components/SizeChart';
import Page from '../../../../components/page/Page';

interface ProductDetails {
  route: any;
  navigation: any;
}

const CancelToken = axios.CancelToken;

export const areCustomisationsSame = (
  existingIds: any[],
  currentIds: any[],
) => {
  if (existingIds.length !== currentIds.length) {
    return false;
  }

  existingIds.sort();
  currentIds.sort();

  for (let i = 0; i < existingIds.length; i++) {
    if (existingIds[i] !== currentIds[i]) {
      return false;
    }
  }

  return true;
};

const ProductDetails: React.FC<ProductDetails> = ({
  navigation,
  route: {params},
}) => {
  const {formatNumber} = useFormatNumber();
  const voiceDetectionStarted = useRef<boolean>(false);
  const {t} = useTranslation();
  const firstTime = useRef<boolean>(true);
  const {uid} = useSelector(({auth}) => auth);
  const source = useRef<any>(null);
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const globalStyles = makeGlobalStyles(theme.colors);
  const currentCartItem = useRef<any>(null);

  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);
  const [product, setProduct] = useState<any>(null);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const [itemOutOfStock, setItemOutOfStock] = useState<boolean>(false);
  const [addToCartLoading, setAddToCartLoading] = useState<boolean>(false);
  const [customizationPrices, setCustomizationPrices] = useState<number>(0);
  const [itemAvailableInCart, setItemAvailableInCart] = useState<any>(null);
  const [isItemAvailableInCart, setIsItemAvailableInCart] =
    useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<any>(null);

  const [variationState, setVariationState] = useState<any[]>([]);
  const [customizationState, setCustomizationState] = useState<any>({});
  const {deleteDataWithAuth, getDataWithAuth, postDataWithAuth} =
    useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const {updateCartItem} = userUpdateCartItem();

  const getProductDetails = async () => {
    try {
      if (firstTime.current) {
        setApiRequested(true);
      }
      firstTime.current = false;
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ITEM_DETAILS}?id=${params.productId}`,
        source.current.token,
      );
      let rangePriceTag = null;
      if (data?.item_details?.price?.tags) {
        const findRangePriceTag = data?.item_details?.price?.tags.find(
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
      setProduct(data);
      navigation.setOptions({
        title: data?.provider_details?.descriptor?.name,
      });
      voiceDetectionStarted.current = true;
      await getCartItems(data.id);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  const calculateSubtotal = (groupId: any, newState: any) => {
    let group = newState[groupId];
    if (!group) {
      return;
    }

    let prices = group.selected.map((s: any) => s.price);
    setCustomizationPrices(prevState => {
      return prevState + prices.reduce((a: any, b: any) => a + b, 0);
    });

    group?.childs?.map((child: any) => {
      calculateSubtotal(child, newState);
    });
  };

  const getCustomization = (groupId: any, selectedCustomizationIds: any[]) => {
    let group = customizationState[groupId];
    if (!group) {
      return selectedCustomizationIds;
    }

    group.selected.forEach((selectedGroup: any) =>
      selectedCustomizationIds.push(selectedGroup.id),
    );
    group?.childs?.forEach((child: any) => {
      getCustomization(child, selectedCustomizationIds);
    });
    return selectedCustomizationIds;
  };

  const getCustomizations = () => {
    const {customisation_items} = product;

    if (!customisation_items.length) {
      return null;
    }
    const customizations = [];

    const firstGroupId = customizationState.firstGroup?.id;

    if (!firstGroupId) {
      return;
    }
    let selectedCustomizationIds = getCustomization(firstGroupId, []);

    for (const cId of selectedCustomizationIds) {
      let c = customisation_items.find((item: any) => item.local_id === cId);
      if (c) {
        c = {
          ...c,
          quantity: {
            count: 1,
          },
        };
        customizations.push(c);
      }
    }

    return customizations;
  };

  const getCartItems = async (pId = null) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CART}/${uid}/all`,
        source.current.token,
      );
      let ind: any = 0;
      if (pId) {
        let isItemAvailable = false;
        let findItem;
        data.map((res: any, index: number) => {
          const check = res.items.find((item: any) => item.item.id === pId);
          if (check) {
            ind = index;
            findItem = check;
          }
        });
        if (findItem) {
          isItemAvailable = true;
          setItemAvailableInCart(findItem);
          currentCartItem.current = findItem;
        }
        setIsItemAvailableInCart(isItemAvailable);
      } else {
        currentCartItem.current = null;
        setItemAvailableInCart(null);
        setIsItemAvailableInCart(false);
      }
      dispatch(updateCartItems(data));
      return data[ind].items;
    } catch (error) {
      console.log('Error fetching cart items:', error);
      return [];
    }
  };

  const deleteCartItem = async (itemId: any) => {
    source.current = CancelToken.source();
    await deleteDataWithAuth(
      `${API_BASE_URL}${CART}/${uid}/${itemId}`,
      source.current.token,
    );
    await getCartItems();
  };

  const addToCart = async (isIncrement = true) => {
    try {
      setAddToCartLoading(true);
      source.current = CancelToken.source();
      const url = `${API_BASE_URL}${CART}/${uid}`;
      let subtotal = product?.item_details?.price?.value;

      const customisations = getCustomizations() ?? null;

      if (customisations) {
        calculateSubtotal(
          customizationState.firstGroup?.id,
          customizationState,
        );
        subtotal += customizationPrices;
      }

      const payload: any = {
        id: product.id,
        local_id: product.local_id,
        bpp_id: product.bpp_details.bpp_id,
        bpp_uri: product.context.bpp_uri,
        domain: product.context.domain,
        tags: product.item_details.tags,
        customisationState: customizationState,
        contextCity: product.context.city,
        quantity: {
          count: 1,
        },
        provider: {
          id: product.bpp_details.bpp_id,
          locations: product.locations,
          ...product.provider_details,
        },
        location_details: product.location_details,
        product: {
          id: product.id,
          subtotal,
          ...product.item_details,
        },
        customisations,
        hasCustomisations: !!customisations,
      };

      const cartItems: any[] = await getCartItems(product.id);

      let cartItem = cartItems?.filter(ci => {
        return ci.item.id === payload.id;
      });

      if (customisations) {
        cartItem = cartItem.filter(ci => {
          return ci.item.customisations != null;
        });
      }

      if (cartItem.length > 0 && customisations) {
        cartItem = cartItem.filter(ci => {
          return ci.item.customisations.length === customisations.length;
        });
      }

      if (cartItem.length === 0) {
        await postDataWithAuth(url, payload, source.current.token);
        await getCartItems(product.id);
        setAddToCartLoading(false);
      } else {
        const currentCount = Number(cartItem[0].item.quantity.count);
        const maxCount = Number(
          cartItem[0].item.product.quantity.maximum.count,
        );

        if (currentCount < maxCount || !isIncrement) {
          if (!customisations) {
            const data = await updateCartItem(
              cartItems,
              isIncrement,
              cartItem[0]._id,
            );
            setItemAvailableInCart(data);
            showInfoToast('Item quantity updated in your cart.');
            await getCartItems(product.id);
            setAddToCartLoading(false);
          } else {
            const currentIds = customisations.map(item => item.id);
            let matchingCustomisation = null;

            for (let i = 0; i < cartItem.length; i++) {
              let existingIds = cartItem[i].item.customisations.map(
                (item: any) => item.id,
              );
              const areSame = areCustomisationsSame(existingIds, currentIds);
              if (areSame) {
                matchingCustomisation = cartItem[i];
              }
            }

            if (matchingCustomisation) {
              await updateCartItem(
                cartItems,
                isIncrement,
                matchingCustomisation._id,
              );
              await getCartItems(product.id);
              showToastWithGravity(
                t('Product Summary.Item quantity updated in your cart'),
              );
              setAddToCartLoading(false);
            } else {
              await postDataWithAuth(url, payload, source.current.token);
              showToastWithGravity(
                t('Product Summary.Item added to cart successfully'),
              );
              setAddToCartLoading(false);
              await getCartItems(product.id);
            }
          }
        } else {
          showToastWithGravity(
            t(
              'Product Summary.The maximum available quantity for item is already in your cart',
            ),
          );
          setAddToCartLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openSizeChart = () => setShowSizeChart(true);

  const closeSizeChart = () => setShowSizeChart(false);

  useEffect(() => {
    getProductDetails().then(() => {});

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, [params]);

  if (apiRequested) {
    return <ProductSkeleton />;
  }

  const disableActionButtons: boolean =
    Number(product?.item_details?.quantity?.available?.count) < 1 ||
    itemOutOfStock ||
    addToCartLoading;

  return (
    <Page outletId={product?.location_details?.id}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ProductImages
          images={[product?.item_details?.descriptor?.symbol].concat(
            product?.item_details?.descriptor?.images,
          )}
        />
        <View style={styles.details}>
          {(product?.context?.domain === FB_DOMAIN ||
            product?.context?.domain === GROCERY_DOMAIN) && (
            <View style={styles.stockRow}>
              <VegNonVegTag tags={product?.item_details?.tags} showLabel />
            </View>
          )}
          <Text variant="headlineSmall" style={styles.title}>
            {product?.item_details?.descriptor?.name}
          </Text>
          {priceRange ? (
            <View style={styles.priceContainer}>
              <Text variant="headlineSmall" style={styles.price}>
                {`₹${formatNumber(priceRange?.minPrice)} - ₹${formatNumber(
                  priceRange?.maxPrice,
                )}`}
              </Text>
            </View>
          ) : (
            <View style={styles.priceContainer}>
              <Text variant="headlineSmall" style={styles.price}>
                ₹{formatNumber(product?.item_details?.price?.value)}
              </Text>
              {Number(product?.item_details?.price?.maximum_value) !==
                product?.item_details?.price?.value && (
                <Text variant="titleSmall" style={styles.maximumAmount}>
                  ₹
                  {formatNumber(
                    Number(product?.item_details?.price?.maximum_value).toFixed(
                      0,
                    ),
                  )}
                </Text>
              )}
            </View>
          )}
          <VariationsRenderer
            product={product}
            openSizeChart={openSizeChart}
            variationState={variationState}
            setVariationState={setVariationState}
            isFashion={
              product?.context?.domain === FASHION_DOMAIN &&
              !!product?.attributes?.size_chart
            }
          />
          {product?.context?.domain === FB_DOMAIN && (
            <FBProductCustomization
              product={product}
              customizationState={customizationState}
              setCustomizationState={setCustomizationState}
              isEditFlow={false}
              setItemOutOfStock={setItemOutOfStock}
            />
          )}
          <View style={styles.addToCartContainer}>
            {product?.context.domain !== FB_DOMAIN &&
            isItemAvailableInCart &&
            itemAvailableInCart ? (
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.incrementButton}
                  onPress={() => {
                    if (itemAvailableInCart.item.quantity.count === 1) {
                      deleteCartItem(itemAvailableInCart._id).then(() => {});
                    } else {
                      addToCart(false).then(() => {});
                    }
                  }}>
                  <Icon name={'minus'} color={theme.colors.primary} size={18} />
                </TouchableOpacity>
                <Text variant={'bodyLarge'} style={styles.quantity}>
                  {addToCartLoading ? (
                    <ActivityIndicator size={16} color={theme.colors.primary} />
                  ) : (
                    formatNumber(itemAvailableInCart.item.quantity.count)
                  )}
                </Text>
                <TouchableOpacity
                  style={styles.incrementButton}
                  onPress={() => addToCart(true)}>
                  <Icon name={'plus'} color={theme.colors.primary} size={18} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.addToCartButton,
                  disableActionButtons
                    ? globalStyles.disabledContainedButton
                    : globalStyles.outlineButton,
                ]}
                onPress={() => addToCart(true)}
                disabled={disableActionButtons}>
                {addToCartLoading ? (
                  <ActivityIndicator
                    size={'small'}
                    color={theme.colors.primary}
                  />
                ) : (
                  <Text
                    variant={'bodyLarge'}
                    style={
                      disableActionButtons
                        ? globalStyles.disabledOutlineButtonText
                        : styles.addToCartLabel
                    }>
                    {t('Cart.Add to cart')}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          <AboutProduct product={product} inStock />
        </View>
      </ScrollView>
      {showSizeChart && (
        <SizeChart
          sizeChart={product?.attributes?.size_chart}
          closeSizeChart={closeSizeChart}
        />
      )}
    </Page>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backButton: {
      marginRight: 10,
    },
    stockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    details: {
      padding: 16,
    },
    title: {
      color: colors.neutral400,
      marginBottom: 12,
    },
    price: {
      color: colors.neutral400,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    maximumAmount: {
      color: colors.neutral300,
      marginLeft: 12,
      textDecorationLine: 'line-through',
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addToCartContainer: {
      marginTop: 28,
    },
    addToCartButton: {
      flex: 1,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 44,
      backgroundColor: colors.primary,
    },
    addToCartLabel: {
      color: colors.white,
    },
    buttonGroup: {
      backgroundColor: colors.primary50,
      borderColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      borderWidth: 1,
      borderRadius: 8,
      height: 44,
      justifyContent: 'center',
    },
    incrementButton: {
      paddingHorizontal: 12,
    },
    quantity: {
      color: colors.primary,
      marginHorizontal: 20,
    },
  });

export default ProductDetails;
