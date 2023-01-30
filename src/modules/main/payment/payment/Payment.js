import HyperSdkReact from 'hyper-sdk-react';
import React, {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  NativeEventEmitter,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import {Button, Card, Text, withTheme} from 'react-native-paper';
import RNEventSource from 'react-native-event-source';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';

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
import {showToastWithGravity} from '../../../../utils/utils';
import PaymentSkeleton from './components/PaymentSkeleton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BreakDown from './components/BreakDown';
import Address from '../../order/components/Address';
import useConfirmOrder from './hooks/useConfirmOrder';

/**
 * Component to payment screen in application
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const Payment = ({
  navigation,
  theme,
  route: {
    params: {deliveryAddress, billingAddress, confirmationList},
  },
}) => {
  const {colors} = theme;
  const dispatch = useDispatch();
  const error = useRef(null);
  const {token, uid} = useSelector(({authReducer}) => authReducer);
  const {confirmOrder, confirmOrderRequested} = useConfirmOrder();
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [initializeOrderRequested, setInitializeOrderRequested] =
    useState(false);
  const [inItMessageIds, setInItMessageIds] = useState(null);
  const {handleApiError} = useNetworkErrorHandling();
  const eventSources = useRef(null);
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const refOrders = useRef();
  const total = useRef(0);
  const products = useRef([]);
  const [breakDown, setBreakDown] = useState([]);
  const signedPayload = useRef(null);
  const timeStamp = useRef(null);
  const parentOrderId = useRef(null);
  const totalMessagesExpected = useRef(0);
  const totalMessagesReceived = useRef(0);

  /**
   * function request initialize order
   * @param id:message id
   * @returns {Promise<void>}
   */
  const onInitializeOrder = async id => {
    try {
      const {data} = await getData(
        `${BASE_URL}${ON_INITIALIZE_ORDER}messageIds=${id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      totalMessagesReceived.current += 1;

      if (data[0].hasOwnProperty('error')) {
        error.current = data[0];
      } else {
        const productList = products.current.concat([]);
        data[0].message.order.quote.breakup.forEach(item => {
          const productIndex = productList.findIndex(
            one => one.id === item['@ondc/org/item_id'],
          );
          if (productIndex > -1) {
            const product = productList[productIndex];
            switch (item['@ondc/org/title_type']) {
              case 'tax':
                if (product.hasOwnProperty('taxes')) {
                  product.taxes.push(item);
                } else {
                  product.taxes = [item];
                }
                break;

              case 'item':
                if (product.hasOwnProperty('items')) {
                  product.items.push(item);
                } else {
                  product.items = [item];
                }
                break;

              case 'discount':
                if (product.hasOwnProperty('discounts')) {
                  product.discounts.push(item);
                } else {
                  product.discounts = [item];
                }
                break;

              case 'packing':
                product.packings = [item];
                break;

              case 'delivery':
                product.deliveries = [item];
                break;

              case 'misc':
                product.misces = [item];
                break;
            }
          } else {
            const product = {
              id: item['@ondc/org/item_id'],
            };
            switch (item['@ondc/org/title_type']) {
              case 'tax':
                product.taxes = [item];
                break;

              case 'item':
                product.items = [item];
                break;

              case 'discount':
                product.discounts = [item];
                break;

              case 'packing':
                product.packings = [item];
                break;

              case 'delivery':
                product.deliveries = [item];
                break;

              case 'misc':
                product.misces = [item];
                break;
            }
            productList.push(product);
          }
        });
        setProducts(productList);

        total.current =
          total.current + Number(data[0].message.order.quote.price.value);
        if (refOrders.current) {
          refOrders.current.push(data[0]);
        } else {
          refOrders.current = data;
        }
      }
      setInitializeOrderRequested(false);
    } catch (err) {
      console.log(err);
      handleApiError(err);
    }
  };

  /**
   * function request initialize order
   * @returns {Promise<void>}
   */
  const initializeOrder = async () => {
    try {
      setProducts([]);
      total.current = 0;
      setInitializeOrderRequested(true);
      let payload = [];
      let providerIdArray = [];

      confirmationList.forEach(item => {
        const index = providerIdArray.findIndex(
          one => one === item.provider.id,
        );
        const product = cartItems.find(
          one => String(one.id) === String(item.id),
        );
        if (index > -1) {
          payload[index].message.items.push({
            id: item.id,
            quantity: {
              count: product.quantity,
            },
            product: product,
            bpp_id: item.bpp_id,
            provider: {
              id: item.provider.id,
              locations: item.provider.locations,
            },
          });
        } else {
          let billingInfo = {};

          if (billingAddress.descriptor) {
            billingInfo.phone = billingAddress.descriptor.phone;
            billingInfo.name = billingAddress.descriptor.name;
            billingInfo.email = billingAddress.descriptor.email;
          } else {
            billingInfo.phone = billingAddress.phone;
            billingInfo.name = billingAddress.name;
            billingInfo.email = billingAddress.email;
          }

          billingInfo.address = {
            door: billingAddress.address.door
              ? billingAddress.address.door
              : billingAddress.address.street,
            country: 'IND',
            city: billingAddress.address.city,
            street: billingAddress.address.street,
            areaCode: billingAddress.address.areaCode,
            state: billingAddress.address.state,
            building: billingAddress.address.building
              ? billingAddress.address.building
              : billingAddress.address.street,
          };

          payload.push({
            context: {
              transaction_id: item.transaction_id,
              city: product.city,
              state: product.state,
            },
            message: {
              items: [
                {
                  id: item.id,
                  quantity: {
                    count: product.quantity,
                  },
                  product: product,
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
                name: deliveryAddress.descriptor.name,
                phone: deliveryAddress.descriptor.phone,
                email: deliveryAddress.descriptor.email,
                location: {
                  gps: deliveryAddress.gps,
                  address: {
                    door: deliveryAddress.address.door
                      ? deliveryAddress.address.door
                      : deliveryAddress.address.street,
                    country: 'IND',
                    city: deliveryAddress.address.city,
                    street: deliveryAddress.address.street,
                    areaCode: deliveryAddress.address.areaCode,
                    state: deliveryAddress.address.state,
                    building: deliveryAddress.address.building
                      ? deliveryAddress.address.building
                      : deliveryAddress.address.street,
                  },
                },
              },

              payment: {type: 'ON-FULFILLMENT'},
            },
          });
          providerIdArray.push(item.provider.id);
        }
      });

      const {data} = await postData(`${BASE_URL}${INITIALIZE_ORDER}`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      });

      let messageIds = [];

      totalMessagesExpected.current = data.length;
      data.forEach(item => {
        if (item.message.ack.status === 'ACK') {
          parentOrderId.current = item.context.parent_order_id;
          messageIds.push(item.context.message_id);
        } else {
          console.log(item.message.ack);
        }
      });
      if (messageIds.length > 0) {
        setInItMessageIds(messageIds);
      } else {
        showToastWithGravity('No data found');
        setInitializeOrderRequested(false);
      }
    } catch (err) {
      console.log(err);
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
    if (selectedPaymentOption === PAYMENT_METHODS.COD.name) {
      await confirmOrder(PAYMENT_METHODS.COD, refOrders.current, total.current);
    } else {
      const orderDetails = {
        merchant_id: Config.MERCHANT_ID.toUpperCase(),
        customer_id: uid,
        order_id: parentOrderId.current,
        customer_phone: deliveryAddress.descriptor.phone,
        customer_email: deliveryAddress.descriptor.email,
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
          customerEmail: deliveryAddress.descriptor.email,
          customerMobile: deliveryAddress.descriptor.phone,
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
        break;

      case 'process_result':
        if (data.payload.hasOwnProperty('status')) {
          switch (data.payload.status.toUpperCase()) {
            case 'CHARGED':
              confirmOrder(
                PAYMENT_METHODS.JUSPAY,
                refOrders.current,
                total.current,
              )
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
              showToastWithGravity('Transaction Pending');
              setInitializeOrderRequested(false);
              break;
          }
        } else {
          showToastWithGravity(
            'Something went wrong, please try again after some time.',
          );
        }
        break;

      default:
        console.log('Unknown Event', data);
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
        customer_phone: deliveryAddress.descriptor.phone,
        customer_email: deliveryAddress.descriptor.email,
        amount: Config.ENV === 'dev' ? String(9) : String(9),
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
      console.log(err);
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
      });
      eventSources.current = null;
    }
    if (
      totalMessagesReceived.current.length <
      totalMessagesExpected.current.length
    ) {
      alertWithOneButton(
        'Request Failed',
        'Unable to process your request at the moment. Please try again after some time',
        'Ok',
        () => {
          navigation.goBack();
        },
      );
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
          `${BASE_URL}/clientApis/events?messageId=${messageId}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
      });
      eventSources.current = sources;
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

  return (
    <View style={appStyles.container}>
      <View pointerEvents={confirmOrderRequested ? 'none' : 'auto'}>
        {initializeOrderRequested ? (
          <PaymentSkeleton />
        ) : (
          <ScrollView>
            <BreakDown products={products} />

            <Card style={styles.card}>
              <Address
                title="Shipped To"
                name={deliveryAddress?.descriptor?.name}
                email={deliveryAddress?.descriptor?.email}
                phone={deliveryAddress?.descriptor?.phone}
                address={deliveryAddress.address}
              />
            </Card>

            {!error.current && (
              <Card style={styles.card}>
                <View style={styles.itemsContainerStyle}>
                  <Text variant="titleMedium">Payment Options</Text>

                  <View style={styles.paymentOptions}>
                    <TouchableOpacity
                      style={[
                        styles.paymentOption,
                        {
                          borderColor:
                            selectedPaymentOption === 'JUSPAY'
                              ? theme.colors.primary
                              : theme.colors.accent,
                        },
                      ]}
                      onPress={() => setSelectedPaymentOption('JUSPAY')}>
                      <View style={styles.emptyCheckbox}>
                        {selectedPaymentOption === 'JUSPAY' && (
                          <Icon
                            name={'check-circle'}
                            color={colors.primary}
                            size={24}
                          />
                        )}
                      </View>
                      <View style={styles.paymentOptionDetails}>
                        <Text style={styles.paymentOptionText}>Prepaid</Text>
                        <View>
                          <Text>Powered By</Text>
                          <FastImage
                            source={{
                              uri: 'https://imgee.s3.amazonaws.com/imgee/a0baca393d534736b152750c7bde97f1.png',
                            }}
                            style={styles.image}
                            resizeMode={'contain'}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.paymentOption,
                        {
                          borderColor:
                            selectedPaymentOption === 'COD'
                              ? theme.colors.primary
                              : theme.colors.accent,
                        },
                      ]}
                      onPress={() => setSelectedPaymentOption('COD')}>
                      <View style={styles.emptyCheckbox}>
                        {selectedPaymentOption === 'COD' && (
                          <Icon
                            name={'check-circle'}
                            color={colors.primary}
                            size={24}
                          />
                        )}
                      </View>
                      <View style={styles.paymentOptionDetails}>
                        <Text style={styles.paymentOptionText}>COD</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            )}

            {!error.current && (
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  contentStyle={appStyles.containedButtonContainer}
                  labelStyle={appStyles.containedButtonLabel}
                  onPress={() => {
                    removeInitEvent();
                    processPayment()
                      .then(() => {})
                      .catch(() => {});
                  }}
                  loading={confirmOrderRequested}>
                  Place Order
                </Button>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default withTheme(Payment);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 8,
    margin: 8,
  },
  text: {fontSize: 18, fontWeight: '600', paddingLeft: 10},
  buttonContainer: {width: 300, alignSelf: 'center', marginTop: 16},
  paymentOptions: {marginVertical: 10},
  image: {height: 15, width: 80},
  itemsContainerStyle: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },

  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  price: {flexShrink: 1},
  processing: {alignItems: 'center', justifyContent: 'center'},
  processingText: {fontSize: 18, fontWeight: '700', marginTop: 20},
  addressContainer: {
    marginTop: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  paymentOptionText: {
    fontSize: 18,
  },
  paymentOptionDetails: {
    marginStart: 12,
  },
  emptyCheckbox: {
    width: 24,
    height: 24,
  },
});
