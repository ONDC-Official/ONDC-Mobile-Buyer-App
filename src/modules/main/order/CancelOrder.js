import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  RadioButton,
  Text,
  withTheme,
} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';

import {cancelReasons} from './utils/reasons';
import {appStyles} from '../../../styles/styles';
import {getData, postData} from '../../../utils/api';
import {
  BASE_URL,
  CANCEL_ORDER,
  ON_CANCEL_ORDER,
  ON_UPDATE_ORDER,
  UPDATE_ORDER,
} from '../../../utils/apiUtilities';
import {useSelector} from 'react-redux';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import RNEventSource from 'react-native-event-source';
import {useIsFocused} from '@react-navigation/native';
import {
  showInfoToast,
  showToastWithGravity,
  stringToDecimal,
} from '../../../utils/utils';
import TextViewWithMoreLess from '../../../components/TextView/TextViewWithMoreLess';

const CancelOrder = ({theme, navigation, route: {params}}) => {
  const {colors} = theme;
  const isFocused = useIsFocused();
  const {handleApiError} = useNetworkErrorHandling();
  const {token} = useSelector(({authReducer}) => authReducer);
  const [products, setProducts] = useState([]);
  const [cancelInProgress, setCancelInProgress] = useState(false);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [cancellationType, setCancellationType] = useState('complete');
  const [selectedReason, setSelectedReason] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cancelMessageId, setCancelMessageId] = useState(null);
  const [updateMessageId, setUpdateMessageId] = useState(null);
  const orderProcessed = useRef(false);

  const cancelOrder = async () => {
    try {
      setCancelInProgress(true);
      const {data} = await postData(
        `${BASE_URL}${CANCEL_ORDER}`,
        {
          context: {
            bpp_id: params.bppId,
            transaction_id: params.transactionId,
          },
          message: {
            order_id: params.orderId,
            cancellation_reason_id: selectedReason.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCancelMessageId(data.context.message_id);
    } catch (e) {
      handleApiError(e);
      setCancelInProgress(false);
    }
  };

  useEffect(() => {
    const productsWithCancelQuant = products.map(
      element => (element.cancelQuantity = element.quantity?.count),
    );
    setProducts(productsWithCancelQuant);
  }, []);

  /**
   * function used to request tracking details of order
   * @returns {Promise<void>}
   */
  const updateOrder = async () => {
    try {
      setUpdateInProgress(true);
      const items = selectedProducts.map(element => {
        return {
          id: element.id,
          quantity: element.cancelQuantity
            ? {
                count: element.cancelQuantity,
              }
            : element.quantity,
          tags: {
            update_type: params.updateType,
            reason_code: selectedReason.id,
            ttl_approval: element.hasOwnProperty('@ondc/org/return_window')
              ? element['@ondc/org/return_window']
              : '',
            ttl_reverseqc: 'P3D',
            image: '',
          },
        };
      });
      const payload = [
        {
          context: {
            transaction_id: params.transactionId,
            bpp_id: params.bppId,
          },
          message: {
            update_target: 'item',
            order: {
              id: params.orderId,
              state: params.orderStatus,
              provider: {
                id: params.providerId,
              },
              items: items,
            },
          },
        },
      ];

      const {data} = await postData(`${BASE_URL}${UPDATE_ORDER}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data[0].message?.ack?.status === 'NACK') {
        data[0].error.message
          ? showToastWithGravity(data[0].error.message)
          : showToastWithGravity(
              'Not able to cancel/return the order, please try after sometime',
            );
        setUpdateInProgress(false);
      } else if (
        data[0].message?.ack?.status === 'ACK' ||
        data[0].message?.status === 'ACK'
      ) {
        setUpdateMessageId(data[0].context.message_id);
      }
    } catch (e) {
      setUpdateInProgress(false);
      console.log(e);
      handleApiError(e);
    }
  };

  const onProductClicked = (item, index) => {
    const items = selectedProducts.slice();
    index > -1 ? items.splice(index, 1) : items.push(item);
    setSelectedProducts(items);
  };

  const updateQuantity = (item, addQuantity) => {
    let cancelQuantity = item.hasOwnProperty('cancelQuantity')
      ? item.cancelQuantity
      : item.quantity?.count;
    if (addQuantity && cancelQuantity < item.quantity?.count) {
      item.cancelQuantity = cancelQuantity + 1;
      const indexFound = products.findIndex(element => element.id === item.id);
      if (indexFound > -1) {
        products[indexFound] = item;
      }

      setProducts([...products]);
    } else if (!addQuantity && cancelQuantity > 1) {
      item.cancelQuantity = cancelQuantity - 1;
      const indexFound = products.findIndex(element => element.id === item.id);
      if (indexFound > -1) {
        products[indexFound] = item;
      }

      setProducts([...products]);
    }
  };

  const removeEvents = eventSource => {
    if (eventSource) {
      eventSource.removeAllListeners();
      eventSource.close();
      setCancelInProgress(false);
      setUpdateInProgress(false);
    }
  };

  const onCancel = async id => {
    try {
      const {data} = await getData(
        `${BASE_URL}${ON_CANCEL_ORDER}messageId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCancelInProgress(false);
      orderProcessed.current = true;
      if (data.message) {
        showInfoToast('Complete order cancelled successfully');
        navigation.navigate('Orders');
      } else {
        showToastWithGravity(
          'Something went wrong, please try again after some time.',
        );
      }
    } catch (e) {
      setCancelInProgress(false);
      handleApiError(e);
    }
  };

  const onUpdate = async id => {
    try {
      const {data} = await getData(
        `${BASE_URL}${ON_UPDATE_ORDER}messageId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUpdateInProgress(false);
      if (data.message) {
        showInfoToast('Partial order cancelled successfully');
        navigation.navigate('Orders');
      } else {
        showToastWithGravity(
          'Something went wrong, please try again after some time.',
        );
      }
    } catch (e) {
      console.log(e);
      handleApiError(e);
      setUpdateInProgress(false);
    }
  };

  useEffect(() => {
    if (params.items) {
      const list = params.items.filter(
        one =>
          one.product['@ondc/org/cancellable'] &&
          one.cancellation_status !== 'Cancelled',
      );
      setProducts(list);
      if (list.length === 1) {
        setCancellationType('complete');
      }
    }
  }, [params]);

  useEffect(() => {
    let eventSource;
    let timer;
    if (cancelMessageId && isFocused) {
      eventSource = new RNEventSource(
        `${BASE_URL}/clientApis/events?messageId=${cancelMessageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (!timer) {
        timer = setTimeout(removeEvents, 20000, eventSource);
      }
      eventSource.addEventListener('on_cancel', event => {
        const data = JSON.parse(event.data);
        onCancel(data.messageId)
          .then(() => {})
          .catch(() => {});
      });
    }
    return () => {
      removeEvents(eventSource);
    };
  }, [cancelMessageId, isFocused]);

  useEffect(() => {
    let eventSource;
    let timer;
    if (updateMessageId) {
      eventSource = new RNEventSource(
        `${BASE_URL}/clientApis/events?messageId=${updateMessageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (!timer) {
        timer = setTimeout(removeEvents, 20000, eventSource);
      }

      eventSource.addEventListener('on_update', event => {
        const data = JSON.parse(event.data);
        onUpdate(data.messageId)
          .then(() => {})
          .catch(err => {
            console.error(err);
          });
      });
    }

    return () => {
      removeEvents(eventSource);
    };
  }, [updateMessageId]);

  const disabled = cancelInProgress || updateInProgress;
  return (
    <ScrollView>
      <Card style={styles.card}>
        <View style={styles.cancellationType}>
          <View style={styles.row}>
            <RadioButton.Android
              disabled={disabled}
              value="first"
              status={cancellationType === 'complete' ? 'checked' : 'unchecked'}
              onPress={() => setCancellationType('complete')}
            />
            <Text>Complete</Text>
          </View>
          <View style={styles.row}>
            <RadioButton.Android
              disabled={disabled || products?.length <= 0}
              value="first"
              status={cancellationType === 'partial' ? 'checked' : 'unchecked'}
              onPress={() => setCancellationType('partial')}
            />
            <Text>Partial</Text>
          </View>
        </View>
        {cancellationType === 'partial' && (
          <>
            <Text variant="titleSmall" style={styles.reasonMessage}>
              Select products to cancel
            </Text>
            <View style={styles.productList}>
              {products?.map(item => {
                const index = selectedProducts.findIndex(
                  one => one.id === item?.id,
                );
                return (
                  <>
                    <View style={styles.itemContainer}>
                      <Checkbox
                        disabled={disabled}
                        status={index > -1 ? 'checked' : 'unchecked'}
                        onPress={() => onProductClicked(item, index)}
                      />
                      <TouchableOpacity
                        disabled={disabled}
                        style={[styles.product]}
                        onPress={() => onProductClicked(item, index)}>
                        <TextViewWithMoreLess
                          textContent={item.product?.descriptor?.name}
                          style={styles.title}
                        />
                        <View style={styles.productDetails}>
                          <Text>QTY: {item?.quantity?.count}</Text>
                          <Text
                            variant="titleSmall"
                            style={styles.productAmount}>
                            ₹{stringToDecimal(item?.product?.price?.value)}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={[styles.quantityDisplayButton]}>
                        <IconButton
                          icon="minus"
                          iconColor="white"
                          style={{
                            backgroundColor: colors.primary,
                            height: 25,
                            width: 25,
                          }}
                          onPress={() =>
                            index > -1 && updateQuantity(item, false)
                          }
                        />
                        <Text>
                          {item.cancelQuantity || item.quantity?.count}
                        </Text>
                        <IconButton
                          icon="plus"
                          iconColor="white"
                          style={{
                            backgroundColor: colors.primary,
                            height: 25,
                            width: 25,
                          }}
                          onPress={() =>
                            index > -1 && updateQuantity(item, true)
                          }
                        />
                      </View>
                    </View>
                    <Text variant="titleSmall" style={styles.productPrice}>
                      {`Total: ₹${stringToDecimal(
                        item.product?.price?.value * item?.quantity?.count,
                      )}`}
                    </Text>
                  </>
                );
              })}
            </View>
            <Divider />
          </>
        )}

        <View>
          <View style={styles.reasonMessage}>
            <Text variant="titleSmall">Cancellation Reason</Text>
          </View>
          {cancelReasons.map(reason => (
            <View key={reason.id} style={styles.row}>
              <RadioButton.Android
                disabled={disabled}
                value="first"
                status={
                  selectedReason?.id === reason?.id ? 'checked' : 'unchecked'
                }
                onPress={() => setSelectedReason(reason)}
              />
              <Text
                disabled={disabled}
                style={styles.reason}
                onPress={() => setSelectedReason(reason)}>
                {reason.reason}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {cancellationType === 'complete' && selectedReason && (
            <Button
              contentStyle={appStyles.containedButtonContainer}
              labelStyle={appStyles.containedButtonLabel}
              mode={'contained'}
              disabled={cancelInProgress}
              loading={cancelInProgress}
              onPress={cancelOrder}>
              Cancel Order
            </Button>
          )}
          {cancellationType === 'partial' &&
            selectedReason &&
            selectedProducts.length > 0 && (
              <Button
                contentStyle={appStyles.containedButtonContainer}
                labelStyle={appStyles.containedButtonLabel}
                mode={'contained'}
                disabled={updateInProgress}
                loading={updateInProgress}
                onPress={updateOrder}>
                Cancel Order
              </Button>
            )}
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cancellationType: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    margin: 8,
    padding: 8,
    backgroundColor: 'white',
  },
  reason: {
    marginStart: 8,
    flexShrink: 1,
  },
  reasonMessage: {
    marginVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  product: {
    maxWidth: '60%',
    marginEnd: 22,
    justifyContent: 'center',
  },
  productDetails: {
    flexDirection: 'row',
  },
  productAmount: {
    marginStart: 20,
  },
  productPrice: {
    marginStart: 20,
    fontWeight: '800',
  },
  productList: {
    marginBottom: 12,
  },
  quantityDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginRight: 4,
    flex: 1,
  },
});

export default withTheme(CancelOrder);
