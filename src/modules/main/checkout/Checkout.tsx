import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import useSelectItems from '../../../hooks/useSelectItems';
import {getStoredData} from '../../../utils/storage';
import {showToastWithGravity} from '../../../utils/utils';
import AddressList from './components/AddressList';
import Customer from './components/Customer';
import Fulfillment from './components/Fulfillment';
import Payment from './components/Payment';

const steps = [
  {
    label: 'Customer',
  },
  {
    label: 'Fulfillment',
  },
  {
    label: 'Address',
  },
  {
    label: 'Payment',
  },
];

const stepsCount = steps.length;

const Checkout = () => {
  const theme = useTheme();
  const [billingAddress, setBillingAddress] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<any>(null);
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
  const {cartItems, setCartItems} = useSelectItems(false);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Customer currentStep={currentStep} setCurrentStep={setCurrentStep} />
        );

      case 1:
        return (
          <Fulfillment
            selectedFulfillment={selectedFulfillment}
            setSelectedFulfillment={setSelectedFulfillment}
            cartItems={updatedCartItems}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
          />
        );

      case 2:
        return (
          <AddressList
            deliveryAddress={deliveryAddress}
            setBillingAddress={setBillingAddress}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            setDeliveryAddress={setDeliveryAddress}
          />
        );

      case 3:
        return (
          <Payment
            productsQuote={productsQuote}
            cartItems={cartItems}
            updatedCartItemsData={updatedCartItems}
            billingAddress={billingAddress}
            deliveryAddress={deliveryAddress}
            selectedFulfillmentId={selectedFulfillment}
            responseReceivedIds={updatedCartItems.map(item =>
              item?.message?.quote?.provider?.id.toString(),
            )}
            fulfilmentList={updatedCartItems[0]?.message?.quote?.fulfillments}
            setUpdateCartItemsDataOnInitialize={data => {
              setUpdatedCartItems(data);
            }}
          />
        );
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
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      backgroundColor: '#fff',
      flex: 1,
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
    listContainer: {
      padding: 16,
      backgroundColor: '#F9F9F9',
    },
    addressFormContainer: {
      flex: 1,
      backgroundColor: '#0f0',
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
    addAddress: {
      marginBottom: 20,
    },
    shippingAddress: {
      marginBottom: 12,
    },
    billingAddressContainer: {
      marginTop: 20,
    },
    addressSelection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    addressText: {
      marginVertical: 8,
    },
  });

export default Checkout;
