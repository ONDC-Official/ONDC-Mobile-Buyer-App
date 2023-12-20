import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {List, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {useSelector} from 'react-redux';
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
import {showToastWithGravity} from '../../../../utils/utils';
import {makeGlobalStyles} from '../../../../styles/styles';
import StockAvailability from '../../../../components/products/StockAvailability';

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
  const firstTime = useRef<boolean>(true);
  const {uid} = useSelector(({authReducer}) => authReducer);
  const source = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const globalStyles = makeGlobalStyles(theme.colors);

  const [product, setProduct] = useState<any>(null);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const [itemOutOfStock, setItemOutOfStock] = useState<boolean>(false);
  const [addToCartLoading, setAddToCartLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [customizationPrices, setCustomizationPrices] = useState<number>(0);
  const [itemAvailableInCart, setItemAvailableInCart] = useState<any>(null);
  const [isItemAvailableInCart, setIsItemAvailableInCart] =
    useState<boolean>(false);

  const [variationState, setVariationState] = useState<any[]>([]);
  const [customizationState, setCustomizationState] = useState<any>({});
  const {deleteDataWithAuth, getDataWithAuth, postDataWithAuth} =
    useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const {updateCartItem} = userUpdateCartItem();

  const handleAccordionPress = () => setExpanded(!expanded);

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
      navigation.setOptions({
        headerTitle: data?.item_details?.descriptor?.name,
      });
      await getCartItems(data.id);
      setProduct(data);
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
      return prevState + prices.reduce((a, b) => a + b, 0);
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
        `${API_BASE_URL}${CART}/${uid}`,
        source.current.token,
      );
      if (pId) {
        let isItemAvailable = false;
        const findItem = data.find((item: any) => item.item.id === pId);
        if (findItem) {
          isItemAvailable = true;
          setItemAvailableInCart(findItem);
        }
        setIsItemAvailableInCart(isItemAvailable);
      } else {
        setItemAvailableInCart(null);
        setIsItemAvailableInCart(false);
      }
      return data;
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

  const addToCart = async (navigate = false, isIncrement = true) => {
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
        setAddToCartLoading(false);
        await getCartItems(product.id);
      } else {
        const currentCount = Number(cartItem[0].item.quantity.count);
        const maxCount = Number(
          cartItem[0].item.product.quantity.maximum.count,
        );

        if (currentCount < maxCount || !isIncrement) {
          if (!customisations) {
            await updateCartItem(cartItems, isIncrement, cartItem[0]._id);
            showToastWithGravity('Item quantity updated in your cart.');
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
              showToastWithGravity('Item quantity updated in your cart.');
              setAddToCartLoading(false);
            } else {
              await postDataWithAuth(url, payload, source.current.token);
              showToastWithGravity('Item added to cart successfully.');
              setAddToCartLoading(false);
              await getCartItems(product.id);
            }
          }
        } else {
          showToastWithGravity(
            'The maximum available quantity for item is already in your cart.',
          );
          setAddToCartLoading(false);
        }
      }
      if (navigate) {
        navigation.navigate('Cart');
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          <View style={styles.aboutRow} key={key}>
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
      return <View key={key} />; // Return null for fields with null or undefined values
    });
  };

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
    !(Number(product?.item_details?.quantity?.available?.count) >= 1) ||
    itemOutOfStock ||
    addToCartLoading;

  return (
    <ScrollView style={styles.container}>
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
        <StockAvailability
          available={
            Number(product?.item_details?.quantity?.available?.count) >= 1
          }
        />
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
                    addToCart(false, false).then(() => {});
                  }
                }}>
                <Icon name={'minus'} color={theme.colors.primary} />
              </TouchableOpacity>
              <Text>
                {addToCartLoading ? (
                  <ActivityIndicator size={16} color={theme.colors.primary} />
                ) : (
                  itemAvailableInCart.item.quantity.count
                )}
              </Text>
              <TouchableOpacity
                style={styles.incrementButton}
                onPress={() => addToCart(false, true)}>
                <Icon name={'plus'} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                disableActionButtons
                  ? globalStyles.disabledOutlineButton
                  : globalStyles.outlineButton,
                styles.addToCartButton,
              ]}
              onPress={() => addToCart(false, true)}
              disabled={disableActionButtons}>
              {addToCartLoading ? (
                <ActivityIndicator
                  size={'small'}
                  color={theme.colors.primary}
                />
              ) : (
                <Text
                  variant={'bodyMedium'}
                  style={
                    disableActionButtons
                      ? globalStyles.disabledOutlineButtonText
                      : globalStyles.outlineButtonText
                  }>
                  Add to cart
                </Text>
              )}
            </TouchableOpacity>
          )}
          <View style={styles.buttonSeparator} />
          <TouchableOpacity
            style={[
              disableActionButtons
                ? globalStyles.disabledContainedButton
                : globalStyles.containedButton,
              styles.orderNowButton,
            ]}
            disabled={disableActionButtons}
            onPress={() => addToCart(true)}>
            <Text
              variant={'bodyMedium'}
              style={
                disableActionButtons
                  ? globalStyles.disabledContainedButtonText
                  : globalStyles.containedButtonText
              }>
              Order now
            </Text>
          </TouchableOpacity>
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
              <View style={styles.aboutRow} key={key}>
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
    addToCartButton: {
      flex: 1,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 36,
    },
    orderNowButton: {
      flex: 1,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 36,
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
    buttonGroup: {
      borderColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      borderWidth: 1,
      borderRadius: 8,
      height: 40,
      justifyContent: 'space-between',
    },
    incrementButton: {
      paddingHorizontal: 12,
    },
  });

export default ProductDetails;
