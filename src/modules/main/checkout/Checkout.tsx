import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {
  Avatar,
  Button,
  Card,
  RadioButton,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import useSelectItems from '../../../hooks/useSelectItems';
import EmptyCart from '../cart/components/EmptyCart';
import CartItems from '../cart/components/CartItems';
import {getStoredData, setStoredData} from '../../../utils/storage';
import {
  constructQuoteObject,
  getInitials,
  showToastWithGravity,
} from '../../../utils/utils';
import {useSelector} from 'react-redux';

const steps = [
  {
    label: 'Cart',
  },
  {
    label: 'Customer',
  },
  {
    label: 'Fulfillment',
  },
  {
    label: 'Add Address',
  },
  {
    label: 'Payment',
  },
];

const stepsCount = steps.length;

const Checkout = () => {
  const theme = useTheme();
  const {address} = useSelector(({addressReducer}) => addressReducer);
  const styles = makeStyles(theme.colors);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [updatedCartItems, setUpdatedCartItems] = useState<any[]>([]);
  const [quoteItemProcessing, setQuoteItemProcessing] = useState<any>(null);
  const [selectedFulfillment, setSelectedFulfillment] = useState<any>(null);
  const [productsQuote, setProductsQuote] = useState<any>({
    providers: [],
    isError: false,
    total_payable: 0,
  });

  const {
    loading,
    cartItems,
    checkoutLoading,
    onCheckoutFromCart,
    haveDistinctProviders,
    isProductAvailableQuantityIsZero,
    isProductCategoryIsDifferent,
    setCartItems,
  } = useSelectItems(false);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={theme.colors.primary} />
          </View>
        ) : cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <ScrollView style={styles.listContainer}>
            <CartItems
              allowScroll={false}
              cartItems={cartItems}
              setCartItems={setCartItems}
              haveDistinctProviders={haveDistinctProviders}
              isProductCategoryIsDifferent={isProductCategoryIsDifferent}
            />
            <View style={styles.buttonContainer}>
              <Button
                style={styles.cartButton}
                mode={'contained'}
                onPress={() => setCurrentStep(currentStep + 1)}>
                Continue
              </Button>
              <View style={styles.separator} />
              <Button
                disabled={checkoutLoading}
                style={styles.cartButton}
                mode={'contained'}
                onPress={onCheckoutFromCart}>
                {checkoutLoading ? (
                  <ActivityIndicator color={theme.colors.primary} size={14} />
                ) : (
                  'Update Cart'
                )}
              </Button>
            </View>
          </ScrollView>
        );

      case 1:
        return (
          <View style={styles.listContainer}>
            <View style={styles.customerRow}>
              <Avatar.Text
                size={36}
                label={getInitials(address?.descriptor?.name)}
              />
              <View style={styles.customerMeta}>
                <Text variant={'titleSmall'}>{address?.descriptor?.name}</Text>
                <Text variant={'bodyLarge'}>{address?.descriptor?.email}</Text>
              </View>
            </View>
            <Button
              mode={'contained'}
              onPress={() => setCurrentStep(currentStep + 1)}>
              Continue
            </Button>
          </View>
        );

      case 2:
        return (
          <View style={styles.listContainer}>
            <RadioButton.Group
              value={selectedFulfillment}
              onValueChange={newValue => setSelectedFulfillment(newValue)}>
              {updatedCartItems[0]?.message?.quote?.fulfillments?.map(
                (fulfillment: any) => (
                  <View key={fulfillment.id} style={styles.customerRow}>
                    <RadioButton.Android value={fulfillment.id} />
                    <Text>{fulfillment['@ondc/org/category']}</Text>
                  </View>
                ),
              )}
            </RadioButton.Group>
            <Button
              mode={'contained'}
              onPress={() => setCurrentStep(currentStep + 1)}>
              Continue
            </Button>
          </View>
        );

      case 3:
        return <View style={styles.listContainer}></View>;

      case 4:
        return <></>;

      case 5:
        return <></>;
    }
  };

  const isItemCustomization = (tags: any[]) => {
    let isCustomization = false;
    tags?.forEach((tag: any) => {
      if (tag.code === 'type') {
        tag.list.forEach((listOption: any) => {
          if (
            listOption.code === 'type' &&
            listOption.value === 'customization'
          ) {
            isCustomization = true;
            return true;
          }
        });
      }
    });
    return isCustomization;
  };

  const getItemsTotal = (providers: any[]) => {
    let finalTotal = 0;
    if (providers) {
      providers.forEach((provider: any) => {
        const items = Object.values(provider.items).filter(
          (quote: any) => quote?.title !== '',
        );
        items.forEach((item: any) => {
          finalTotal = finalTotal + parseFloat(item.price.value);
          if (item?.tax) {
            finalTotal = finalTotal + parseFloat(item.tax.value);
          }
          if (item?.discount) {
            finalTotal = finalTotal + parseFloat(item.discount.value);
          }
          if (item?.customizations) {
            Object.values(item.customizations)?.forEach((custItem: any) => {
              finalTotal = finalTotal + parseFloat(custItem.price.value);
              if (custItem?.tax) {
                finalTotal = finalTotal + parseFloat(custItem.tax.value);
              }
            });
          }
        });
      });
    }
    return finalTotal.toFixed(2);
  };

  const renderDeliveryLine = (quote: any, key: any) => (
    <View style={styles.summaryRow} key={`d-quote-${key}-price`}>
      <Text variant="bodyMedium">{quote?.title}</Text>
      <Text variant="bodyMedium">₹{parseInt(quote?.value).toFixed(2)}</Text>
    </View>
  );

  const getDeliveryTotalAmount = (providers: any[]) => {
    let total = 0;
    providers.forEach((provider: any) => {
      const data = provider.delivery;
      if (data.delivery) {
        total = total + parseFloat(data.delivery.value);
      }
      if (data.discount) {
        total = total + parseFloat(data.discount.value);
      }
      if (data.tax) {
        total = total + parseFloat(data.tax.value);
      }
      if (data.packing) {
        total = total + parseFloat(data.packing.value);
      }
      if (data.misc) {
        total = total + parseFloat(data.misc.value);
      }
    });
    return total.toFixed(2);
  };

  const showQuoteError = () => {
    let msg: string = quoteItemProcessing
      ? `Looks like Quote mapping for item: ${quoteItemProcessing} is invalid! Please check!`
      : 'Seems like issue with quote processing! Please confirm first if quote is valid!';
    showToastWithGravity(msg);
  };

  useEffect(() => {
    try {
      if (updatedCartItems.length > 0) {
        const cartList = updatedCartItems.concat([]);
        // check if any one order contains error
        let total_payable = 0;
        let isAnyError = false;
        let quotes = updatedCartItems?.map(singleItem => {
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
            let selected_fulfillment_id = selectedFulfillment;

            if (!selectedFulfillment) {
              selected_fulfillment_id =
                updatedCartItems[0]?.message?.quote.items[0]?.fulfillment_id;
              setSelectedFulfillment(selected_fulfillment_id);
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
                item.id !== selected_fulfillment_id
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
                item.id === selected_fulfillment_id
              ) {
                delivery.delivery = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (
                item.title_type === 'discount_f' &&
                item.id === selected_fulfillment_id
              ) {
                delivery.discount = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (
                (item.title_type === 'tax_f' || item.title_type === 'tax') &&
                item.id === selected_fulfillment_id
              ) {
                delivery.tax = {
                  title: item.title,
                  value: item.price,
                };
              }
              if (
                item.title_type === 'packing' &&
                item.id === selected_fulfillment_id
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
                item.id === selected_fulfillment_id
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
  }, [updatedCartItems, selectedFulfillment]);

  useEffect(() => {
    getStoredData('cartItems').then(response => {
      setCartItems(JSON.parse(response || '{}'));
    });
    getStoredData('updatedCartItems').then(response => {
      setUpdatedCartItems(JSON.parse(response || '{}'));
    });
  }, []);

  return (
    <View style={styles.pageContainer}>
      <View style={styles.stepperContainer}>
        {steps.map((step, stepIndex) => (
          <TouchableOpacity
            key={step.label}
            style={styles.stepContainer}
            onPress={() => setCurrentStep(stepIndex)}>
            <View style={styles.step}>
              {stepIndex > 0 && <View style={styles.stepLine} />}
              <View
                style={
                  stepIndex <= currentStep
                    ? styles.selectedStep
                    : styles.stepNumber
                }>
                {stepIndex <= currentStep ? (
                  <Icon name={'check'} size={10} color={'#fff'} />
                ) : (
                  <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                )}
              </View>
              {stepIndex !== stepsCount - 1 && <View style={styles.stepLine} />}
            </View>
            <Text
              variant={'labelSmall'}
              style={[
                styles.stepLabel,
                stepIndex === 0 ? styles.textLeft : {},
                stepIndex === stepsCount - 1 ? styles.textRight : {},
              ]}>
              {step.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderStep()}
      <View style={styles.summaryCard}>
        <Text variant={'titleMedium'}>Summary</Text>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text variant="bodyMedium">Total</Text>
          <Text variant="bodyMedium">
            ₹{getItemsTotal(productsQuote?.providers)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        {productsQuote?.providers.map((provider: any, pindex: number) => {
          const {delivery} = provider;
          return (
            <View key={`delivery${pindex}`}>
              {delivery.delivery &&
                renderDeliveryLine(delivery.delivery, 'delivery')}
              {delivery.discount &&
                renderDeliveryLine(delivery.discount, 'discount')}
              {delivery.tax && renderDeliveryLine(delivery.tax, 'tax')}
              {delivery.packing &&
                renderDeliveryLine(delivery.packing, 'packing')}
              {delivery.misc && renderDeliveryLine(delivery.misc, 'misc')}
              {delivery &&
                (delivery.delivery ||
                  delivery.discount ||
                  delivery.tax ||
                  delivery.packing ||
                  delivery.misc) && (
                  <View style={styles.summaryRow}>
                    <Text variant="bodyMedium">Total</Text>
                    <Text variant="bodyMedium">
                      ₹{getDeliveryTotalAmount(productsQuote?.providers)}
                    </Text>
                  </View>
                )}
            </View>
          );
        })}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text variant="bodyLarge">Order Total</Text>
          <Text variant="titleSmall">
            ₹{Number(productsQuote?.total_payable).toFixed(2)}
          </Text>
        </View>
        {/*<Button*/}
        {/*  className={classes.proceedToBuy}*/}
        {/*  fullWidth*/}
        {/*  variant="contained"*/}
        {/*  disabled={*/}
        {/*    activePaymentMethod === '' ||*/}
        {/*    productsQuote.isError ||*/}
        {/*    confirmOrderLoading ||*/}
        {/*    initLoading ||*/}
        {/*    currentStep !== 4*/}
        {/*  }*/}
        {/*  onClick={() => {*/}
        {/*    // if (activePaymentMethod) {*/}
        {/*    //   const {productQuotes, successOrderIds} = JSON.parse(*/}
        {/*    //     localStorage.getItem('checkout_details') || '{}',*/}
        {/*    //   );*/}
        {/*    //   setConfirmOrderLoading(true);*/}
        {/*    //   let c = cartItems.map(item => {*/}
        {/*    //     return item.item;*/}
        {/*    //   });*/}
        {/*    //   if (activePaymentMethod === payment_methods.JUSPAY) {*/}
        {/*    //     // setTogglePaymentGateway(true);*/}
        {/*    //     // setLoadingSdkForPayment(true);*/}
        {/*    //     // initiateSDK();*/}
        {/*    //     const request_object = constructQuoteObject(*/}
        {/*    //       c.filter(({provider}) =>*/}
        {/*    //         successOrderIds.includes(provider.local_id.toString()),*/}
        {/*    //       ),*/}
        {/*    //     );*/}
        {/*    //     confirmOrder(request_object[0], payment_methods.JUSPAY);*/}
        {/*    //   } else {*/}
        {/*    //     const request_object = constructQuoteObject(*/}
        {/*    //       c.filter(({provider}) =>*/}
        {/*    //         successOrderIds.includes(provider.local_id.toString()),*/}
        {/*    //       ),*/}
        {/*    //     );*/}
        {/*    //     confirmOrder(request_object[0], payment_methods.COD);*/}
        {/*    //   }*/}
        {/*    // } else {*/}
        {/*    //   showToastWithGravity('Please select payment.');*/}
        {/*    // }*/}
        {/*  }}>*/}
        {/*  {confirmOrderLoading || initLoading ? <ActivityIndicator size={14} color={theme.colors.primary} /> : 'Proceed to Buy'}*/}
        {/*</Button>*/}
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      backgroundColor: '#fff',
    },
    stepNumberText: {
      color: '#151515',
      fontSize: 7,
    },
    stepLabel: {
      marginTop: 12,
      textAlign: 'center',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    stepperContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      padding: 16,
      backgroundColor: '#fff',
    },
    stepContainer: {
      flex: 1,
    },
    step: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#0f0',
      height: 50,
    },
    selectedStep: {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.primary,
      borderRadius: 16,
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 8,
    },
    stepNumber: {
      borderWidth: 1,
      borderColor: '#151515',
      borderRadius: 16,
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 8,
    },
    stepLine: {
      backgroundColor: '#151515',
      height: 1,
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    separator: {
      width: 16,
    },
    listContainer: {
      padding: 16,
      backgroundColor: '#F9F9F9',
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    cartButton: {
      flex: 1,
    },
    summaryCard: {
      paddingTop: 40,
      paddingHorizontal: 16,
    },
    summaryDivider: {
      marginVertical: 12,
      height: 1,
      backgroundColor: '#CACDD8',
    },
    outOfStock: {
      color: colors.error,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    customerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    customerMeta: {
      marginLeft: 12,
    },
  });

export default Checkout;
