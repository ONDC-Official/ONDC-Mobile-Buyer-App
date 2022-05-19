import HyperSdkReact from 'hyper-sdk-react';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  DeviceEventEmitter,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Config from 'react-native-config';
import {Card, CheckBox, Divider} from 'react-native-elements';
import {Text, withTheme} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import ContainButton from '../../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../../locales/i18n';
import {appStyles} from '../../../../styles/styles';
import {alertWithOneButton} from '../../../../utils/alerts';
import {getData, postData} from '../../../../utils/api';
import {clearAllData} from '../../../../redux/actions';
import {
  BASE_URL,
  CONFIRM_ORDER,
  INITIALIZE_ORDER,
  ON_CONFIRM_ORDER,
  ON_INITIALIZE_ORDER,
  SIGN_PAYLOAD,
} from '../../../../utils/apiUtilities';
import {PAYMENT_METHODS} from '../../../../utils/Constants';
import {PAYMENT_OPTIONS} from '../../../../utils/Constants';
import {showToastWithGravity} from '../../../../utils/utils';
import Header from '../addressPicker/Header';
import PaymentSkeleton from './PaymentSkeleton';
import FastImage from 'react-native-fast-image';

const heading = strings('main.cart.checkout');
const buttonTitle = strings('main.cart.next');
const addressTitle = strings('main.cart.address');
const paymentOptionsTitle = strings('main.cart.payment_options');
const ok = strings('main.product.ok_label');
const message = strings('main.cart.order_placed_message');
const poweredBy = strings('main.product.powered_by_label');

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
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [initializeOrderRequested, setInitializeOrderRequested] =
    useState(false);
  const [confirmOrderRequested, setConfirmOrderRequested] = useState(false);
  const {handleApiError} = useNetworkErrorHandling();
  const [orders, setOrders] = useState(null);
  const [total, setTotal] = useState(null);
  const [fulFillment, setFulFillment] = useState(null);
  const signedPayload = useRef(null);
  const timeStamp = useRef(null);

  const onOrderSuccess = () => {
    dispatch(clearAllData());
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

        setOrders(data);
        const ordersArray = data.filter(one => !one.hasOwnProperty('error'));
        const breakupItem = ordersArray[0].message.order.quote.breakup.find(
          one => one.title === 'FULFILLMENT',
        );
        breakupItem
          ? setFulFillment(breakupItem.price.value)
          : setFulFillment(null);
        setTotal(ordersArray[0].message.order.quote.price.value);
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(order);

      setInitializeOrderRequested(false);
    }, 10000);
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
        alertWithOneButton(null, message, ok, onOrderSuccess);
      } else {
        showToastWithGravity(strings('network_error.something_went_wrong'));
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
        showToastWithGravity(strings('network_error.something_went_wrong'));
        setInitializeOrderRequested(false);
      }
    } catch (error) {
      console.log(error);
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
      amount: String(9),
      timestamp: timeStamp.current,
      return_url: 'https://sandbox.juspay.in/end',
    };
    console.log('------------orderDetails payload---------');
    console.log(JSON.stringify(orderDetails, undefined, 4));

    const processPayload = {
      requestId: confirmationList[0].transaction_id,
      service: 'in.juspay.hyperpay',
      payload: {
        action: 'paymentPage',
        merchantId: Config.MERCHANT_ID.toUpperCase(),
        clientId: Config.CLIENT_ID.toLowerCase(),
        orderId: confirmationList[0].transaction_id,
        amount: String(9),
        customerId: uid,
        customerEmail: selectedAddress.descriptor.email,
        customerMobile: selectedAddress.descriptor.phone,
        orderDetails: JSON.stringify(orderDetails),
        signature: signedPayload.current,
        merchantKeyId: Config.MERCHANT_KEY_ID,
        language: 'english',
        environment: 'sandbox',
      },
    };
    console.log('--------process payload-----------');
    console.log(JSON.stringify(processPayload));

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
        processPayment()
          .then(() => {})
          .catch(() => {});
        break;

      case 'process_result':
        console.log(JSON.stringify(data.payload, undefined, 4));
        if (data.payload.hasOwnProperty('status')) {
          switch (data.payload.status.toUpperCase()) {
            case 'CHARGED':
              confirmOrder(PAYMENT_METHODS.JUSPAY)
                .then(() => {})
                .catch(() => {});
              break;

            case 'AUTHENTICATION_FAILED':
              showToastWithGravity('Please verify the details and try again');
              setInitializeOrderRequested(false);
              break;

            case 'AUTHORIZATION_FAILED':
              showToastWithGravity(
                'Bank is unable to process your request at the moment',
              );
              setInitializeOrderRequested(false);
              break;

            case 'JUSPAY_DECLINED':
              showToastWithGravity(
                'Unable to process your request at the moment please try again',
              );
              setInitializeOrderRequested(false);
              break;

            case 'AUTHORIZING':
              showToastWithGravity('Waiting for the bank to confirm');
              setInitializeOrderRequested(false);
              break;

            case 'PENDING_VBV':
              showToastWithGravity('Transaction pending');
              setInitializeOrderRequested(false);
              break;
          }
        } else {
          showToastWithGravity('Something went wrong.Please try again');
        }
        break;

      default:
        console.log('Unknown Event', data);
    }
  };

  const confirmOrder = async method => {
    try {
      if (orders && orders.length > 0) {
        const errorObj = orders.find(one => one.hasOwnProperty('error'));

        if (!errorObj) {
          const payload = orders.map(item => {
            return {
              context: {
                transaction_id: item.context.transaction_id,
              },
              message: {
                payment: {
                  ...{
                    paid_amount: item.message.order.payment.params.amount,
                    transaction_id: item.context.transaction_id,
                  },
                  ...method,
                },
              },
            };
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
          showToastWithGravity(strings('network_error.something_went_wrong'));
          console.log('i am running');
        }
      } else {
        showToastWithGravity(strings('network_error.something_went_wrong'));
        console.log('ites runnings');
      }
    } catch (error) {
      console.log(error);

      handleApiError(error);
      setConfirmOrderRequested(false);
    }
  };

  const placeOrder = async () => {
    setConfirmOrderRequested(true);
    const options = {
      headers: {Authorization: `Bearer ${token}`},
    };
    if (selectedPaymentOption === PAYMENT_METHODS.COD.name) {
      await confirmOrder(PAYMENT_METHODS.COD);
    } else {
      try {
        timeStamp.current = String(new Date().getTime());

        const payload = JSON.stringify({
          merchant_id: Config.MERCHANT_ID.toUpperCase(),
          customer_id: uid,
          order_id: confirmationList[0].transaction_id,
          customer_phone: selectedAddress.descriptor.phone,
          customer_email: selectedAddress.descriptor.email,
          amount: String(9),
          timestamp: timeStamp.current,
          return_url: 'https://sandbox.juspay.in/end',
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

  const initializeJusPaySdk = signaturePayload => {
    const initiatePayload = {
      requestId: confirmationList[0].transaction_id,
      service: 'in.juspay.hyperpay',
      payload: {
        action: 'initiate',
        clientId: Config.CLIENT_ID.toLowerCase(),
        merchantId: Config.MERCHANT_ID.toUpperCase(),
        merchantKeyId: Config.MERCHANT_KEY_ID,
        signature: signedPayload.current,
        signaturePayload,
        environment: 'sandbox',
      },
    };
    console.log('-----------initiate payload----------');
    console.log(JSON.stringify(initiatePayload));
    HyperSdkReact.initiate(JSON.stringify(initiatePayload));
  };

  useEffect(() => {
    initializeOrder()
      .then(() => {
        HyperSdkReact.createHyperServices();
      })
      .catch(() => {});

    const hyperEventSubscription = DeviceEventEmitter.addListener(
      'HyperEvent',
      onHyperEvent,
    );

    BackHandler.addEventListener('hardwareBackPress', () => {
      return !HyperSdkReact.isNull() && HyperSdkReact.onBackPressed();
    });

    return () => {
      hyperEventSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <Header title={heading} navigation={navigation} />
        {initializeOrderRequested ? (
          <PaymentSkeleton />
        ) : (
          <>
            <View style={styles.container}>
              <Card containerStyle={styles.containerStyle}>
                <FlatList
                  data={confirmationList}
                  renderItem={({item}) => {
                    const element = cartItems.find(one => one.id === item.id);

                    return element ? (
                      <>
                        <View style={styles.priceContainer}>
                          <Text>{element.descriptor.name}</Text>
                          <Text>₹{element.price.value * element.quantity}</Text>
                        </View>
                        <Divider />
                      </>
                    ) : null;
                  }}
                />
                {fulFillment && (
                  <>
                    <View style={styles.priceContainer}>
                      <Text>FULFILLMENT</Text>
                      <Text style={styles.fulfillment}>₹{fulFillment}</Text>
                    </View>
                    <Divider />
                  </>
                )}

                {total && (
                  <View style={styles.priceContainer}>
                    <Text>Total Payable</Text>
                    <Text style={styles.fulfillment}>₹{total}</Text>
                  </View>
                )}
              </Card>
              <Card containerStyle={styles.containerStyle}>
                <Text style={styles.text}>{addressTitle}</Text>

                <Text>
                  {selectedAddress.address.street},{' '}
                  {selectedAddress.address.locality},{' '}
                  {selectedAddress.address.city},{' '}
                  {selectedAddress.address.state} -{' '}
                  {selectedAddress.address.area_code}
                </Text>
              </Card>
              {orders && (
                <Card containerStyle={styles.containerStyle}>
                  <Text style={styles.text}>{paymentOptionsTitle}</Text>

                  <View style={styles.paymentOptions}>
                    {PAYMENT_OPTIONS.map((option, index) => (
                      <CheckBox
                        key={option.value}
                        title={
                          <View style={styles.titleStyle}>
                            <Text style={styles.textStyle}>{option.label}</Text>
                            {option.label === 'Prepaid' && (
                              <View style={styles.juspayContainer}>
                                <Text>{poweredBy}</Text>
                                <FastImage
                                  source={{
                                    uri: 'https://imgee.s3.amazonaws.com/imgee/a0baca393d534736b152750c7bde97f1.png',
                                  }}
                                  style={styles.image}
                                  resizeMode={'contain'}
                                />
                              </View>
                            )}
                          </View>
                        }
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={option.value === selectedPaymentOption}
                        onPress={() => setSelectedPaymentOption(option.value)}
                      />
                    ))}
                  </View>
                </Card>
              )}
            </View>

            {orders && (
              <View style={styles.buttonContainer}>
                <ContainButton
                  title={'Proceed'}
                  onPress={placeOrder}
                  loading={confirmOrderRequested}
                />
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default withTheme(Payment);

const styles = StyleSheet.create({
  container: {padding: 15},
  text: {fontSize: 18, fontWeight: '600'},
  buttonContainer: {width: 300, alignSelf: 'center'},
  paymentOptions: {marginVertical: 10},
  labelStyle: {fontSize: 16, fontWeight: '400'},
  buttonStyle: {marginBottom: 10},
  titleStyle: {marginLeft: 8},
  textStyle: {fontSize: 16, fontWeight: '700'},
  juspayContainer: {flexDirection: 'row', alignItems: 'center'},
  image: {height: 15, width: 80},
  containerStyle: {marginHorizontal: 0},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});
