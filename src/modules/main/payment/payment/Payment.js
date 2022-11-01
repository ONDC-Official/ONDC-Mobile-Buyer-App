import HyperSdkReact from 'hyper-sdk-react';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  NativeEventEmitter,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Config from 'react-native-config';
import {Card, CheckBox, Divider} from 'react-native-elements';
import {Text, withTheme} from 'react-native-elements';
import RNEventSource from 'react-native-event-source';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import ContainButton from '../../../../components/button/ContainButton';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {clearAllData} from '../../../../redux/actions';
import {clearFilters} from '../../../../redux/filter/actions';
import {appStyles} from '../../../../styles/styles';
import {alertWithOneButton} from '../../../../utils/alerts';
import {getData, postData} from '../../../../utils/api';
import {
  SERVER_URL,
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
  const [inItMessageIds, setInItMessageIds] = useState(null);
  const [confirmMessageIds, setConfirmMessageIds] = useState(null);
  const {handleApiError} = useNetworkErrorHandling();
  const eventSources = useRef(null);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const {latitude, longitude, pinCode} = useSelector(
    ({locationReducer}) => locationReducer,
  );
  const refOrders = useRef();
  const total = useRef(0);
  const breakup = useRef(null);
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
   * @param id:message id
   * @returns {Promise<void>}
   */
  const onInitializeOrder = async id => {
    try {
      const {data} = await getData(
        `${SERVER_URL}${ON_INITIALIZE_ORDER}messageIds=${id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      console.log(JSON.stringify(data[0], undefined, 4));
      if (data[0].hasOwnProperty('error')) {
        error.current = data[0];
      } else {
        let breakups = breakup.current ? breakup.current.slice() : [];
        let price = [];
        breakups = breakups.concat(data[0].message.order.quote.breakup);
        breakup.current = breakups;
        console.log(breakups);
        price.push(data[0].message.order.quote.price);
        total.current =
          total.current + Number(data[0].message.order.quote.price.value);
        setQuote({price});
        if (refOrders.current) {
          let newArray = refOrders.current.slice();
          newArray.push(data[0]);
          refOrders.current = newArray;
        } else {
          refOrders.current = data;
        }
      }
      setInitializeOrderRequested(false);
      console.log(refOrders.current);
    } catch (err) {
      console.log(err);
      handleApiError(err);
    }
  };

  /**
   * function request confirm order
   * @param id:message id
   * @returns {Promise<void>}
   */
  const onConfirmOrder = async id => {
    try {
      const {data} = await getData(
        `${SERVER_URL}${ON_CONFIRM_ORDER}messageIds=${id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      console.log('///confirm order/////');
      console.log(JSON.stringify(data, undefined, 4));
    } catch (err) {
      handleApiError(err);

      setConfirmOrderRequested(false);
    }
  };

  /**
   * function request initialize order
   * @returns {Promise<void>}
   */
  const initializeOrder = async () => {
    try {
      breakup.current = null;
      total.current = 0;
      setInitializeOrderRequested(true);
      let payload = [];
      let providerIdArray = [];

      confirmationList.forEach(item => {
        const index = providerIdArray.findIndex(
          one => one === item.provider.id,
        );
        const object = cartItems.find(one => one.id === item.id);
        if (index > -1) {
          let itemObj = {
            id: item.id,
            quantity: {
              count: object.quantity,
            },
            product: object,
            bpp_id: item.bpp_id,
            provider: {
              id: item.provider.id,
              locations: item.provider.locations,
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

          billingInfo.address = {
            door: selectedBillingAddress.address.door
              ? selectedBillingAddress.address.door
              : selectedBillingAddress.address.street,
            country: 'IND',
            city: selectedBillingAddress.address.city,
            street: selectedBillingAddress.address.street,
            areaCode: selectedBillingAddress.address.areaCode,
            state: selectedBillingAddress.address.state,
            building: selectedBillingAddress.address.building
              ? selectedBillingAddress.address.building
              : selectedBillingAddress.address.street,
          };

          let payloadObj = {
            context: {
              transaction_id: item.transaction_id,
              city: object.city,
              state: object.state,
            },
            message: {
              items: [
                {
                  id: item.id,
                  quantity: {
                    count: object.quantity,
                  },
                  product: object,
                  bpp_id: item.bpp_id,
                  provider: {
                    id: item.provider ? item.provider.id : item.id,
                    locations: item.provider.locations,
                  },
                },
              ],
              billing_info: billingInfo,
              delivery_info: {
                type: 'Delivery',
                name: selectedAddress.descriptor.name,
                phone: selectedAddress.descriptor.phone,
                email: selectedAddress.descriptor.email,
                location: {
                  gps: selectedAddress.gps,
                  address: {
                    door: selectedAddress.address.door
                      ? selectedAddress.address.door
                      : selectedAddress.address.street,
                    country: 'IND',
                    city: selectedAddress.address.city,
                    street: selectedAddress.address.street,
                    areaCode: selectedAddress.address.areaCode,
                    state: selectedAddress.address.state,
                    building: selectedAddress.address.building
                      ? selectedAddress.address.building
                      : selectedAddress.address.street,
                  },
                },
              },

              payment: {type: 'POST-FULFILLMENT'},
            },
          };

          payload.push(payloadObj);
          providerIdArray.push(item.provider.id);
        }
      });

      const {data} = await postData(
        `${SERVER_URL}${INITIALIZE_ORDER}`,
        payload,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      let messageIds = [];

      data.forEach(item => {
        if (item.message.ack.status === 'ACK') {
          parentOrderId.current = item.context.parent_order_id;
          messageIds.push(item.context.message_id);
          console.log(messageIds);
        }
      });
      if (messageIds.length > 0) {
        setInItMessageIds(messageIds);
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
        amount: Config.ENV === 'dev' ? String(9) : String(9),
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
          amount: Config.ENV === 'dev' ? String(9) : String(9),
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
          console.log(orderList);
          const payload = orderList.map(item => {
            const object = cartItems.find(
              one => one.id === item.message.order.items[0].id,
            );
            return {
              context: {
                transaction_id: item.context.parent_order_id,
                parent_order_id: item.context.parent_order_id,
                city: object.city,
                state: object.state,
              },
              message: {
                quote: item.message.order.quote,
                payment: {
                  ...{
                    paid_amount: total.current,
                    transaction_id: item.context.transaction_id,
                  },
                  ...method,
                },

                providers: {
                  id: item.message?.order?.provider?.id,
                  locations: [item.message?.order?.provider_location?.id],
                },
              },
            };
          });

          console.log(JSON.stringify(payload, undefined, 4));

          const {data} = await postData(
            `${SERVER_URL}${CONFIRM_ORDER}`,
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
          if (messageIds.length > 0) {
            setConfirmMessageIds(messageIds);
          }
        } else {
          showToastWithGravity(t('network_error.something_went_wrong'));
        }
      } else {
        showToastWithGravity(t('network_error.something_went_wrong'));
      }
    } catch (err) {
      console.log(err);
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
        amount: Config.ENV === 'dev' ? String(9) : String(9),
        timestamp: timeStamp.current,
        return_url: 'https://sandbox.juspay.in/end',
      });

      const {data} = await postData(
        `${SERVER_URL}${SIGN_PAYLOAD}`,
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

  const removeInitEvent = () => {
    if (eventSources.current) {
      eventSources.current.forEach(eventSource => {
        eventSource.removeAllListeners();
        eventSource.close();
        setRequestInProgress(false);
      });
      eventSources.current = null;
      setRequestInProgress(false);
    }
  };

  const removeEvent = sources => {
    if (sources) {
      sources.forEach(source => {
        source.removeAllListeners();
        source.close();
      });
      sources = null;
      setConfirmOrderRequested(false);
      alertWithOneButton(
        null,
        t('main.cart.order_placed_message'),
        t('main.product.ok_label'),
        onOrderSuccess,
      );
      setConfirmMessageIds(null);
    }
  };

  useEffect(() => {
    initializeOrder()
      .then(() => {
        HyperSdkReact.createHyperServices();
      })
      .catch(() => {});

    const eventEmitter = new NativeEventEmitter(HyperSdkReact);
    const hyperEventSubscription = eventEmitter.addListener(
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

  useEffect(() => {
    let timer = null;
    if (inItMessageIds) {
      if (!timer) {
        timer = setTimeout(removeInitEvent, 20000);
      }
      let sources = inItMessageIds.map(messageId => {
        return new RNEventSource(
          `${SERVER_URL}/clientApis/events?messageId=${messageId}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
      });
      eventSources.current = sources;
      setRequestInProgress(true);
      sources.forEach(eventSource => {
        eventSource.addEventListener('on_init', event => {
          const data = JSON.parse(event.data);

          onInitializeOrder(data.messageId)
            .then(() => {
              placeOrder()
                .then(() => {})
                .catch(() => {});
            })
            .catch(() => {});
        });
      });
    }

    return () => {
      removeInitEvent();
      clearTimeout(timer);
    };
  }, [inItMessageIds]);

  useEffect(() => {
    let sources = null;
    let timer = null;
    if (confirmMessageIds) {
      console.log(confirmMessageIds);
      sources = confirmMessageIds.map(messageId => {
        return new RNEventSource(
          `${SERVER_URL}/clientApis/events?messageId=${messageId}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
      });
      if (!timer) {
        timer = setTimeout(removeEvent, 20000, sources);
      }
      sources.forEach(eventSource => {
        eventSource.addEventListener('on_confirm', event => {
          const data = JSON.parse(event.data);
          onConfirmOrder(data.messageId)
            .then(() => {})
            .catch(() => {});
        });
      });
    }

    return () => {
      removeEvent(sources);
      clearTimeout(timer);
    };
  }, [confirmMessageIds]);

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
                {breakup.current && (
                  <Card containerStyle={styles.itemsContainerStyle}>
                    <FlatList
                      data={breakup.current}
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

                    {total.current && (
                      <View style={styles.priceContainer}>
                        <Text>{t('main.cart.total_payable')}</Text>
                        <Text style={styles.fulfillment}>₹{total.current}</Text>
                      </View>
                    )}
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
                      removeInitEvent();
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
