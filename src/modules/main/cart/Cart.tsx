import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  ProgressBar,
  Text,
} from 'react-native-paper';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  compareIgnoringSpaces,
  getPriceWithCustomisations,
  isItemCustomization,
  showToastWithGravity,
} from '../../../utils/utils';
import CartItems from './components/CartItems';
import useSelectItems from '../../../hooks/useSelectItems';
import EmptyCart from './components/EmptyCart';
import Fulfillment from './components/Fulfillment';
import AddressList from './components/AddressList';
import Payment from './components/Payment';
import useConfirmItems from '../../../hooks/useConfirmItems';
import CloseSheetContainer from '../../../components/bottomSheet/CloseSheetContainer';
import {useAppTheme} from '../../../utils/theme';
import useReadAudio from '../../../hooks/useReadAudio';
import {VIEW_DELIVERY_OPTIONS_COMMAND} from '../../../utils/constants';
import useFormatNumber from '../../../hooks/useFormatNumber';

const screenHeight: number = Dimensions.get('screen').height;

const Cart = () => {
  const {formatNumber} = useFormatNumber();
  const voiceDetectionStarted = useRef<boolean>(false);
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector(({address}) => address);
  const isFocused = useIsFocused();
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

  const openFulfillmentSheet = () => {
    fulfillmentSheet.current.open();
    fulfillmentSheetShown.current = true;
  };

  const closePaymentSheet = () => {
    setActivePaymentMethod('');
    paymentSheet.current.close();
  };

  const {
    loading,
    cartItems,
    checkoutLoading,
    getCartItems,
    onCheckoutFromCart,
    haveDistinctProviders,
    isProductAvailableQuantityIsZero,
    isProductCategoryIsDifferent,
    setCartItems,
    selectedItems,
    setSelectedItems,
    selectedItemsForInit,
    updateSelectedItemsForInit,
  } = useSelectItems(openFulfillmentSheet);

  const {language} = useSelector(({auth}) => auth);
  const {
    startVoice,
    userInteractionStarted,
    userInput,
    stopAndDestroyVoiceListener,
    setAllowRestarts,
  } = useReadAudio(language);

  const {
    confirmOrderLoading,
    handleConfirmOrder,
    deliveryAddress,
    setDeliveryAddress,
    activePaymentMethod,
    setActivePaymentMethod,
  } = useConfirmItems(closePaymentSheet, stopAndDestroyVoiceListener);

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
    paymentSheet.current.open();
  };

  const updateDeliveryAddress = (newAddress: any) => {
    setDeliveryAddress(newAddress);
    addressSheet.current.close();
  };

  const navigateToHome = () => {
    stopAndDestroyVoiceListener().then(() => {
      navigation.navigate('Dashboard');
    });
  };

  const detectAddressNavigation = () => {
    addressSheet.current.close();
  };

  useFocusEffect(
    useCallback(() => {
      if (voiceDetectionStarted.current) {
        setAllowRestarts();
      }
    }, []),
  );

  useEffect(() => {
    setDeliveryAddress(address);
  }, [address]);

  useEffect(() => {
    if (userInput.length > 0) {
      const input = userInput.toLowerCase();
      if (VIEW_DELIVERY_OPTIONS_COMMAND.includes(input)) {
        onCheckoutFromCart(deliveryAddress).then(() => {});
      } else if (
        fulfillmentSheetShown.current &&
        compareIgnoringSpaces('proceed to pay', input)
      ) {
        showPaymentOption();
      }
    }
  }, [userInput, deliveryAddress]);

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
              if (error && error.code === '40002') {
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
      console.log('Calculating quote:', err);
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
    if (isFocused) {
      getCartItems().then(() => {
        voiceDetectionStarted.current = true;
        startVoice().then(() => {});
      });
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      title: t('Cart.My Cart'),
      headerRight: () => (
        <TouchableOpacity style={styles.addMoreItems} onPress={navigateToHome}>
          <Icon name={'add'} size={24} color={theme.colors.primary} />
          <Text variant={'labelMedium'} style={styles.addMoreItemsLabel}>
            {t('Cart.Add More Items')}
          </Text>
        </TouchableOpacity>
      ),
    });
    setDeliveryAddress(address);
  }, []);

  return (
    <>
      {userInteractionStarted && (
        <ProgressBar indeterminate color={theme.colors.success600} />
      )}
      <View style={styles.pageContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={theme.colors.primary} />
          </View>
        ) : (
          <>
            {cartItems.length === 0 ? (
              <EmptyCart />
            ) : (
              <>
                <View
                  style={styles.pageContainer}
                  pointerEvents={checkoutLoading ? 'none' : 'auto'}>
                  <CartItems
                    providerWiseItems={providerWiseItems}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    haveDistinctProviders={haveDistinctProviders}
                    isProductCategoryIsDifferent={isProductCategoryIsDifferent}
                  />
                </View>
                <Card style={styles.summaryCard}>
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
                    <Button
                      disabled={
                        isProductAvailableQuantityIsZero ||
                        isProductCategoryIsDifferent ||
                        haveDistinctProviders ||
                        checkoutLoading
                      }
                      style={styles.changeButton}
                      labelStyle={styles.changeButtonLabel}
                      mode={'outlined'}
                      onPress={() => addressSheet.current.open()}>
                      {t('Cart.Change')}
                    </Button>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
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
                </Card>
              </>
            )}
          </>
        )}
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
          userInput={userInput}
          productsQuote={productsQuote}
          cartItems={selectedItemsForInit}
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
          handleConfirmOrder={() =>
            handleConfirmOrder(selectedItemsForInit, selectedItems)
          }
          confirmOrderLoading={confirmOrderLoading}
          setActivePaymentMethod={setActivePaymentMethod}
          activePaymentMethod={activePaymentMethod}
        />
      </RBSheet>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    changeButton: {
      borderRadius: 40,
      height: 36,
    },
    changeButtonLabel: {
      margin: 0,
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
      elevation: 10,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    summaryDivider: {
      marginVertical: 15,
      height: 1,
      backgroundColor: colors.neutral100,
    },
    address: {
      flexShrink: 1,
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
      borderRadius: 8,
    },
    addMoreItems: {
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
      marginRight: 16,
    },
    addMoreItemsLabel: {
      color: colors.primary,
    },
  });

export default Cart;
