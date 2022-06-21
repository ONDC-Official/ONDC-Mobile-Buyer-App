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
  const error = useRef(null);
  const {
    state: {token, uid},
  } = useContext(AuthContext);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [initializeOrderRequested, setInitializeOrderRequested] =
    useState(false);
  const [confirmOrderRequested, setConfirmOrderRequested] = useState(false);
  const {handleApiError} = useNetworkErrorHandling();
  const refOrders = useRef();
  const [quote, setQuote] = useState(null);
  const signedPayload = useRef(null);
  const timeStamp = useRef(null);
  const parentOrderId = useRef(null);

  /**
   * function gets executes when order get placed
   */
  const onOrderSuccess = () => {
    dispatch(clearAllData());
    dispatch(clearFilters());
    navigation.navigate('Dashboard', {screen: 'Orders'});
  };

  /**
   * function request initialize order
   * @param messageIdArray:array of message id's
   * @returns {Promise<void>}
   */
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
        const ordersArray = data.filter(one => !one.hasOwnProperty('error'));
        refOrders.current = data;
        error.current = refOrders.current.find(item =>
          item.hasOwnProperty('error'),
        );
        if (ordersArray.length > 0) {
          let breakup = [];
          let price = [];
          let total = 0;
          ordersArray.forEach(one => {
            breakup = breakup.concat(one.message.order.quote.breakup);
            price.push(one.message.order.quote.price);
            total += Number(one.message.order.quote.price.value);
          });
          setQuote({total, breakup, price});
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

  /**
   * function request confirm order
   * @param messageIdArray:array of message id's
   * @returns {Promise<void>}
   */
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

        error.current = data.find(item => item.hasOwnProperty('error'));
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
          let billingInfo = {};

          if (selectedBillingAddress.descriptor) {
            billingInfo.phone = selectedBillingAddress.descriptor.phone;
            billingInfo.name = selectedBillingAddress.descriptor.name;
            billingInfo.email = selectedBillingAddress.descriptor.email;
          } else {
            billingInfo.phone = selectedBillingAddress.phone;
            billingInfo.name = selectedBillingAddress.name;
            billingInfo.email = selectedBillingAddress.email;
          }

          billingInfo.address =  {
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
          };

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
              billing_info: billingInfo,
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
          parentOrderId.current = item.context.parent_order_id;
          messageIds.push(item.context.message_id);
        }
      });
      if (messageIds.length > 0) {
        onInitializeOrder(messageIds);
      } else {
        showToastWithGravity(t('error.no_data_found'));
        setInitializeOrderRequested(false);
      }
    } catch (err) {
      error.current = err;
      handleApiError(err);
      setInitializeOrderRequested(false);
    }
  };

  /**
   * function used to process hyper sdk
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
        order_id: parentOrderId.current,
        customer_phone: selectedAddress.descriptor.phone,
        customer_email: selectedAddress.descriptor.email,
        amount: Config.ENV === 'dev' ? String(9) : quote.total,
        timestamp: timeStamp.current,
        return_url: 'https://sandbox.juspay.in/end',
      };

      const processPayload = {
        requestId: parentOrderId.current,
        service: 'in.juspay.hyperpay',
        payload: {
          action: 'paymentPage',
          merchantId: Config.MERCHANT_ID.toUpperCase(),
          clientId: Config.CLIENT_ID.toLowerCase(),
          orderId: parentOrderId.current,
          amount: Config.ENV === 'dev' ? String(9) : quote.total,
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
              showToastWithGravity(
                t('main.cart.payment.authentication_failed'),
              );
              setInitializeOrderRequested(false);
              break;

            case 'AUTHORIZATION_FAILED':
              showToastWithGravity(t('main.cart.payment.authorization_failed'));
              setInitializeOrderRequested(false);
              break;

            case 'JUSPAY_DECLINED':
              showToastWithGravity(t('main.cart.payment.juspay_declined'));
              setInitializeOrderRequested(false);
              break;

            case 'AUTHORIZING':
              showToastWithGravity(t('main.cart.payment.authorizing'));
              setInitializeOrderRequested(false);
              break;

            case 'PENDING_VBV':
              showToastWithGravity(t('main.cart.payment.pending_vbv'));
              setInitializeOrderRequested(false);
              break;
          }
        } else {
          showToastWithGravity(t('network_error.something_went_wrong'));
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
   * function request signpost and initialize hyper sdk
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
        order_id: parentOrderId.current,
        customer_phone: selectedAddress.descriptor.phone,
        customer_email: selectedAddress.descriptor.email,
        amount: Config.ENV === 'dev' ? String(9) : quote.total,
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
   * @param signaturePayload:payload
   */
  const initializeJusPaySdk = signaturePayload => {
    const initiatePayload = {
      requestId: parentOrderId.current,
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
            title={t('main.cart.payment.title')}
            navigation={navigation}
          />
          {initializeOrderRequested ? (
            <PaymentSkeleton />
          ) : (
            <>
              <View style={styles.container}>
                {quote && (
                  <Card containerStyle={styles.itemsContainerStyle}>
                    <FlatList
                      data={quote.breakup}
                      renderItem={({item}) => {
                        return (
                          <>
                            <View style={styles.priceContainer}>
                              <Text style={styles.price}>{item.title}</Text>
                              <Text>₹{item.price.value}</Text>
                            </View>
                            <Divider />
                          </>
                        );
                      }}
                    />

                    <View style={styles.priceContainer}>
                      <Text>{t('main.cart.total_payable')}</Text>
                      <Text style={styles.fulfillment}>₹{quote.total}</Text>
                    </View>
                  </Card>
                )}
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
                    title={t('main.cart.payment.place_order')}
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
            {t('main.cart.payment.processing_label')}{' '}
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
