import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import 'moment-duration-format';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../../../../utils/theme';
import DeleteWishlist from '../../../../assets/delete_wishlist.svg';
import RBSheet from 'react-native-raw-bottom-sheet';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';
import FBProductDetails from '../../product/details/FBProductDetails';
import FBProductCustomization from '../../provider/components/FBProductCustomization';
import useCustomizationStateHelper from '../../../../hooks/useCustomizationStateHelper';
import CustomizationFooterButtons from '../../provider/components/CustomizationFooterButtons';
import {API_BASE_URL, CART, WISHLIST} from '../../../../utils/apiActions';
import {useSelector} from 'react-redux';
import axios from 'axios';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {
  areCustomisationsSame,
  getCustomizations,
  showToastWithGravity,
} from '../../../../utils/utils';
import userUpdateCartItem from '../../../../hooks/userUpdateCartItem';
import useCartItems from '../../../../hooks/useCartItems';

interface WishlistItem {
  item: any;
  deleteWishlist: (values: any) => void;
}
const NoImageAvailable = require('../../../../assets/noImage.png');
const screenHeight: number = Dimensions.get('screen').height;
const CancelToken = axios.CancelToken;

const WishlistItem: React.FC<WishlistItem> = ({item, deleteWishlist}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {uid} = useSelector(({auth}) => auth);
  const {cartItems} = useSelector(({cart}) => cart);
  const customizationSheet = useRef<any>(null);
  const source = useRef<any>(null);
  const {deleteDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const {updateCartItem} = userUpdateCartItem();

  const [locality, setLocality] = useState<string>('');
  const [productDetails, setProductDetails] = useState<any>(null);
  const [inStock, setInStock] = useState<any>(null);
  const [itemQty, setItemQty] = useState<number>(1);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [itemOutOfStock, setItemOutOfStock] = useState<boolean>(false);
  const [itemsData, setItemsData] = useState<any>(item?.items);

  const productDetailsSheet = useRef<any>(null);
  const {customizationState, setCustomizationState, customizationPrices} =
    useCustomizationStateHelper();
  const {getCartItems} = useCartItems();

  const hideProductDetails = () => productDetailsSheet.current.close();
  const showProductDetails = (item: any) => {
    setProductDetails(item);
    setInStock(Number(item?.item_details?.quantity?.available?.count) >= 1);
    productDetailsSheet.current.open();
  };

  const deleteWishlistItem = async (itemData: any) => {
    try {
      source.current = CancelToken.source();
      await deleteDataWithAuth(
        `${API_BASE_URL}${WISHLIST}/${uid}/${itemData?._id}`,
        source.current.token,
      );
      const list = itemsData.filter((item: any) => item._id !== itemData?._id);

      if (list.length > 0) {
        setItemsData(list);
      } else {
        deleteWishlist(item?._id);
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (item) {
      let itemsLocality = '';

      item?.items.forEach((one: any, ind: number) => {
        itemsLocality = one.location_details?.address?.locality;
      });
      setLocality(itemsLocality);
    }
  }, [item]);

  // const showCustomization = () => {
  //   setTimeout(() => {
  //     customizationSheet.current.open();
  //   }, 200);
  // };

  const hideCustomization = () => customizationSheet.current.close();

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
        (cart: any) => cart.location_id === productDetails.location_details.id,
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
      await deleteWishlistItem(productDetails);
      hideProductDetails();
    } catch (error) {
      console.log(error);
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.mainItemView}>
        {/* header */}
        <View style={styles.itemHeader}>
          <FastImage
            source={{
              uri: item?.items[0]?.provider_details?.descriptor?.symbol,
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <View style={styles.titleView}>
              <Text variant="titleLarge" style={styles.title} numberOfLines={1}>
                {item?.location?.provider_descriptor?.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => deleteWishlist(item?._id)}>
                <MaterialCommunityIcons
                  name={'close-circle-outline'}
                  size={24}
                  color={theme.colors.neutral400}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.providerLocalityView}>
              <Text
                variant={'labelSmall'}
                style={styles.providerLocality}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {locality}
              </Text>
            </View>
          </View>
        </View>

        {/* line */}
        <View style={styles.line} />

        {/* items */}
        <ScrollView
          contentContainerStyle={styles.itemMainView}
          showsHorizontalScrollIndicator={false}>
          {itemsData.map((one: any, index: number) => {
            let imageSource = NoImageAvailable;
            if (one?.item_details?.descriptor?.symbol) {
              imageSource = {uri: one?.item_details?.descriptor?.symbol};
            } else if (one?.item_details?.descriptor?.images?.length > 0) {
              imageSource = {uri: one?.item_details?.descriptor?.images[0]};
            }
            return (
              <View style={styles.itemSubView}>
                <View style={styles.itemView}>
                  <FastImage source={imageSource} style={styles.itemImage} />
                  <View style={styles.itemTextView}>
                    <Text
                      variant="labelLarge"
                      style={styles.neutral400}
                      numberOfLines={1}>
                      {one?.item_details?.descriptor?.name}
                    </Text>
                    <Text variant="labelLarge" style={styles.neutral400}>
                      ₹{one?.item_details?.price?.value}
                    </Text>
                  </View>
                </View>
                <View style={styles.iconView}>
                  <TouchableOpacity onPress={() => deleteWishlistItem(one)}>
                    <DeleteWishlist
                      height={18}
                      width={16}
                      color={theme.colors.error600}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => showProductDetails(one)}>
                    <MaterialCommunityIcons
                      name={'cart-plus'}
                      size={24}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
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
            {/* <View style={styles.header}>
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
            /> */}
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
                product={productDetails}
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
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    mainItemView: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.neutral100,
      padding: 12,
      gap: 16,
    },
    itemHeader: {
      flexDirection: 'row',
      gap: 12,
    },
    headerImage: {
      height: 48,
      width: 48,
      borderRadius: 8,
    },
    headerText: {
      flex: 1,
      height: 42,
      justifyContent: 'space-between',
    },
    line: {height: 1, backgroundColor: colors.neutral100},
    titleView: {
      flexDirection: 'row',
      gap: 16,
    },
    title: {
      flex: 1,
      color: colors.neutral400,
    },
    providerLocalityView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerLocality: {
      color: colors.neutral300,
      flexShrink: 1,
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemMainView: {
      gap: 16,
    },
    itemSubView: {flex: 1, flexDirection: 'row', gap: 32},
    itemView: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    itemTextView: {
      flex: 1,
      gap: 8,
    },
    itemImage: {
      height: 68,
      width: 68,
      borderRadius: 8,
    },
    neutral400: {
      color: colors.neutral400,
    },
    iconView: {
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
    },
    rbSheet: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
    sheetContainer: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      backgroundColor: colors.neutral50,
      flex: 1,
    },
    productDetails: {
      height: screenHeight - 200,
    },
    outOfStockContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 10,
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

export default WishlistItem;
