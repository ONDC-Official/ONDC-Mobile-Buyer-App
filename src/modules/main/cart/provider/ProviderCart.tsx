import {
  Dimensions,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Text,
} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getPriceWithCustomisations,
  isItemCustomization,
  showToastWithGravity,
} from '../../../../utils/utils';
import CartItems from './components/CartItems';
import useSelectItems from '../../../../hooks/useSelectItems';
import EmptyCart from './components/EmptyCart';
import Fulfillment from './components/Fulfillment';
import AddressList from './components/AddressList';
import Payment from './components/Payment';
import useConfirmItems from '../../../../hooks/useConfirmItems';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';
import {useAppTheme} from '../../../../utils/theme';
import {MANUAL_LINK} from '../../../../utils/constants';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import {updateCartItems} from '../../../../toolkit/reducer/cart';
import ReferenceIcon from '../../../../assets/reference.svg';
import SafeAreaPage from '../../../../components/page/SafeAreaPage';
import Header from './components/Header';

const screenHeight: number = Dimensions.get('screen').height;

const ProviderCart = ({route: {params}}: any) => {
  const {formatNumber} = useFormatNumber();
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector((state: any) => state.address);
  const addressSheet = useRef<any>();
  const fulfillmentSheet = useRef<any>();
  const fulfillmentSheetShown = useRef<boolean>(false);
  const paymentSheet = useRef<any>();
  const [selectedFulfillmentList, setSelectedFulfillmentList] = useState<any[]>(
    [],
  );
  const [productsQuote, setProductsQuote] = useState<any>({
    providers: [],
    isError: false,
    total_payable: 0,
  });
  const [quoteItemProcessing, setQuoteItemProcessing] = useState<any>(null);
  const [cartTotal, setCartTotal] = useState<string>('0');
  const [providerWiseItems, setProviderWiseItems] = useState<any[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] =
    useState<boolean>(false);
  const cartData = useSelector(({cart}) => cart);

  useEffect(() => {
    if (cartData?.cartItems[params.index]?.items !== undefined) {
      setCartItems(cartData?.cartItems[params.index]?.items);
    }
  }, [cartData]);

  const openFulfillmentSheet = () => {
    fulfillmentSheet.current.open();
    fulfillmentSheetShown.current = true;
  };

  const closePaymentSheet = () => {
    setActivePaymentMethod('');
    paymentSheet.current.close();
  };

  const updateDetailCartItems = (items: any[]) => {
    dispatch(updateCartItems(items));
    setCartItems(items[params.index].items);
  };

  const updateSpecificCartItems = (items: any[]) => {
    setCartItems(items);
  };

  const {
    checkoutLoading,
    onCheckoutFromCart,
    haveDistinctProviders,
    isProductAvailableQuantityIsZero,
    isProductCategoryIsDifferent,
    selectedItems,
    cartItems,
    setCartItems,
    setSelectedItems,
    updateSelectedItemsForInit,
  } = useSelectItems(openFulfillmentSheet);

  const {
    confirmOrderLoading,
    deliveryAddress,
    setDeliveryAddress,
    activePaymentMethod,
    setActivePaymentMethod,
  } = useConfirmItems(closePaymentSheet);

  const showQuoteError = () => {
    let msg: string = quoteItemProcessing
      ? `Looks like Quote mapping for item: ${quoteItemProcessing} is invalid! Please check!`
      : 'Seems like issue with quote processing! Please confirm first if quote is valid!';
    showToastWithGravity(msg);
  };

  const showPaymentOption = () => {
    fulfillmentSheetShown.current = false;
    updateSelectedItemsForInit();
    fulfillmentSheet.current.close();
    setTimeout(() => {
      paymentSheet.current.open();
    }, 200);
  };

  const updateDeliveryAddress = (newAddress: any) => {
    setDeliveryAddress(newAddress);
    addressSheet.current.close();
  };

  const navigateToHome = () => {
    if (providerWiseItems?.length > 0) {
      const routeParams: any = {
        brandId: providerWiseItems[0]?.items[0]?.item?.provider?.id,
      };
      routeParams.outletId =
        providerWiseItems[0]?.items[0]?.item?.location_details?.id;
      navigation.navigate('BrandDetails', routeParams);
    }
  };

  const detectAddressNavigation = () => {
    addressSheet.current.close();
  };

  const hideConfirmModal = () => {
    setConfirmModalVisible(false);
  };

  const linkToManual = () => {
    Linking.openURL(MANUAL_LINK).then(() => {});
  };

  useEffect(() => {
    setDeliveryAddress(address);
  }, [address]);

  useEffect(() => {
    try {
      if (selectedItems.length > 0) {
        const cartList = selectedItems.concat([]);
        // check if any one order contains error
        let total_payable = 0;
        let isAnyError = false;
        let quotes = selectedItems?.map(singleItem => {
          let {message, error} = singleItem;
          let provider_payable = 0;
          const provider: any = {
            products: [],
            total_payable: 0,
            name: '',
            error: null,
          };
          if (message) {
            if (message?.quote?.quote?.price?.value) {
              provider_payable += Number(message?.quote?.quote?.price?.value);
            }
            const breakup = message?.quote?.quote?.breakup;
            const provided_by = message?.quote?.provider?.descriptor?.name;
            provider.name = provided_by;
            let uuid = 0;
            const allItems = breakup?.map((breakUpItem: any) => {
              const cartIndex = cartList?.findIndex(
                one => one.id === breakUpItem['@ondc/org/item_id'],
              );
              const cartItem = cartIndex > -1 ? cartList[cartIndex] : null;
              let findItemFromCartItems: any = null;
              let isCustomisation: boolean = false;
              if (breakUpItem?.item?.tags) {
                const findTag = breakUpItem?.item?.tags.find(
                  (tag: any) => tag.code === 'type',
                );
                if (findTag) {
                  const findCust = findTag.list.find(
                    (listItem: any) => listItem.value === 'customization',
                  );
                  if (findCust) {
                    isCustomisation = true;
                  }
                }
              }
              cartItems.forEach((item: any) => {
                if (isCustomisation) {
                  const customisations = item?.item?.customisations || [];
                  customisations.forEach((one: any) => {
                    if (one.local_id === breakUpItem['@ondc/org/item_id']) {
                      findItemFromCartItems = one;
                    }
                  });
                } else {
                  if (
                    item?.item?.local_id === breakUpItem['@ondc/org/item_id']
                  ) {
                    findItemFromCartItems = item?.item;
                  }
                }
              });
              let cartQuantity = findItemFromCartItems
                ? findItemFromCartItems?.quantity?.count
                : cartItem
                ? cartItem?.quantity?.count
                : 0;
              let quantity = breakUpItem['@ondc/org/item_quantity']
                ? breakUpItem['@ondc/org/item_quantity'].count
                : 0;

              let textClass = '';
              let quantityMessage = '';
              let isError = false;
              if (quantity === 0) {
                if (breakUpItem['@ondc/org/title_type'] === 'item') {
                  textClass = 'text-error';
                  quantityMessage = 'Out of stock';
                  isError = true;

                  if (cartIndex > -1) {
                    cartList.splice(cartIndex, 1);
                  }
                }
              } else if (quantity !== cartQuantity) {
                textClass =
                  breakUpItem['@ondc/org/title_type'] === 'item'
                    ? 'text-amber'
                    : '';
                quantityMessage = `Quantity: ${quantity}/${cartQuantity}`;
                isError = true;

                if (cartItem) {
                  cartItem.quantity.count = quantity;
                }
              } else {
                quantityMessage = `Quantity: ${quantity}`;
              }

              if (error && error.code === '30009') {
                cartList.splice(cartIndex, 1);
              }
              uuid = uuid + 1;
              return {
                id: breakUpItem['@ondc/org/item_id'],
                title: breakUpItem?.title,
                title_type: breakUpItem['@ondc/org/title_type'],
                isCustomization: isItemCustomization(breakUpItem?.item?.tags),
                isDelivery: breakUpItem['@ondc/org/title_type'] === 'delivery',
                parent_item_id: breakUpItem?.item?.parent_item_id,
                price: Number(breakUpItem.price?.value)?.toFixed(2),
                cartQuantity,
                quantity,
                provided_by,
                textClass,
                quantityMessage,
                uuid: uuid,
                isError,
                errorCode: error?.code || '',
              };
            });

            let items: any = {};
            let delivery: any = {};
            let outOfStock: any[] = [];
            let errorCode: string = '';
            let fulfilmentIds = Object.assign([], selectedFulfillmentList);

            if (fulfilmentIds.length === 0) {
              fulfilmentIds = selectedItems[0]?.message?.quote.items.map(
                (item: any) => item.fulfillment_id,
              );
              setSelectedFulfillmentList(fulfilmentIds);
            }

            allItems.forEach((item: any) => {
              errorCode = item.errorCode;
              setQuoteItemProcessing(item.id);
              if (item.isError) {
                outOfStock.push(item);
                isAnyError = true;
              }
              // for type item
              if (item.title_type === 'item' && !item.isCustomization) {
                let key = item.parent_item_id || item.id;
                let price = {
                  title: item.quantity + ' * Base Price',
                  value: item.price,
                };
                let prev_item_data = items[key];
                let addition_item_data = {title: item.title, price: price};
                items[key] = {...prev_item_data, ...addition_item_data};
              }
              if (
                item.title_type === 'tax' &&
                !item.isCustomization &&
                !fulfilmentIds.includes(item.id)
              ) {
                let key = item.parent_item_id || item.id;
                items[key] = items[key] || {};
                items[key].tax = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (item.title_type === 'discount' && !item.isCustomization) {
                let key = item.parent_item_id || item.id;
                items[key] = items[key] || {};
                items[key].discount = {
                  title: item.title,
                  value: item.price,
                };
              }

              //for customizations
              if (item.title_type === 'item' && item.isCustomization) {
                let key = item.parent_item_id;
                items[key] = items[key] || {};
                items[key].customizations = items[key].customizations || {};
                let existing_data = items[key].customizations[item.id] || {};
                let customisation_details = {
                  title: item.title,
                  price: {
                    title: item.quantity + ' * Base Price',
                    value: item.price,
                  },
                  quantityMessage: item.quantityMessage,
                  textClass: item.textClass,
                  quantity: item.quantity,
                  cartQuantity: item.cartQuantity,
                };
                items[key].customizations[item.id] = {
                  ...existing_data,
                  ...customisation_details,
                };
              }
              if (item.title_type === 'tax' && item.isCustomization) {
                let key = item.parent_item_id;
                items[key].customizations = items[key].customizations || {};
                items[key].customizations[item.id] =
                  items[key].customizations[item.id] || {};
                items[key].customizations[item.id].tax = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (item.title_type === 'discount' && item.isCustomization) {
                let key = item.parent_item_id;
                items[key].customizations = items[key].customizations || {};
                items[key].customizations[item.id] =
                  items[key].customizations[item.id] || {};
                items[key].customizations[item.id].discount = {
                  title: item.title,
                  value: item.price,
                };
              }
              //for delivery
              if (
                item.title_type === 'delivery' &&
                fulfilmentIds.includes(item.id)
              ) {
                delivery.delivery = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (
                item.title_type === 'discount_f' &&
                fulfilmentIds.includes(item.id)
              ) {
                delivery.discount = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (
                (item.title_type === 'tax_f' || item.title_type === 'tax') &&
                fulfilmentIds.includes(item.id)
              ) {
                delivery.tax = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (
                item.title_type === 'packing' &&
                fulfilmentIds.includes(item.id)
              ) {
                delivery.packing = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (item.title_type === 'discount') {
                if (!item.isCustomization) {
                  let id = item.id;
                  items[id].discount = {
                    title: item.title,
                    value: item.price,
                  };
                }
              }
              if (
                item.title_type === 'misc' &&
                fulfilmentIds.includes(item.id)
              ) {
                delivery.misc = {
                  title: item.title,
                  value: item.price,
                };
              }
            });
            setQuoteItemProcessing(null);
            provider.items = items;
            provider.delivery = delivery;
            provider.outOfStock = outOfStock;
            provider.errorCode = errorCode || '';
            if (errorCode !== '') {
              isAnyError = true;
            }
          }

          if (error) {
            provider.error = error.message;
          }

          total_payable += provider_payable;
          provider.total_payable = provider_payable;
          return provider;
        });
        setProductsQuote({
          providers: quotes,
          isError: isAnyError,
          total_payable: total_payable.toFixed(2),
        });
      }
    } catch (err) {
      showQuoteError();
    }
  }, [selectedItems, selectedFulfillmentList]);

  useEffect(() => {
    const getCartSubtotal = () => {
      let subtotal = 0;
      cartItems.map((cartItem: any) => {
        if (cartItem.item.hasCustomisations) {
          subtotal +=
            getPriceWithCustomisations(cartItem) *
            cartItem?.item?.quantity?.count;
        } else {
          subtotal +=
            cartItem?.item?.product?.subtotal * cartItem?.item?.quantity?.count;
        }
      });
      return subtotal.toFixed(2);
    };

    const getProviderWiseItems = () => {
      let providers: any[] = [];
      cartItems.forEach((item: any) => {
        const availableProvider = providers.find(
          (provider: any) => provider.provider.id === item.item.provider.id,
        );
        if (availableProvider) {
          availableProvider.items.push(item);
        } else {
          providers.push({
            provider: item.item.provider,
            items: [item],
          });
        }
      });
      return providers;
    };

    setProviderWiseItems(getProviderWiseItems());
    setCartTotal(getCartSubtotal());
  }, [cartItems]);

  useEffect(() => {
    setDeliveryAddress(address);
  }, []);

  return (
    <SafeAreaPage>
      <View style={styles.pageContainer}>
        <Header
          label={t('Cart.My Cart')}
          cart={cartData?.cartItems.length > 0}
          navigateToHome={navigateToHome}
        />
        <>
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              <View
                style={styles.pageContainer}
                pointerEvents={checkoutLoading ? 'none' : 'auto'}>
                <CartItems
                  fullCartItems={cartData?.cartItems}
                  providerWiseItems={providerWiseItems}
                  cartItems={cartItems}
                  setCartItems={updateDetailCartItems}
                  updateSpecificCartItems={updateSpecificCartItems}
                  haveDistinctProviders={haveDistinctProviders}
                  isProductCategoryIsDifferent={isProductCategoryIsDifferent}
                />
              </View>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <View style={styles.address}>
                    <Text variant={'bodyLarge'} style={styles.addressTitle}>
                      {t('Cart.Delivery Address')}
                    </Text>
                    <Text variant={'labelMedium'} style={styles.addressLabel}>
                      {deliveryAddress?.address?.street},{' '}
                      {deliveryAddress?.address?.landmark
                        ? `${deliveryAddress?.address?.landmark},`
                        : ''}{' '}
                      {deliveryAddress?.address?.city},{' '}
                      {deliveryAddress?.address?.state},{' '}
                      {deliveryAddress?.address?.areaCode}{' '}
                      {deliveryAddress?.descriptor?.name} (
                      {deliveryAddress?.descriptor?.phone})
                    </Text>
                  </View>
                  <TouchableOpacity
                    disabled={
                      isProductAvailableQuantityIsZero ||
                      isProductCategoryIsDifferent ||
                      haveDistinctProviders ||
                      checkoutLoading
                    }
                    style={styles.changeButton}
                    onPress={() => addressSheet.current.open()}>
                    <Text
                      variant={'labelLarge'}
                      style={styles.changeButtonLabel}>
                      {t('Cart.Change')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.deliveryRow}>
                  <View>
                    <Text variant="titleLarge" style={styles.total}>
                      ₹{formatNumber(cartTotal)}
                    </Text>
                    <Text variant="bodyMedium" style={styles.itemCount}>
                      {formatNumber(cartItems.length)} {t('Cart.items')}
                    </Text>
                  </View>
                  <View>
                    <Button
                      disabled={
                        isProductAvailableQuantityIsZero ||
                        isProductCategoryIsDifferent ||
                        haveDistinctProviders ||
                        checkoutLoading
                      }
                      icon={() =>
                        checkoutLoading ? (
                          <ActivityIndicator
                            size={14}
                            color={theme.colors.primary}
                          />
                        ) : (
                          <></>
                        )
                      }
                      style={styles.deliveryButton}
                      mode={'contained'}
                      onPress={() => onCheckoutFromCart(deliveryAddress)}>
                      {t('Cart.View Delivery Options')}
                    </Button>
                  </View>
                </View>
              </View>
            </>
          )}
        </>
      </View>
      <RBSheet
        closeOnPressMask={false}
        ref={fulfillmentSheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <Fulfillment
          items={cartItems}
          showPaymentOption={showPaymentOption}
          selectedFulfillmentList={selectedFulfillmentList}
          setSelectedFulfillmentList={setSelectedFulfillmentList}
          cartItems={selectedItems}
          updateCartItems={setSelectedItems}
          productsQuote={productsQuote}
          closeFulfilment={() => fulfillmentSheet.current.close()}
          cartTotal={cartTotal}
        />
      </RBSheet>
      <RBSheet
        closeOnPressMask={false}
        ref={addressSheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <CloseSheetContainer closeSheet={() => addressSheet.current.close()}>
          <View style={styles.addressContainer}>
            <AddressList
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={updateDeliveryAddress}
              detectAddressNavigation={detectAddressNavigation}
            />
          </View>
        </CloseSheetContainer>
      </RBSheet>
      <RBSheet
        closeOnPressMask={false}
        ref={paymentSheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <Payment
          productsQuote={productsQuote}
          cartItems={cartItems}
          updatedCartItemsData={selectedItems}
          billingAddress={deliveryAddress}
          deliveryAddress={deliveryAddress}
          selectedFulfillmentList={selectedFulfillmentList}
          responseReceivedIds={selectedItems.map(item =>
            item?.message?.quote?.provider?.id.toString(),
          )}
          fulfilmentList={selectedItems[0]?.message?.quote?.fulfillments}
          setUpdateCartItemsDataOnInitialize={data => {
            setSelectedItems(data);
          }}
          closePaymentSheet={closePaymentSheet}
          handleConfirmOrder={() => {
            closePaymentSheet();
            setConfirmModalVisible(true);
          }}
          confirmOrderLoading={confirmOrderLoading}
          setActivePaymentMethod={setActivePaymentMethod}
          activePaymentMethod={activePaymentMethod}
        />
      </RBSheet>
      <Portal>
        <Modal visible={confirmModalVisible} onDismiss={hideConfirmModal}>
          <View style={styles.modal}>
            <View style={styles.closeContainer}>
              <TouchableOpacity onPress={hideConfirmModal}>
                <Icon name={'clear'} size={20} color={'#000'} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <View style={styles.modalContainer}>
                <ReferenceIcon width={50} height={80} />
                <Text variant={'headlineMedium'} style={styles.modalTitle}>
                  {t('Cart.Reference.reference app')}
                </Text>
                <View style={styles.messageContainer}>
                  <Text variant={'bodySmall'} style={styles.message}>
                    {t('Cart.Reference.Reference App Message')}
                  </Text>
                  <Text
                    variant={'bodySmall'}
                    style={styles.link}
                    onPress={linkToManual}>
                    {t('Cart.Reference.Refer manual')}
                  </Text>
                </View>
              </View>
              <Button mode={'contained'} onPress={hideConfirmModal}>
                {t('Cart.Reference.ok')}
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaPage>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    changeButton: {
      height: 36,
      width: 74,
      borderRadius: 43,
      justifyContent: 'center',
      borderColor: colors.primary,
      borderWidth: 1,
      alignItems: 'center',
    },
    changeButtonLabel: {
      color: colors.primary,
    },
    pageContainer: {
      flex: 1,
      backgroundColor: colors.neutral50,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    summaryCard: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      backgroundColor: colors.white,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      shadowColor: colors.black, // Shadow color
      shadowOffset: {width: 0, height: -5}, // Shadow only at the top (negative height)
      shadowOpacity: 0.2, // Shadow opacity
      shadowRadius: 10, // Blur radius for shadow
      elevation: 10, // Elevation for Android
      marginTop: 16, // Add margin to see the shadow effect clearly
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 40,
    },
    deliveryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 15,
    },
    summaryDivider: {
      marginVertical: 16,
      height: 1,
      backgroundColor: colors.neutral100,
    },
    address: {
      flexShrink: 1,
      marginRight: 8,
    },
    addressTitle: {
      color: colors.neutral400,
      marginTop: 4,
    },
    addressLabel: {
      color: colors.neutral300,
    },
    total: {
      color: colors.neutral400,
    },
    itemCount: {
      color: colors.neutral300,
    },
    rbSheet: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
    wrapper: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
    addressContainer: {
      backgroundColor: colors.white,
      flex: 1,
      paddingTop: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    deliveryButton: {
      height: 44,
      width: 234,
      borderRadius: 8,
      justifyContent: 'center',
    },
    closeContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 16,
    },
    modal: {
      backgroundColor: colors.white,
      margin: 20,
      borderRadius: 24,
    },
    modalContent: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    message: {
      color: colors.neutral400,
      textAlign: 'center',
    },
    link: {
      marginTop: 4,
      color: colors.primary,
      textAlign: 'center',
    },
    modalTitle: {
      color: colors.neutral400,
    },
    messageContainer: {
      paddingTop: 4,
      paddingBottom: 28,
    },
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ProviderCart;