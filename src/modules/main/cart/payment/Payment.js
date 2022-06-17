import HyperSdkReact from 'hyper-sdk-react';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
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
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import ContainButton from '../../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {clearAllData} from '../../../../redux/actions';
import {clearFilters} from '../../../../redux/filter/actions';
import {appStyles} from '../../../../styles/styles';
import {alertWithOneButton} from '../../../../utils/alerts';
import {getData, postData} from '../../../../utils/api';
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
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {selectedAddress, selectedBillingAddress, confirmationList} = params;
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const error = useRef(null);
  const {
    state: {token, uid},
  } = useContext(AuthContext);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [initializeOrderRequested, setInitializeOrderRequested] =
    useState(false);
  const [confirmOrderRequested, setConfirmOrderRequested] = useState(false);
  const {handleApiError} = useNetworkErrorHandling();
  const [orders, setOrders] = useState(null);
  const refOrders = useRef();
  const [total, setTotal] = useState(null);
  const [fulFillment, setFulFillment] = useState(null);
  const signedPayload = useRef(null);
  const timeStamp = useRef(null);

  const onOrderSuccess = () => {
    dispatch(clearAllData());
    dispatch(clearFilters());
    navigation.navigate('Dashboard', {screen: 'Orders'});
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
        refOrders.current = data;
        const e = refOrders.current.find(item => item.hasOwnProperty('error'));
        error.current = e;

        if (ordersArray.length > 0) {
          const breakupItem = ordersArray[0].message.order.quote.breakup.find(
            one => one.title === 'FULFILLMENT',
          );
          breakupItem
            ? setFulFillment(breakupItem.price.value)
            : setFulFillment(null);
          setTotal(ordersArray[0].message.order.quote.price.value);
        }
      } catch (err) {
        handleApiError(err);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(order);
      if (error.current) {
        showToastWithGravity(error.current.error.message);
      }
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

        const e = data.find(item => item.hasOwnProperty('error'));
        error.current = e;
      } catch (err) {
        handleApiError(err);

        setConfirmOrderRequested(false);
      }
    }, 2000);
    setTimeout(() => {
      clearInterval(order);
      if (!error.current) {
        setConfirmOrderRequested(false);
        alertWithOneButton(
          null,
          t('main.cart.order_placed_message'),
          t('main.product.ok_label'),
          onOrderSuccess,
        );
      } else {
        showToastWithGravity(error.current.error.message);
        setConfirmOrderRequested(false);
      }
    }, 10000);
  };

  /**
   * function request initialize order
   * @returns {Promise<void>}
   */
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
                  door: selectedBillingAddress.address.door
                    ? selectedBillingAddress.address.door
                    : selectedBillingAddress.address.street,
                  country: 'IND',
                  city: selectedBillingAddress.address.city,
                  street: selectedBillingAddress.address.street,
                  area_code: selectedBillingAddress.address.areaCode,
                  state: selectedBillingAddress.address.state,
                  building: selectedBillingAddress.address.building
                    ? selectedBillingAddress.address.building
                    : selectedBillingAddress.address.street,
                },
                phone: selectedBillingAddress.descriptor
                  ? selectedBillingAddress.descriptor.phone
                  : selectedBillingAddress.phone,
                name: selectedBillingAddress.descriptor
                  ? selectedBillingAddress.descriptor.name
                  : selectedBillingAddress.name,
                email: selectedBillingAddress.descriptor
                  ? selectedBillingAddress.descriptor.email
                  : selectedBillingAddress.email,
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
                    area_code: selectedAddress.address.areaCode,
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
        showToastWithGravity('No Data Found');
        setInitializeOrderRequested(false);
      }
    } catch (err) {
      error.current = err;
      handleApiError(err);
      setInitializeOrderRequested(false);
    }
  };

  /**
   * function used to process hypersdk
   * @returns {Promise<void>}
   */
  const processPayment = async () => {
    setConfirmOrderRequested(true);

    if (selectedPaymentOption === PAYMENT_METHODS.COD.name) {
      await confirmOrder(PAYMENT_METHODS.COD);
    } else {
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

      if (await HyperSdkReact.isInitialised()) {
        HyperSdkReact.process(JSON.stringify(processPayload));
      }
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
        const payload = data.payload || {};
        break;

      case 'process_result':
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

  /**
   * function request confirm order
   * @param method:payment method selected by user
   * @returns {Promise<void>}
   */
  const confirmOrder = async method => {
    try {
      const orderList = refOrders.current;
      if (orderList && orderList.length > 0) {
        const errorObj = orderList.find(one => one.hasOwnProperty('error'));

        if (!errorObj) {
          const payload = orderList.map(item => {
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
          showToastWithGravity(t('network_error.something_went_wrong'));
        }
      } else {
        showToastWithGravity(t('network_error.something_went_wrong'));
      }
    } catch (err) {
      handleApiError(err);
      setConfirmOrderRequested(false);
    }
  };

  /**
   * function request signpayload and initialize hypersdk
   */
  const placeOrder = async () => {
    const options = {
      headers: {Authorization: `Bearer ${token}`},
    };

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

      const {data} = await postData(
        `${BASE_URL}${SIGN_PAYLOAD}`,
        {payload: payload},
        options,
      );

      signedPayload.current = data.signedPayload;
      initializeJusPaySdk(payload);
    } catch (err) {
      handleApiError(err);
    }
  };

  /**
   * function used to initialize hypersdk
   */
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
    HyperSdkReact.initiate(JSON.stringify(initiatePayload));
  };

  useEffect(() => {
    initializeOrder()
      .then(() => {
        console.log('Its errror');
        HyperSdkReact.createHyperServices();
        placeOrder()
          .then(() => {})
          .catch(() => {});
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
      {!confirmOrderRequested ? (
        <View style={appStyles.container}>
          <Header
            title={'Payment & Order Confirmation'}
            navigation={navigation}
          />
          {initializeOrderRequested ? (
            <PaymentSkeleton />
          ) : (
            <>
              <View style={styles.container}>
                <Card containerStyle={styles.itemsContainerStyle}>
                  <FlatList
                    data={confirmationList}
                    renderItem={({item}) => {
                      const element = cartItems.find(one => one.id == item.id);

                      return element ? (
                        <>
                          <View style={styles.priceContainer}>
                            <Text style={styles.price}>
                              {element.descriptor.name}
                            </Text>
                            <Text>
                              ₹{element.price.value * element.quantity}
                            </Text>
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
                <Card containerStyle={styles.addressCard}>
                  <Text style={styles.text}>{t('main.cart.address')}</Text>

                  <Text style={styles.titleStyle}>
                    {selectedAddress.address.street},{' '}
                    {selectedAddress.address.locality},{' '}
                    {selectedAddress.address.city},{' '}
                    {selectedAddress.address.state} -{' '}
                    {selectedAddress.address.areaCode}
                  </Text>
                </Card>

                {!error.current && (
                  <Card containerStyle={styles.cardContainerStyle}>
                    <Text style={styles.text}>
                      {t('main.cart.payment_options')}
                    </Text>

                    <View style={styles.paymentOptions}>
                      {PAYMENT_OPTIONS.map((option, index) => (
                        <CheckBox
                          key={option.value}
                          title={
                            <View style={styles.titleStyle}>
                              <Text style={styles.textStyle}>
                                {option.label}
                              </Text>
                              {option.label === 'Prepaid' && (
                                <View style={styles.juspayContainer}>
                                  <Text>
                                    {t('main.product.powered_by_label')}
                                  </Text>
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
                          containerStyle={[
                            styles.checkBoxcontainerStyle,
                            {
                              backgroundColor: colors.backgroundColor,
                            },
                          ]}
                          wrapperStyle={styles.wrapperStyle}
                          checked={option.value === selectedPaymentOption}
                          onPress={() => setSelectedPaymentOption(option.value)}
                        />
                      ))}
                    </View>
                  </Card>
                )}
              </View>

              {!error.current && (
                <View style={styles.buttonContainer}>
                  <ContainButton
                    title={'Place Order'}
                    onPress={() => {
                      processPayment()
                        .then(() => {})
                        .catch(() => {});
                    }}
                    loading={confirmOrderRequested}
                  />
                </View>
              )}
            </>
          )}
        </View>
      ) : (
        <View style={[appStyles.container, styles.processing]}>
          <ActivityIndicator size={30} color={colors.accentColor} />
          <Text style={[styles.processingText, {color: colors.accentColor}]}>
            Processing{' '}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default withTheme(Payment);

const styles = StyleSheet.create({
  container: {padding: 10},
  text: {fontSize: 18, fontWeight: '600', paddingLeft: 10},
  buttonContainer: {width: 300, alignSelf: 'center'},
  paymentOptions: {marginVertical: 10},
  labelStyle: {fontSize: 16, fontWeight: '400'},
  buttonStyle: {marginBottom: 10},
  titleStyle: {marginLeft: 8},
  textStyle: {fontSize: 16, fontWeight: '700'},
  juspayContainer: {flexDirection: 'row', alignItems: 'center'},
  image: {height: 15, width: 80},
  itemsContainerStyle: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  cardContainerStyle: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  price: {flexShrink: 1},
  wrapperStyle: {margin: 0},
  checkBoxcontainerStyle: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
  },
  processing: {alignItems: 'center', justifyContent: 'center'},
  processingText: {fontSize: 18, fontWeight: '700', marginTop: 20},
  addressCard: {
    paddingVertical: 10,
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 0,
  },
});
