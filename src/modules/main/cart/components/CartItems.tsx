import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import RBSheet from 'react-native-raw-bottom-sheet';
import {API_BASE_URL, CART, ITEM_DETAILS} from '../../../../utils/apiActions';
import {
  getCustomizations,
  getPriceWithCustomisations,
} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import FBProductCustomization from '../../provider/components/FBProductCustomization';
import Customizations from '../../../../components/customization/Customizations';
import ManageQuantity from '../../../../components/customization/ManageQuantity';
import useUpdateSpecificItemCount from '../../../../hooks/useUpdateSpecificItemCount';
import useCustomizationStateHelper from '../../../../hooks/useCustomizationStateHelper';
import CustomizationFooterButtons from '../../provider/components/CustomizationFooterButtons';
import {CURRENCY_SYMBOLS, FB_DOMAIN} from '../../../../utils/constants';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';
import {useAppTheme} from '../../../../utils/theme';
import DeleteIcon from '../../../../assets/delete.svg';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import {updateCartItems} from '../../../../toolkit/reducer/cart';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';

interface CartItems {
  fullCartItems: any[];
  allowScroll?: boolean;
  providerWiseItems: any[];
  cartItems: any[];
  setCartItems: (items: any[]) => void;
  updateSpecificCartItems: (items: any[]) => void;
  haveDistinctProviders: boolean;
  isProductCategoryIsDifferent: boolean;
}

const CancelToken = axios.CancelToken;
const screenHeight: number = Dimensions.get('screen').height;
const NoImageAvailable = require('../../../../assets/noImage.png');

