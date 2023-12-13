import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import {IconButton, Modal, Portal, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {API_BASE_URL} from '../../../../utils/apiActions';
import {
  getPriceWithCustomisations,
  showToastWithGravity,
} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';

interface CartItems {
  allowScroll?: boolean;
  cartItems: any[];
  setCartItems: (items: any[]) => void;
  haveDistinctProviders: boolean;
  isProductCategoryIsDifferent: boolean;
}

const CancelToken = axios.CancelToken;

const CartItems: React.FC<CartItems> = ({
  allowScroll = true,
  haveDistinctProviders,
  isProductCategoryIsDifferent,
  cartItems,
  setCartItems,
}) => {
  const {deleteDataWithAuth, getDataWithAuth, putDataWithAuth} =
    useNetworkHandling();
  const source = useRef<any>(null);
  const {uid} = useSelector(({authReducer}) => authReducer);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [updatingCartItem, setUpdatingCartItem] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [currentCartItem, setCurrentCartItem] = useState<any>(null);
  const [productPayload, setProductPayload] = useState<any>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [customizationState, setCustomizationState] = useState<any>({});

  const getProductDetails = async (productId: any) => {
    try {
      setProductLoading(true);
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}/protocol/item-details?id=${productId}`,
        source.current.token,
      );
      setProductPayload(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setProductLoading(false);
    }
  };

  const getCustomizations = (cartItem: any) => {
    if (cartItem.item.customisations) {
      const customisations = cartItem.item.customisations;

      return (
        <Text variant={'labelSmall'}>
          {customisations.map((customization: any, index: number) => {
            const isLastItem = index === customisations.length - 1;
            return `${customization.item_details.descriptor.name} (₹${
              customization.item_details.price.value
            })${isLastItem ? '' : ' + '}`;
          })}
        </Text>
      );
    }

    return <></>;
  };

  const updateCartItem = async (
    itemId: any,
    increment: boolean,
    uniqueId: any,
  ) => {
    try {
      setUpdatingCartItem(itemId);
      const url = `${API_BASE_URL}/clientApis/v2/cart/${uid}/${uniqueId}`;
      const items = cartItems.concat([]);
      const itemIndex = items.findIndex((item: any) => item._id === uniqueId);
      if (itemIndex !== -1) {
        source.current = CancelToken.source();
        let updatedCartItem = items[itemIndex];
        updatedCartItem.id = updatedCartItem.item.id;

        if (increment) {
          const productMaxQuantity =
            updatedCartItem?.item?.product?.quantity?.maximum;
          if (productMaxQuantity) {
            if (
              updatedCartItem.item.quantity.count < productMaxQuantity.count
            ) {
              updatedCartItem.item.quantity.count += 1;

              let customisations = updatedCartItem.item.customisations;

              if (customisations) {
                customisations = customisations.map((customisation: any) => {
                  return {
                    ...customisation,
                    quantity: {
                      ...customisation.quantity,
                      count: customisation.quantity.count + 1,
                    },
                  };
                });

                updatedCartItem.item.customisations = customisations;
              } else {
                updatedCartItem.item.customisations = null;
              }

              updatedCartItem = updatedCartItem.item;

              await putDataWithAuth(url, updatedCartItem, source.current.token);
            } else {
              showToastWithGravity(
                `Maximum allowed quantity is ${updatedCartItem.item.quantity.count}`,
              );
            }
          } else {
            updatedCartItem.item.quantity.count += 1;
            updatedCartItem = updatedCartItem.item;
            await putDataWithAuth(url, updatedCartItem, source.current.token);
          }
        } else {
          if (updatedCartItem.item.quantity.count > 1) {
            updatedCartItem.item.quantity.count -= 1;

            let customisations = updatedCartItem.item.customisations;

            if (customisations) {
              customisations = customisations.map((customisation: any) => {
                return {
                  ...customisation,
                  quantity: {
                    ...customisation.quantity,
                    count: customisation.quantity.count - 1,
                  },
                };
              });
              updatedCartItem.item.customisations = customisations;
            } else {
              updatedCartItem.item.customisations = null;
            }

            updatedCartItem = updatedCartItem.item;
            await putDataWithAuth(url, updatedCartItem, source.current.token);
          }
        }
        setCartItems(items);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUpdatingCartItem(null);
    }
  };

  const deleteCartItem = async (itemId: any) => {
    try {
      setItemToDelete(itemId);
      const url = `${API_BASE_URL}/clientApis/v2/cart/${uid}/${itemId}`;
      source.current = CancelToken.source();
      await deleteDataWithAuth(url, source.current.token);
      setCartItems(cartItems.filter((item: any) => item._id !== itemId));
    } catch (error) {
    } finally {
      setItemToDelete(null);
    }
  };

  const renderItems = () => {
    return cartItems?.map((cartItem: any, index: number) => (
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
            {/*{renderVegNonVegTag(cartItem)}*/}
          </TouchableOpacity>
          <View style={styles.productMeta}>
            <Text variant={'bodyMedium'}>
              {cartItem?.item?.product?.descriptor?.name}
            </Text>
            {getCustomizations(cartItem)}
            {cartItem.item.hasCustomisations && (
              <TouchableOpacity
                style={styles.customiseContainer}
                onPress={() => {
                  setCustomizationState(cartItem.item.customisationState);
                  getProductDetails(cartItem.item.id).then(() => {});
                  setCurrentCartItem(cartItem);
                  setOpenDrawer(true);
                }}>
                <Icon name={'pencil'} color={theme.colors.primary} size={14} />
                <Text variant={'labelMedium'} style={styles.customiseText}>
                  Customise
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              disabled={!!updatingCartItem}
              style={styles.incrementButton}
              onPress={() =>
                updateCartItem(cartItem.item.id, false, cartItem._id)
              }>
              <Icon name={'minus'} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text variant={'bodyMedium'} style={styles.quantity}>
              {updatingCartItem ? (
                <ActivityIndicator color={theme.colors.primary} size={14} />
              ) : (
                cartItem?.item?.quantity?.count
              )}
            </Text>
            <TouchableOpacity
              disabled={!!updatingCartItem}
              style={styles.incrementButton}
              onPress={() =>
                updateCartItem(cartItem.item.id, true, cartItem._id)
              }>
              <Icon name={'plus'} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View>
            <Text variant="titleSmall">
              {cartItem.item.hasCustomisations
                ? `₹ ${
                    Number(getPriceWithCustomisations(cartItem)) *
                    Number(cartItem?.item?.quantity?.count)
                  }`
                : `₹ ${Number(cartItem?.item?.product?.subtotal)}`}
            </Text>
            {itemToDelete === cartItem._id ? (
              <ActivityIndicator size={20} color={theme.colors.primary} />
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
              Only {cartItem.item.product.quantity.available.count} available
              instead of {cartItem.item.quantity.count}. Update the quantity or
              switch to another provider.
            </Text>
          </View>
        )}
        {index === cartItems.length - 1 ? (
          <>
            {haveDistinctProviders && (
              <View style={styles.errorBox}>
                <Text variant={'bodyMedium'} style={styles.errorText}>
                  You are ordering from different store. Please check your order
                  again.
                </Text>
              </View>
            )}
            {isProductCategoryIsDifferent && (
              <View style={styles.errorBox}>
                <Text variant={'bodyMedium'} style={styles.errorText}>
                  You are ordering from different category. Please check your
                  order again.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.divider} />
        )}
      </View>
    ));
  };

  return (
    <>
      {allowScroll ? (
        <ScrollView style={styles.container}>{renderItems()}</ScrollView>
      ) : (
        renderItems()
      )}

      <Portal>
        <Modal
          visible={openDrawer}
          onDismiss={() => {
            setProductPayload(null);
            setCustomizationState({});
            setOpenDrawer(false);
          }}>
          {/*<EditCustomizations*/}
          {/*  cartItems={cartItems}*/}
          {/*  productPayload={productPayload}*/}
          {/*  setProductPayload={setProductPayload}*/}
          {/*  customization_state={customization_state}*/}
          {/*  setCustomizationState={setCustomizationState}*/}
          {/*  setOpenDrawer={setOpenDrawer}*/}
          {/*  currentCartItem={currentCartItem}*/}
          {/*/>*/}
        </Modal>
      </Portal>
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
    quantityContainer: {
      borderRadius: 6,
      borderColor: '#E8E8E8',
      borderWidth: 1,
      backgroundColor: '#FFF',
      flexDirection: 'row',
      height: 26,
      alignItems: 'center',
      marginRight: 18,
      width: 54,
    },
    quantity: {
      flex: 1,
      alignItems: 'center',
      textAlign: 'center',
    },
    incrementButton: {
      paddingHorizontal: 4,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoBox: {
      backgroundColor: 'rgba(249, 197, 28, 0.17)',
      borderRadius: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 20,
    },
    infoText: {
      color: '#C89A04',
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
  });

export default CartItems;
