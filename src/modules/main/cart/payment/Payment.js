import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Header from '../addressPicker/Header';
import {Text, withTheme} from 'react-native-elements';
import {appStyles} from '../../../../styles/styles';
import ContainButton from '../../../../components/button/ContainButton';
import RadioForm, {
  RadioButtonInput,
  RadioButton,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {strings} from '../../../../locales/i18n';
import {postData, getData} from '../../../../utils/api';
import {
  BASE_URL,
  CONFIRM_ORDER,
  INITIALIZE_ORDER,
  ON_CONFIRM_ORDER,
  ON_INITIALIZE_ORDER,
} from '../../../../utils/apiUtilities';
import {Context as AuthContext} from '../../../../context/Auth';
import {CartContext} from '../../../../context/Cart';

const heading = strings('main.cart.checkout');
const buttonTitle = strings('main.cart.next');
const addressTitle = strings('main.cart.address');
const paymentOptionsTitle = strings('main.cart.payment_options');

const paymentOptions = [
  {value: 0, label: 'JusPay'},
  {value: 1, label: 'Cash on delivery'},
];

/**
 * Component to payment screen in application
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @constructor
 * @returns {JSX.Element}
 */
const Payment = ({navigation, theme, route: {params}}) => {
  const {colors} = theme;
  const {selectedAddress, confirmationList} = params;
  const {cart} = useContext(CartContext);
  const [orders, setOrders] = useState(null);
  const {
    state: {token},
  } = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [initializeOrderInProgrss, setInitializeOrderInprogress] =
    useState(false);
  const [confirmOrderInProgrss, setConfirmOrderInprogress] = useState(false);

  const onInitializeOrder = messageId => {
    const messageIds = messageId.toString();
    let order = setInterval(async () => {
      try {
        const {data} = await getData(
          `${BASE_URL}${ON_INITIALIZE_ORDER}messageIds=${messageIds}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        setOrders(data);
        setInitializeOrderInprogress(false);
      } catch (error) {
        console.log(error);
        setInitializeOrderInprogress(false);
      }
    }, 2000);
    setTimeout(() => {
      clearInterval(order);
    }, 10000);
  };

  const onConfirmOrder = messageId => {
    const messageIds = messageId.toString();
    let order = setInterval(async () => {
      try {
        const {data} = await getData(
          `${BASE_URL}${ON_CONFIRM_ORDER}messageIds=${messageIds}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        setConfirmOrderInprogress(false);
      } catch (error) {
        console.log(error);
        setConfirmOrderInprogress(false);
      }
    }, 2000);
    setTimeout(() => {
      clearInterval(order);
      alert('Order Placed');
    }, 10000);
  };

  const initializeOrder = async () => {
    try {
      setInitializeOrderInprogress(true);
      let payload = [];
      let bppIdArray = [];
      confirmationList.forEach(item => {
        console.log(JSON.stringify(item, undefined, 4));
        if (item.provider) {
          const index = bppIdArray.findIndex(one => one === item.bpp_id);
          if (index > -1) {
            let itemObj = {
              id: item.id,
              quantity: {
                count: item.quantity.selected.count,
              },
              product: {
                id: item.id,
                descriptor: item.provider.descriptor,
                price: item.price,
                provider_name: item.provider.descriptor.name,
              },
              bpp_id: item.bpp_id,
              provider: {
                id: item.provider.id,
                locations: ['el'],
                //   locations: location,
              },
            };
            payload[index].message.items.push(itemObj);
          } else {
            let payloadObj = {
              context: {transaction_id: item.transaction_id},
              message: {
                items: [
                  {
                    id: item.id,
                    quantity: {
                      count: item.quantity.selected.count,
                    },
                    product: {
                      id: item.id,
                      descriptor: item.provider.descriptor,
                      price: item.price,
                      provider_name: item.provider.descriptor.name,
                    },
                    bpp_id: item.bpp_id,
                    provider: {
                      id: item.provider.id,
                      locations: ['el'],
                      //   locations: location,
                    },
                  },
                ],
                billing_info: {
                  address: {
                    door: selectedAddress.address.door
                      ? selectedAddress.address.door
                      : selectedAddress.address.street,
                    country: 'IND',
                    city: selectedAddress.address.city,
                    street: selectedAddress.address.street,
                    area_code: selectedAddress.address.area_code,
                    state: selectedAddress.address.state,
                    building: selectedAddress.address.building
                      ? selectedAddress.address.building
                      : selectedAddress.address.street,
                  },
                  phone: selectedAddress.descriptor.phone,
                  name: selectedAddress.descriptor.name,
                  email: selectedAddress.descriptor.email,
                },
                delivery_info: {
                  type: 'HOME-DELIVERY',
                  name: selectedAddress.descriptor.name,
                  phone: selectedAddress.descriptor.phone,
                  email: selectedAddress.descriptor.email,
                  location: {
                    address: {
                      door: selectedAddress.address.door
                        ? selectedAddress.address.door
                        : selectedAddress.address.street,
                      country: 'IND',
                      city: selectedAddress.address.city,
                      street: selectedAddress.address.street,
                      area_code: selectedAddress.address.area_code,
                      state: selectedAddress.address.state,
                      building: selectedAddress.address.building
                        ? selectedAddress.address.building
                        : selectedAddress.address.street,
                    },
                  },
                },
              },
            };

            payload.push(payloadObj);
            bppIdArray.push(item.bpp_id);
          }
        }
      });
      const {data} = await postData(`${BASE_URL}${INITIALIZE_ORDER}`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });
      let messageIds = [];
      data.forEach(item => {
        messageIds.push(item.context.message_id);
      });

      onInitializeOrder(messageIds);
    } catch (error) {
      console.log(error);
      setInitializeOrderInprogress(false);
    }
  };

  const confirmOrder = async () => {
    try {
      setConfirmOrderInprogress(true);
      const payload = [];
      orders.forEach(item => {
        const itemsArray = [];
        item.message.order.items.forEach(object => {
          const element = cart.find(one => one.id === object.id);

          object.id = element.id;
          object.bpp_id = item.context.bpp_id;
          object.product = {
            id: element.id,
            descriptor: element.descriptor,
            price: element.price,
            provider_name: element.provider,
          };
          object.provider = {
            id: item.message.order.provider.id,
            locations: [item.message.order.provider_location.id],
          };
          itemsArray.push(object);
        });

        const payloadObj = {
          context: {
            transaction_id: item.context.transaction_id,
          },
          message: {
            items: itemsArray,
            billing_info: item.message.order.billing,
            delivery_info: {
              type: item.message.order.fulfillment.type,
              phone: item.message.order.fulfillment.end.contact.phone,
              email: item.message.order.fulfillment.end.contact.email,
              name: item.message.order.billing.name,
              location: item.message.order.fulfillment.end.location,
            },
            payment: {
              paid_amount: item.message.order.payment.params.amount,
              status: 'PAID',
              transaction_id: item.context.transaction_id,
            },
          },
        };
        payload.push(payloadObj);
      });

      const {data} = await postData(`${BASE_URL}${CONFIRM_ORDER}`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });
      let messageIds = [];
      data.forEach(item => {
        messageIds.push(item.context.message_id);
      });

      onConfirmOrder(messageIds);
    } catch (error) {
      console.log(error);
      setConfirmOrderInprogress(false);
    }
  };

  useEffect(() => {
    initializeOrder();
  }, []);

  return (
    <View
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <Header title={heading} navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.text}>{addressTitle}</Text>
        <View style={styles.addressContainer}>
          <Text>
            {selectedAddress.address.street}, {selectedAddress.address.locality}
            , {selectedAddress.address.city}, {selectedAddress.address.state} -{' '}
            {selectedAddress.address.area_code}
          </Text>
        </View>

        <Text style={styles.text}>{paymentOptionsTitle}</Text>
        <View style={styles.addressContainer}>
          <RadioForm animation={true}>
            {paymentOptions.map((obj, i) => (
              <RadioButton
                labelHorizontal={true}
                key={i}
                style={styles.buttonStyle}>
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={i === value}
                  borderWidth={1}
                  buttonSize={12}
                  buttonOuterSize={20}
                  onPress={index => {
                    setValue(index);
                  }}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  labelStyle={[styles.labelStyle, {color: colors.black}]}
                />
              </RadioButton>
            ))}
          </RadioForm>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ContainButton
          title={buttonTitle}
          onPress={confirmOrder}
          disabled={initializeOrderInProgrss}
          loading={confirmOrderInProgrss}
        />
      </View>
    </View>
  );
};

export default withTheme(Payment);

const styles = StyleSheet.create({
  container: {padding: 15},
  text: {fontSize: 18, fontWeight: '600'},
  buttonContainer: {width: 300, alignSelf: 'center'},
  addressContainer: {marginVertical: 15},
  labelStyle: {fontSize: 16, fontWeight: '400'},
  buttonStyle: {marginBottom: 10},
});
