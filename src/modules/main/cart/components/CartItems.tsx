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
import {IconButton, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import RBSheet from 'react-native-raw-bottom-sheet';
import {API_BASE_URL, CART} from '../../../../utils/apiActions';
import {
  getCustomizations,
  getPriceWithCustomisations,
} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import FBProductCustomization from '../../provider/components/FBProductCustomization';
import {updateCartItems} from '../../../../redux/cart/actions';
import Customizations from '../../../../components/customization/Customizations';
import ManageQuantity from '../../../../components/customization/ManageQuantity';
import useUpdateSpecificItemCount from '../../../../hooks/useUpdateSpecificItemCount';
import useCustomizationStateHelper from '../../../../hooks/useCustomizationStateHelper';
import CustomizationFooterButtons from '../../provider/components/CustomizationFooterButtons';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';

interface CartItems {
  allowScroll?: boolean;
  providerWiseItems: any[];
  cartItems: any[];
  setCartItems: (items: any[]) => void;
  haveDistinctProviders: boolean;
  isProductCategoryIsDifferent: boolean;
}

const CancelToken = axios.CancelToken;
const screenHeight: number = Dimensions.get('screen').height;

const CartItems: React.FC<CartItems> = ({
  haveDistinctProviders,
  isProductCategoryIsDifferent,
  providerWiseItems,
  cartItems,
  setCartItems,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {deleteDataWithAuth, getDataWithAuth, putDataWithAuth} =
    useNetworkHandling();
  const {customizationState, setCustomizationState, customizationPrices} =
    useCustomizationStateHelper();
  const {updatingCartItem, updateSpecificCartItem} =
    useUpdateSpecificItemCount();
  const dispatch = useDispatch();
  const {uid} = useSelector(({authReducer}) => authReducer);
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

  const getProductDetails = async (productId: any) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}/protocol/item-details?id=${productId}`,
        source.current.token,
      );
      setProductPayload(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const updateCartItem = async (
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
      setCartItems(list);
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

  const showCustomization = () => {
    customizationSheet.current.open();
  };

  const hideCustomization = () => customizationSheet.current.close();

  const updateCustomizations = async () => {
    try {
      setUpdatingProduct(true);
      const url = `${API_BASE_URL}${CART}/${uid}/${currentCartItem._id}`;
      const items = cartItems.concat([]);
      const itemIndex = items.findIndex(
        item => item._id === currentCartItem._id,
      );
      if (itemIndex !== -1) {
        let updatedCartItem = items[itemIndex];
        const updatedCustomizations = await getCustomizations(
          productPayload,
          customizationState,
        );
        updatedCartItem.id = updatedCartItem.item.id;
        updatedCartItem.item.customisations = updatedCustomizations;
        updatedCartItem = updatedCartItem.item;
        updatedCartItem.customisationState = customizationState;
        updatedCartItem.quantity.count = itemQty;
        source.current = CancelToken.source();
        await putDataWithAuth(url, updatedCartItem, source.current.token);
        hideCustomization();
        setCartItems(items);
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
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
        {providerWiseItems?.map((provider: any, providerIndex: number) => (
          <View key={provider.provider.id}>
            <Text variant={'labelLarge'} style={styles.providerName}>
              {provider?.provider?.descriptor?.name}
            </Text>
            {provider?.provider?.locations?.length > 0 && (
              <Text variant={'labelMedium'} style={styles.providerAddress}>
                {provider?.provider?.locations[0]?.address?.street || '-'},{' '}
                {provider?.provider?.locations[0]?.address?.city || '-'}
              </Text>
            )}
            {provider?.items?.map((cartItem: any, index: number) => (
              <View key={cartItem._id}>
                <View style={styles.product}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProductDetails', {
                        productId: cartItem.item.id,
                      })
                    }>
                    <FastImage
                      source={{
                        uri: cartItem?.item?.product?.descriptor?.symbol,
                      }}
                      style={styles.productImage}
                    />
                  </TouchableOpacity>
                  <View style={styles.productMeta}>
                    <Text variant={'bodyMedium'}>
                      {cartItem?.item?.product?.descriptor?.name}
                    </Text>
                    <Customizations cartItem={cartItem} />
                    {cartItem.item.hasCustomisations && (
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
                            name={'pencil-outline'}
                            color={theme.colors.primary}
                            size={14}
                          />
                        )}
                        <Text
                          variant={'labelMedium'}
                          style={styles.customiseText}>
                          Customise
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <ManageQuantity
                    allowDelete
                    cartItem={cartItem}
                    updatingCartItem={updatingCartItem}
                    updateCartItem={updateCartItem}
                    deleteCartItem={deleteCartItem}
                  />

                  <View>
                    <Text variant="titleSmall">
                      ₹{' '}
                      {cartItem.item.hasCustomisations
                        ? Number(getPriceWithCustomisations(cartItem)) *
                          Number(cartItem?.item?.quantity?.count)
                        : Number(cartItem?.item?.product?.subtotal)}
                    </Text>
                    {itemToDelete === cartItem._id ? (
                      <ActivityIndicator
                        size={20}
                        color={theme.colors.primary}
                      />
                    ) : (
                      <IconButton
                        icon={'delete'}
                        iconColor={'#D83132'}
                        onPress={() => deleteCartItem(cartItem._id)}
                      />
                    )}
                  </View>
                </View>
                {cartItem.item.quantity.count >
                  cartItem.item.product.quantity.available.count && (
                  <View style={styles.infoBox}>
                    <Text variant={'bodyMedium'} style={styles.infoText}>
                      Only {cartItem.item.product.quantity.available.count}{' '}
                      available instead of {cartItem.item.quantity.count}.
                      Update the quantity or switch to another provider.
                    </Text>
                  </View>
                )}
                {index === provider?.items.length - 1 ? (
                  <>
                    {haveDistinctProviders && (
                      <View style={styles.errorBox}>
                        <Text variant={'bodyMedium'} style={styles.errorText}>
                          You are ordering from different store. Please check
                          your order again.
                        </Text>
                      </View>
                    )}
                    {isProductCategoryIsDifferent && (
                      <View style={styles.errorBox}>
                        <Text variant={'bodyMedium'} style={styles.errorText}>
                          You are ordering from different category. Please check
                          your order again.
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
            {providerIndex !== providerWiseItems.length - 1 && (
              <View style={styles.providerBorderBottom} />
            )}
          </View>
        ))}
      </ScrollView>

      <RBSheet
        ref={customizationSheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
          wrapper: styles.wrapper,
        }}>
        <View style={styles.closeSheet}>
          <TouchableOpacity onPress={hideCustomization}>
            <Icon name={'close-circle'} color={theme.colors.error} size={32} />
          </TouchableOpacity>
        </View>
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
                {productPayload?.item_details?.price?.value}
              </Text>
            </View>
          </View>
          {currentCartItem?.item?.provider?.locations?.length > 0 && (
            <Text variant={'labelMedium'} style={styles.address}>
              {currentCartItem?.item?.provider?.locations[0]?.address?.street ||
                '-'}
              ,{' '}
              {currentCartItem?.item?.provider?.locations[0]?.address?.city ||
                '-'}
            </Text>
          )}
          <ScrollView style={styles.customizationContainer}>
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
      </RBSheet>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
    scrollViewContent: {
      paddingBottom: 24,
    },
    providerBorderBottom: {
      borderBottomColor: '#ababab',
      borderBottomWidth: 1,
      paddingTop: 10,
      marginBottom: 10,
    },
    providerName: {
      marginBottom: 4,
    },
    providerAddress: {
      marginBottom: 10,
    },
    product: {
      flexDirection: 'row',
    },
    productImage: {
      width: 48,
      height: 48,
      borderRadius: 5,
      borderColor: '#E8E8E8',
      backgroundColor: '#E8E8E8',
    },
    productMeta: {
      flex: 1,
      marginRight: 18,
      marginLeft: 12,
    },
    customiseContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
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
      backgroundColor: '#FFEBEB',
      borderRadius: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 20,
    },
    errorText: {
      color: '#D83232',
    },
    divider: {
      marginVertical: 20,
      width: '100%',
      height: 1,
      backgroundColor: '#CACDD8',
    },
    customizationButtons: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    customizationButton: {
      flex: 1,
    },
    separator: {
      width: 16,
    },
    customizationContainer: {
      padding: 16,
      backgroundColor: '#FAFAFA',
    },
    rbSheet: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
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
      color: '#1A1A1A',
      flexShrink: 1,
    },
    sheetProductSymbol: {
      width: 36,
      height: 36,
    },
    draggableIcon: {
      backgroundColor: '#000',
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
      backgroundColor: '#FFF',
      height: screenHeight - 130,
    },
    closeSheet: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
      alignItems: 'center',
      paddingBottom: 8,
      paddingTop: 20,
    },
    wrapper: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
  });

export default CartItems;
