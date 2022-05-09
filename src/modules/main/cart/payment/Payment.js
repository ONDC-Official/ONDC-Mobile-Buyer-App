import HyperSdkReact from 'hyper-sdk-react';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {BackHandler, DeviceEventEmitter, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import {Text, withTheme} from 'react-native-elements';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import ContainButton from '../../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../../locales/i18n';
import {appStyles} from '../../../../styles/styles';
import {alertWithOneButton} from '../../../../utils/alerts';
import {getData, postData} from '../../../../utils/api';
import {clearCart} from '../../../../redux/actions';
import {
  BASE_URL,
  CONFIRM_ORDER,
  INITIALIZE_ORDER,
  ON_CONFIRM_ORDER,
  ON_INITIALIZE_ORDER,
  SIGN_PAYLOAD,
} from '../../../../utils/apiUtilities';
import {showToastWithGravity} from '../../../../utils/utils';
import Header from '../addressPicker/Header';
import PaymentSkeleton from './PaymentSkeleton';

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
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const Payment = ({navigation, theme, route: {params}}) => {
  const {colors} = theme;
  const dispatch = useDispatch();
  const {selectedAddress, confirmationList} = params;
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const [error, setError] = useState(null);
  const {
    state: {token, uid},
  } = useContext(AuthContext);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(0);
  const [initializeOrderRequested, setInitializeOrderRequested] =
    useState(true);
  const [confirmOrderRequested, setConfirmOrderRequested] = useState(false);
  const {handleApiError} = useNetworkErrorHandling();
  const orderRef = useRef();
  const signedPayload = useRef(null);

  const onOrderSuccess = () => {
    dispatch(clearCart());
    navigation.navigate('Dashboard');
  };

  const onInitializeOrder = messageIdArray => {
    const messageIds = messageIdArray.toString();
    let order = setInterval(async () => {
      try {
        const {data} = await getData(
          `${BASE_URL}${ON_INITIALIZE_ORDER}messageIds=${messageIds}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        orderRef.current = data;
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(order);
      const ordersArray = orderRef.current;
      if (ordersArray) {
        const errorObj = ordersArray.find(item => item.hasOwnProperty('error'));
        if (errorObj) {
          showToastWithGravity('Something went wrong.Please try again');
        } else {
          setConfirmOrderRequested(false);
        }
      } else {
        showToastWithGravity('Something went wrong.Please try again');
      }
      setInitializeOrderRequested(false);
    }, 11000);
  };

  const onConfirmOrder = messageIdArray => {
    const messageIds = messageIdArray.toString();
    let order = setInterval(async () => {
      try {
        const {data} = await getData(
          `${BASE_URL}${ON_CONFIRM_ORDER}messageIds=${messageIds}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        const errorObj = data.find(item => item.hasOwnProperty('error'));
        setError(errorObj);
      } catch (error) {
        handleApiError(error);
        setError(error);
        setConfirmOrderRequested(false);
      }
    }, 2000);
    setTimeout(() => {
      clearInterval(order);

      if (!error) {
        setConfirmOrderRequested(false);
        alertWithOneButton(
          null,
          'Your order has been placed!',
          'Ok',
          onOrderSuccess,
        );
      } else {
        showToastWithGravity('Something went wrong. Please try again');
        setConfirmOrderRequested(false);
      }
    }, 10000);
  };

  const initializeOrder = async () => {
    try {
      setInitializeOrderRequested(true);
      let payload = [];
      let providerIdArray = [];

      confirmationList.forEach(item => {
        const index = providerIdArray.findIndex(
          one => one === item.provider.id,
        );
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
                    id: item.provider ? item.provider.id : item.id,
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
          providerIdArray.push(item.provider.id);
        }
      });
      const {data} = await postData(`${BASE_URL}${INITIALIZE_ORDER}`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });
      let messageIds = [];
      data.forEach(item => {
        if (item.message.ack.status === 'ACK') {
          messageIds.push(item.context.message_id);
        }
      });
      if (messageIds.length > 0) {
        onInitializeOrder(messageIds);
      } else {
        showToastWithGravity('Something went wrong. Please try again');
        setInitializeOrderRequested(false);
      }
    } catch (error) {
      handleApiError(error);

      setInitializeOrderRequested(false);
    }
  };

  const processPayment = async () => {
    const orderDetails = {
      merchant_id: Config.MERCHANT_ID.toUpperCase(),
      customer_id: uid,
      order_id: confirmationList[0].transaction_id,
      customer_phone: selectedAddress.descriptor.phone,
      customer_email: selectedAddress.descriptor.email,
      amount: 9,
      timestamp: String(new Date().getTime()),
      // return_url: 'https://buyer-app.ondc.org/application/checkout',
    };
    console.log('------------orderDetails payload---------');
    console.log(JSON.stringify(orderDetails, undefined, 4));

    const processPayload = {
      requestId: confirmationList[0].transaction_id,
      service: 'in.juspay.hyperpay',
      payload: {
        action: 'paymentPage',
        merchantId: Config.MERCHANT_ID.toUpperCase(),
        clientId: Config.CLIENT_ID.toUpperCase(),
        orderId: confirmationList[0].transaction_id,
        amount: 9,
        customerId: uid,
        customerEmail: selectedAddress.descriptor.email,
        customerMobile: selectedAddress.descriptor.phone,
        orderDetails: JSON.stringify(orderDetails),
        // signaturePayload: JSON.stringify(signaturePayload),
        signature: signedPayload.current,
        merchantKeyId: Config.MERCHANT_KEY_ID,
        language: 'english',
        environment: 'sandbox',
      },
    };
    console.log('--------process payload-----------');
    console.log(JSON.stringify(processPayload, undefined, 4));

    const initialised = await HyperSdkReact.isInitialised();
    if (initialised) {
      HyperSdkReact.process(JSON.stringify(processPayload));
    } else {
      console.log('Sdk is not initialised');
    }
  };

  const onHyperEvent = resp => {
    const data = JSON.parse(resp);
    const event = data.event || '';
    switch (event) {
      case 'show_loader':
        setInitializeOrderRequested(true);
        break;

      case 'hide_loader':
        setInitializeOrderRequested(false);
        break;

      case 'initiate_result':
        console.log('initiate_result: ', data);
        processPayment().then(() => {}).catch(() => {});
        break;

      case 'process_result':
        console.log('process_result: ', data);
        break;

      default:
        console.log('Unknown Event', data);
    }
  };

  const confirmOrder = async () => {
    setConfirmOrderRequested(true);
    const options = {
      headers: {Authorization: `Bearer ${token}`},
    };
    if (selectedPaymentOption === 1) {
      try {
        if (orderRef.current && orderRef.current.length > 0) {
          const errorObj = orderRef.current.find(one =>
            one.hasOwnProperty('error'),
          );
          if (!errorObj) {
            const payload = [];
            orderRef.current.forEach(item => {
              const itemsArray = [];
              item.message.order.items.forEach(object => {
                const element = cartItems.find(one => one.id === object.id);

                object.id = element.id;
                object.bpp_id = item.context.bpp_id;
                object.product = {
                  id: element.id,
                  descriptor: element.descriptor,
                  price: element.price,
                  name: element.provider,
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

            const {data} = await postData(
              `${BASE_URL}${CONFIRM_ORDER}`,
              payload,
              {
                headers: {Authorization: `Bearer ${token}`},
              },
            );
            let messageIds = [];
            data.forEach(item => {
              if (item.message.ack.status === 'ACK') {
                messageIds.push(item.context.message_id);
              }
            });

            onConfirmOrder(messageIds);
          } else {
            showToastWithGravity('Something went wrong.Please try again');
          }
        } else {
          showToastWithGravity('Something went wrong.Please try again');
        }
      } catch (error) {
        handleApiError(error);
        setConfirmOrderRequested(false);
      }
    } else {
      try {
        const payload = JSON.stringify({
          merchant_id: Config.MERCHANT_ID.toUpperCase(),
          customer_id: uid,
          mobile_number: selectedAddress.descriptor.phone,
          email_address: selectedAddress.descriptor.email,
          timestamp: String(new Date().getTime()),
        });
        console.log('----------sign payload---------', payload);

        const {data} = await postData(
          `${BASE_URL}${SIGN_PAYLOAD}`,
          {payload: payload},
          options,
        );

        signedPayload.current = data.signedPayload;
        initializeJusPaySdk(payload);
      } catch (error) {
        console.log(error);
        handleApiError(error);
      }
    }
  };

  const initializeJusPaySdk = (signaturePayload) => {
    const initiatePayload = {
      requestId: confirmationList[0].transaction_id,
      service: 'in.juspay.hyperpay',
      payload: {
        action: 'initiate',
        clientId: Config.CLIENT_ID.toUpperCase(),
        merchantId: Config.MERCHANT_ID.toUpperCase(),
        merchantKeyId: Config.MERCHANT_KEY_ID,
        signature: signedPayload.current,
        signaturePayload,
        environment: 'sandbox',
      },
    };
    console.log('-----------initiate payload----------');
    console.log(JSON.stringify(initiatePayload, undefined, 4));
    HyperSdkReact.initiate(JSON.stringify(initiatePayload));
  };

  useEffect(() => {
    initializeOrder()
      .then(() => {
        HyperSdkReact.createHyperServices();
      })
      .catch(() => {});

    const hyperEventSubscription = DeviceEventEmitter.addListener('HyperEvent', onHyperEvent);

    BackHandler.addEventListener('hardwareBackPress', () => {
      return !HyperSdkReact.isNull() && HyperSdkReact.onBackPressed();
    });

    return () => {
      hyperEventSubscription.remove();
    }
  }, []);

  return (
    <View
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <Header title={heading} navigation={navigation} />
      {initializeOrderRequested ? (
        <PaymentSkeleton />
      ) : (
        <>
          <View style={styles.container}>
            <Text style={styles.text}>{addressTitle}</Text>
            <View style={styles.addressContainer}>
              <Text>
                {selectedAddress.address.street},{' '}
                {selectedAddress.address.locality},{' '}
                {selectedAddress.address.city}, {selectedAddress.address.state}{' '}
                - {selectedAddress.address.area_code}
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
                      isSelected={i === selectedPaymentOption}
                      borderWidth={1}
                      buttonSize={12}
                      buttonInnerColor={colors.accentColor}
                      buttonOuterColor={colors.accentColor}
                      buttonOuterSize={20}
                      onPress={index => {
                        setSelectedPaymentOption(index);
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
              loading={confirmOrderRequested}
            />
          </View>
        </>
      )}
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