const CartItems: React.FC<CartItems> = ({
  fullCartItems,
  haveDistinctProviders,
  isProductCategoryIsDifferent,
  providerWiseItems,
  cartItems,
  setCartItems,
  updateSpecificCartItems,
}) => {
  const {formatNumber} = useFormatNumber();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {deleteDataWithAuth, getDataWithAuth, putDataWithAuth} =
    useNetworkHandling();
  const {customizationState, setCustomizationState, customizationPrices} =
    useCustomizationStateHelper();
  const {updatingCartItem, updateSpecificCartItem} =
    useUpdateSpecificItemCount();
  const dispatch = useDispatch();
  const {uid} = useSelector(({auth}) => auth);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const customizationSheet = useRef<any>(null);
  const source = useRef<any>(null);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [currentCartItem, setCurrentCartItem] = useState<any>(null);
  const [productPayload, setProductPayload] = useState<any>(null);
  const [requestedProduct, setRequestedProduct] = useState<any>(null);
  const [updatingProduct, setUpdatingProduct] = useState<boolean>(false);
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemOutOfStock, setItemOutOfStock] = useState<boolean>(false);
  const {handleApiError} = useNetworkErrorHandling();

  const getProductDetails = async (productId: any) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ITEM_DETAILS}?id=${productId}`,
        source.current.token,
      );
      setProductPayload(data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const updateCartItem = async (
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
      fullCartItems,
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
      updateSpecificCartItems(list);
      dispatch(updateCartItems(list));
    } catch (error) {
    } finally {
      setItemToDelete(null);
    }
  };

  const handleCustomiseClick = async (cartItem: any) => {
    try {
      setRequestedProduct(cartItem._id);
      setCustomizationState(cartItem.item.customisationState);
      await getProductDetails(cartItem.item.id);
      setCurrentCartItem(cartItem);
      setItemQty(cartItem?.item?.quantity?.count);
      showCustomization();
    } catch (e) {
    } finally {
      setRequestedProduct(null);
    }
  };

  const handleEditClick = (cartItem: any) => {
    navigation.navigate('ProductDetails', {productId: cartItem.item.id});
  };

  const showCustomization = () => {
    customizationSheet.current.open();
  };

  const hideCustomization = () => customizationSheet.current.close();

  const updateCustomizations = async () => {
    try {
      setUpdatingProduct(true);
      const url = `${API_BASE_URL}${CART}/${uid}/${currentCartItem._id}`;

      let customisations = await getCustomizations(
        productPayload,
        customizationState,
      );

      const subtotal =
        productPayload?.item_details?.price?.value + customizationPrices;

      const payload: any = {
        id: productPayload.id,
        local_id: productPayload.local_id,
        bpp_id: productPayload.bpp_details.bpp_id,
        bpp_uri: productPayload.context.bpp_uri,
        contextCity: productPayload.context.city,
        domain: productPayload.context.domain,
        tags: productPayload.item_details.tags,
        customisationState: customizationState,
        quantity: {
          count: itemQty,
        },
        provider: {
          id: productPayload.bpp_details.bpp_id,
          locations: productPayload.locations,
          ...productPayload.provider_details,
        },
        location_details: productPayload.location_details,
        product: {
          id: productPayload.id,
          subtotal,
          ...productPayload.item_details,
        },
        customisations,
        hasCustomisations: true,
      };

      const items = cartItems.concat([]);
      const itemIndex = items.findIndex(
        item => item._id === currentCartItem._id,
      );
      if (itemIndex !== -1) {
        source.current = CancelToken.source();
        await putDataWithAuth(url, payload, source.current.token);
        hideCustomization();

        items[itemIndex] = {...items[itemIndex], item: payload};
        updateSpecificCartItems(items);
      }
      hideCustomization();
    } catch (e) {
      console.log(e);
    } finally {
      setUpdatingProduct(false);
    }
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
        {providerWiseItems?.map((provider: any) => (
          <View key={provider.provider.id} style={styles.provider}>
            <View style={styles.providerHeader}>
              <FastImage
                source={{uri: provider?.provider?.descriptor?.symbol}}
                style={styles.providerImage}
              />
              <View style={styles.providerMeta}>
                <Text variant={'titleLarge'} style={styles.providerName}>
                  {provider?.provider?.descriptor?.name}
                </Text>
                {provider?.provider?.locations?.length > 0 && (
                  <Text variant={'labelSmall'} style={styles.providerAddress}>
                    {provider.items[0]?.item?.location_details?.address
                      ?.locality || 'NA'}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.productsContainer}>
              {provider?.items?.map((cartItem: any, itemIndex: number) => {
                let imageSource = NoImageAvailable;
                if (cartItem?.item?.product?.descriptor?.symbol) {
                  imageSource = {
                    uri: cartItem?.item?.product?.descriptor?.symbol,
                  };
                } else if (
                  cartItem?.item?.product?.descriptor?.images?.length > 0
                ) {
                  imageSource = {
                    uri: cartItem?.item?.product?.descriptor?.images[0],
                  };
                }

                return (
                  <View key={cartItem._id}>
                    <View style={styles.product}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProductDetails', {
                            productId: cartItem.item.id,
                          })
                        }>
                        <FastImage
                          source={imageSource}
                          style={styles.productImage}
                        />
                      </TouchableOpacity>
                      <View style={styles.productMeta}>
                        <Text variant={'bodyMedium'} style={styles.productName}>
                          {cartItem?.item?.product?.descriptor?.name}
                        </Text>
                        <Customizations cartItem={cartItem} />
                        {!cartItem.item.hasCustomisations &&
                          cartItem.item.product?.quantity?.unitized &&
                          Object.keys(
                            cartItem.item.product?.quantity?.unitized,
                          ).map(one => (
                            <Text
                              variant={'labelSmall'}
                              key={
                                cartItem.item.product?.quantity?.unitized[one]
                                  .value
                              }>
                              {
                                cartItem.item.product?.quantity?.unitized[one]
                                  .value
                              }{' '}
                              {
                                cartItem.item.product?.quantity?.unitized[one]
                                  .unit
                              }
                            </Text>
                          ))}
                        <View style={styles.quantityContainer}>
                          <ManageQuantity
                            allowDelete
                            cartItem={cartItem}
                            updatingCartItem={updatingCartItem}
                            updateCartItem={updateCartItem}
                            deleteCartItem={deleteCartItem}
                          />
                        </View>
                        <Text variant="bodyLarge">
                          ₹
                          {cartItem.item.hasCustomisations
                            ? formatNumber(
                                Number(
                                  (
                                    getPriceWithCustomisations(cartItem) *
                                    Number(cartItem?.item?.quantity?.count)
                                  ).toFixed(2),
                                ),
                              )
                            : formatNumber(
                                Number(
                                  (
                                    cartItem?.item?.product?.subtotal *
                                    Number(cartItem?.item?.quantity?.count)
                                  ).toFixed(2),
                                ),
                              )}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.productActionContainer}>
                      {cartItem.item.domain === FB_DOMAIN ? (
                        cartItem.item.hasCustomisations ? (
                          <TouchableOpacity
                            disabled={!!requestedProduct}
                            style={styles.customiseContainer}
                            onPress={() => handleCustomiseClick(cartItem)}>
                            {cartItem._id === requestedProduct ? (
                              <ActivityIndicator
                                color={theme.colors.primary}
                                size={14}
                              />
                            ) : (
                              <Icon
                                name={'pencil'}
                                color={theme.colors.primary}
                                size={14}
                              />
                            )}
                            <Text
                              variant={'labelLarge'}
                              style={styles.customiseText}>
                              {t('Cart.Customise')}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View />
                        )
                      ) : (
                        <TouchableOpacity
                          disabled={!!requestedProduct}
                          style={styles.customiseContainer}
                          onPress={() => handleEditClick(cartItem)}>
                          <Icon
                            name={'pencil'}
                            color={theme.colors.primary}
                            size={14}
                          />
                          <Text
                            variant={'labelLarge'}
                            style={styles.customiseText}>
                            {t('Cart.Edit')}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <View>
                        {itemToDelete === cartItem._id ? (
                          <ActivityIndicator
                            size={20}
                            color={theme.colors.primary}
                          />
                        ) : (
                          <TouchableOpacity
                            onPress={() => deleteCartItem(cartItem._id)}>
                            <DeleteIcon width={20} height={20} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    {cartItem.item.quantity.count >
                      cartItem.item.product.quantity.available.count && (
                      <View style={styles.infoBox}>
                        <Text variant={'bodyMedium'} style={styles.infoText}>
                          {t('Cart Items.Only Available Of Total', {
                            quantity:
                              cartItem.item.product.quantity.available.count,
                            total: cartItem.item.quantity.count,
                          })}
                        </Text>
                      </View>
                    )}
                    {itemIndex !== provider?.items.length - 1 && (
                      <View style={styles.providerBorderBottom} />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
        {haveDistinctProviders && (
          <View style={styles.errorBox}>
            <Text variant={'bodyMedium'} style={styles.errorText}>
              {t(
                'Cart Items.You are ordering from different store. Please check your order again',
              )}
            </Text>
          </View>
        )}
        {isProductCategoryIsDifferent && (
          <View style={styles.errorBox}>
            <Text variant={'bodyMedium'} style={styles.errorText}>
              {t(
                'Cart Items.You are ordering from different category. Please check your order again',
              )}
            </Text>
          </View>
        )}
      </ScrollView>

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
                source={{uri: productPayload?.item_details?.descriptor?.symbol}}
                style={styles.sheetProductSymbol}
              />
              <View style={styles.titleContainer}>
                <Text variant={'titleSmall'} style={styles.title}>
                  {productPayload?.item_details?.descriptor?.name}
                </Text>
                <Text variant={'labelMedium'} style={styles.prize}>
                  {
                    CURRENCY_SYMBOLS[
                      productPayload?.item_details?.price?.currency
                    ]
                  }
                  {formatNumber(productPayload?.item_details?.price?.value)}
                </Text>
              </View>
            </View>
            {currentCartItem?.item?.provider?.locations?.length > 0 && (
              <Text variant={'labelMedium'} style={styles.address}>
                {currentCartItem?.item?.provider?.locations[0]?.address
                  ?.street || '-'}
                ,{' '}
                {currentCartItem?.item?.provider?.locations[0]?.address?.city ||
                  '-'}
              </Text>
            )}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.customizationContainer}>
              <FBProductCustomization
                isEditFlow
                product={productPayload}
                customizationState={customizationState}
                setCustomizationState={setCustomizationState}
                setItemOutOfStock={setItemOutOfStock}
              />
            </ScrollView>

            <CustomizationFooterButtons
              update
              productLoading={updatingProduct}
              itemQty={itemQty}
              setItemQty={setItemQty}
              itemOutOfStock={itemOutOfStock}
              addDetailsToCart={updateCustomizations}
              product={productPayload}
              customizationPrices={customizationPrices}
            />
          </View>
        </CloseSheetContainer>
      </RBSheet>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 24,
    },
    scrollViewContent: {
      paddingBottom: 24,
    },
    providerBorderBottom: {
      borderBottomColor: colors.neutral100,
      borderBottomWidth: 1,
      paddingTop: 16,
      marginBottom: 16,
    },
    provider: {
      backgroundColor: colors.white,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 12,
    },
    providerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerMeta: {
      flex: 1,
    },
    productsContainer: {
      paddingVertical: 16,
    },
    providerImage: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    providerName: {
      color: colors.neutral400,
    },
    providerAddress: {
      marginBottom: 10,
      color: colors.neutral300,
    },
    product: {
      flexDirection: 'row',
    },
    productActionContainer: {
      marginTop: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    productImage: {
      width: 80,
      height: 100,
      borderRadius: 12,
    },
    productMeta: {
      flex: 1,
      marginLeft: 12,
    },
    productName: {
      color: colors.neutral400,
    },
    quantityContainer: {
      marginVertical: 10,
    },
    customiseContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    customiseText: {
      color: colors.primary,
      marginLeft: 4,
    },
    infoBox: {
      backgroundColor: 'rgba(249, 197, 28, 0.17)',
      borderRadius: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 20,
    },
    infoText: {
      color: colors.warning,
    },
    errorBox: {
      backgroundColor: colors.error50,
      borderRadius: 8,
      padding: 8,
      marginTop: 12,
      marginHorizontal: 16,
    },
    errorText: {
      color: colors.error600,
    },
    divider: {
      marginVertical: 20,
      width: '100%',
      height: 1,
      backgroundColor: colors.neutral100,
    },
    customizationContainer: {
      padding: 16,
      backgroundColor: colors.neutral50,
    },
    rbSheet: {backgroundColor: 'rgba(47, 47, 47, 0.75)'},
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
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
    sheetProductSymbol: {
      width: 36,
      height: 36,
    },
    prize: {
      color: colors.primary,
    },
    address: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    sheetContainer: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      backgroundColor: colors.white,
      height: screenHeight - 130,
    },
  });

export default CartItems;
