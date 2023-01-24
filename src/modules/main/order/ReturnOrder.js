import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  RadioButton,
  Text,
} from 'react-native-paper';
import React, {useEffect, useState} from 'react';

import {reasons} from './utils/reasons';
import {appStyles} from '../../../styles/styles';
import {getData, postData} from '../../../utils/api';
import {
  BASE_URL,
  ON_UPDATE_ORDER,
  UPDATE_ORDER,
} from '../../../utils/apiUtilities';
import {useSelector} from 'react-redux';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import RNEventSource from 'react-native-event-source';
import {showToastWithGravity} from '../../../utils/utils';

const ReturnOrder = ({navigation, route: {params}}) => {
  const {handleApiError} = useNetworkErrorHandling();
  const {token} = useSelector(({authReducer}) => authReducer);
  const [products, setProducts] = useState([]);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [updateMessageId, setUpdateMessageId] = useState(null);

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
          quantity: element.quantity,
          tags: {
            update_type: params.updateType,
            reason_code: selectedReason.id,
            ttl_approval: 'PT24H',
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
              state: 'Delivered',
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

      console.log(JSON.stringify(data, undefined, 4));
      if (data[0].message.ack.status === 'ACK') {
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

  const removeEvents = eventSource => {
    if (eventSource) {
      eventSource.removeAllListeners();
      eventSource.close();
      setUpdateInProgress(false);
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
      console.log(data);
      setUpdateInProgress(false);
      if (data.message) {
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
      setProducts(
        params.items.filter(one => one.product['@ondc/org/cancellable']),
      );
    }
  }, [params]);

  useEffect(() => {
    console.log('Update use effect');
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
          .catch(() => {});
      });
    }

    return () => {
      removeEvents(eventSource);
    };
  }, [updateMessageId]);

  const disabled = updateInProgress;
  return (
    <ScrollView>
      <Card style={styles.card}>
        <Text variant="titleSmall" style={styles.reasonMessage}>
          Select products to cancel
        </Text>
        <View style={styles.productList}>
          {products?.map(item => {
            const index = selectedProducts.findIndex(one => one.id === item.id);
            return (
              <View style={styles.itemContainer}>
                <Checkbox
                  disabled={disabled}
                  status={index > -1 ? 'checked' : 'unchecked'}
                  onPress={() => onProductClicked(item, index)}
                />
                <TouchableOpacity
                  disabled={disabled}
                  style={styles.product}
                  onPress={() => onProductClicked(item, index)}>
                  <Text variant="titleSmall">
                    {item.product?.descriptor?.name}
                  </Text>
                  <View style={styles.productDetails}>
                    <Text>QTY: {item.product?.quantity}</Text>
                    <Text variant="titleSmall" style={styles.productAmount}>
                      ₹{item.product?.price?.value}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <Divider />

        <View>
          <View style={styles.reasonMessage}>
            <Text variant="titleSmall">Cancellation Reason</Text>
          </View>
          {reasons.map(reason => (
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
          <Button
            contentStyle={appStyles.containedButtonContainer}
            labelStyle={appStyles.containedButtonLabel}
            mode="outlined"
            disabled={updateInProgress}
            onPress={() => navigation.goBack()}>
            Go Back
          </Button>

          {selectedReason && selectedProducts.length > 0 && (
            <Button
              contentStyle={appStyles.containedButtonContainer}
              labelStyle={appStyles.containedButtonLabel}
              mode={'contained'}
              disabled={updateInProgress}
              loading={updateInProgress}
              onPress={updateOrder}>
              Confirm
            </Button>
          )}
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    marginEnd: 32,
  },
  productDetails: {
    flexDirection: 'row',
  },
  productAmount: {
    marginStart: 32,
  },
  productList: {
    marginBottom: 12,
  },
});

export default ReturnOrder;
