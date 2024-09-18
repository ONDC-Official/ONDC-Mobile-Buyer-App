import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import Wishlist from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useSelector} from 'react-redux';

import {CURRENCY_SYMBOLS, FB_DOMAIN} from '../../../../utils/constants';
import {useAppTheme} from '../../../../utils/theme';
import VegNonVegTag from '../../../../components/products/VegNonVegTag';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, CART} from '../../../../utils/apiActions';
import userUpdateCartItem from '../../../../hooks/userUpdateCartItem';
import {
  areCustomisationsSame,
  showInfoToast,
  showToastWithGravity,
} from '../../../../utils/utils';
import {useTranslation} from 'react-i18next';

interface Product {
  product: any;
  isOpen: boolean;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const Product: React.FC<Product> = ({product, isOpen}) => {
  const CancelToken = axios.CancelToken;
  const {formatNumber} = useFormatNumber();
  const isFBDomain = product.context.domain === FB_DOMAIN;
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [itemAvailableInCart, setItemAvailableInCart] = useState<any>(null);
  const [addToCartLoading, setAddToCartLoading] = useState<boolean>(false);
  const [customizationState, setCustomizationState] = useState<any>({});
  const [customizationPrices, setCustomizationPrices] = useState<number>(0);
  const source = useRef<any>(null);
  const {deleteDataWithAuth, getDataWithAuth, postDataWithAuth} =
    useNetworkHandling();
  const {uid} = useSelector(({auth}) => auth);
  const {updateCartItem} = userUpdateCartItem();
  const {t} = useTranslation();

  const navigateToProductDetails = () => {
    navigation.navigate('ProductDetails', {productId: product.id});
  };

  const inStock =
    Number(product?.item_details?.quantity?.available?.count) >= 1;
  const disabled = !inStock || !isOpen;

  let imageSource = NoImageAvailable;
  if (product?.item_details?.descriptor?.symbol) {
    imageSource = {
      uri: product?.item_details?.descriptor?.symbol,
    };
  } else if (product?.item_details?.descriptor?.images?.length > 0) {
    imageSource = {
      uri: product?.item_details?.descriptor?.images[0],
    };
  }

  const getCartItems = async (pId = null) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CART}/${uid}/all`,
        source.current.token,
      );
      let ind: any = 0;
      if (pId) {
        let findItem;
        data.map((res: any, index: number) => {
          const check = res.items.find((item: any) => item.item.id === pId);
          if (check) {
            ind = index;
            findItem = check;
          }
        });
        if (findItem) {
          setItemAvailableInCart(findItem);
        }
      } else {
        setItemAvailableInCart(null);
      }
      return data[ind].items;
    } catch (error) {
      console.log('Error fetching cart items:', error);
      return [];
    }
  };

  const addToCart = async (isIncrement = true) => {
    try {
      setAddToCartLoading(true);
      source.current = CancelToken.source();
      const url = `${API_BASE_URL}${CART}/${uid}`;
      let subtotal = product?.item_details?.price?.value;

      const customisations: any = null;

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
            const currentIds = customisations.map((item: any) => item.id);
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

  const deleteCartItem = async (itemId: any) => {
    source.current = CancelToken.source();
    await deleteDataWithAuth(
      `${API_BASE_URL}${CART}/${uid}/${itemId}`,
      source.current.token,
    );
    await getCartItems();
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

  useEffect(() => {
    getCartItems(product.id).then(() => {});
  }, [product]);

  const currency = CURRENCY_SYMBOLS[product?.item_details?.price?.currency];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={navigateToProductDetails}
      disabled={disabled}>
      {disabled ? (
        <Grayscale>
          <FastImage
            style={styles.gridImage}
            source={imageSource}
            resizeMode={FastImage.resizeMode.cover}
          />
        </Grayscale>
      ) : (
        <FastImage
          style={styles.gridImage}
          source={imageSource}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      {isFBDomain && (
        <View style={styles.vegNonVegContainer}>
          <VegNonVegTag tags={product.item_details.tags} />
        </View>
      )}

      <View style={styles.meta}>
        <Text
          variant={'labelLarge'}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={styles.name}>
          {product?.item_details?.descriptor?.name}
        </Text>
        <Text
          variant={'labelSmall'}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={styles.provider}>
          {product?.item_details?.descriptor?.short_desc}
        </Text>
        <View style={styles.priceView}>
          <View style={styles.priceText}>
            {Number(product?.item_details?.price?.maximum_value) !==
            Number(product?.item_details?.price?.value) ? (
              <Text variant={'labelSmall'} style={styles.amountStrike}>
                {currency}
                {formatNumber(
                  Number(product?.item_details?.price?.maximum_value).toFixed(
                    2,
                  ),
                )}
              </Text>
            ) : (
              <View style={styles.amountStrikeEmpty} />
            )}
            <Text variant={'labelLarge'} style={styles.amount}>
              {currency}
              {formatNumber(
                product?.item_details?.price?.value > 1000
                  ? product?.item_details?.price?.value.toFixed(0)
                  : product?.item_details?.price?.value.toFixed(2),
              )}
            </Text>
          </View>
          {itemAvailableInCart ? (
            <View style={styles.quantityView}>
              <TouchableOpacity
                onPress={() => {
                  if (itemAvailableInCart.item.quantity.count === 1) {
                    deleteCartItem(itemAvailableInCart._id).then(() => {});
                  } else {
                    addToCart(false).then(() => {});
                  }
                }}>
                <Icon name={'minus'} color={theme.colors.primary} size={20} />
              </TouchableOpacity>
              <Text variant={'bodyLarge'} style={styles.quantity}>
                {addToCartLoading ? (
                  <ActivityIndicator size={16} color={theme.colors.primary} />
                ) : (
                  formatNumber(itemAvailableInCart.item.quantity.count)
                )}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  addToCart(true);
                }}>
                <Icon name={'plus'} color={theme.colors.primary} size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.quantityView}
              onPress={() => {
                addToCart(true);
              }}>
              <Text variant={'bodyLarge'} style={styles.quantityText}>
                {t('Cart.FBProduct.Add')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.wishlist}>
        <Wishlist
          name="cards-heart-outline"
          size={20}
          color={theme.colors.error600}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 15,
    },
    meta: {
      flex: 1,
      marginTop: 12,
    },
    gridImage: {
      width: '100%',
      height: 173,
      borderRadius: 15,
    },
    wishlist: {
      position: 'absolute',
      top: 4,
      left: 4,
      height: 28,
      width: 28,
      borderRadius: 28,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      color: colors.neutral400,
      marginBottom: 2,
    },
    provider: {
      color: colors.neutral300,
      marginTop: 4,
    },
    amount: {
      color: colors.neutral400,
    },
    amountStrike: {
      color: colors.neutral200,
      textDecorationLine: 'line-through',
    },
    amountStrikeEmpty: {
      height: 18,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    vegNonVegContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      width: '100%',
      paddingTop: 12,
      paddingRight: 12,
    },
    priceView: {
      flexDirection: 'row',
    },
    priceText: {
      flex: 1,
    },
    quantityView: {
      height: 28,
      width: 72,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: colors.primary,
      alignSelf: 'flex-end',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    quantityText: {
      color: colors.primary,
    },
    quantity: {
      color: colors.primary,
    },
  });

export default Product;
