import React, {useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import {Context as AuthContext} from '../../../context/Auth';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../locales/i18n';
import {getData, postData} from '../../../utils/api';
import {
  BASE_URL,
  CANCEL_ORDER,
  ON_CANCEL_ORDER,
  ON_TRACK_ORDER,
  TRACK_ORDER,
} from '../../../utils/apiUtilities';
import {FAQS, ORDER_STATUS} from '../../../utils/Constants';
import {showToastWithGravity} from '../../../utils/utils';

const deliveryTo = strings('main.order.delivery_to_label');
const statusLabel = strings('main.order.status_label');
const returnLabel = strings('main.order.return');
const cancel = strings('main.order.cancel');

const ShippingDetails = ({order, getOrderList, theme}) => {
  const {colors} = theme;
  const separator = ',';
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [cancelInProgress, setCancelInProgress] = useState(false);
  const [trackInProgress, setTrackInProgress] = useState(false);

  const trackOrder = async () => {
    try {
      setTrackInProgress(true);
      const payload = [
        {
          context: {
            transaction_id: order.transactionId,
            bpp_id: order.bppId,
          },
          message: {order_id: order.id},
        },
      ];
      const {data} = await postData(
        `${BASE_URL}${TRACK_ORDER}`,
        payload,
        options,
      );
      if (data[0].message.ack.status === 'ACK') {
        const response = await getData(
          `${BASE_URL}${ON_TRACK_ORDER}messageIds=${data[0].context.message_id}`,
          options,
        );
        if (response.data[0].message.tracking.status === 'active') {
          const supported = await Linking.canOpenURL(FAQS);
          if (supported) {
            await Linking.openURL(FAQS);
          }
        }
      }
      setTrackInProgress(false);
    } catch (e) {
      handleApiError(e);
      setTrackInProgress(false);
    }
  };

  const cancelOrder = async () => {
    try {
      setCancelInProgress(true);
      const payload = {
        context: {
          bpp_id: order.bppId,
          transaction_id: order.transactionId,
        },
        message: {order_id: order.id, cancellation_reason_id: 'item'},
      };
      const {data} = await postData(
        `${BASE_URL}${CANCEL_ORDER}`,
        payload,
        options,
      );

      const response = await getData(
        `${BASE_URL}${ON_CANCEL_ORDER}messageId=${data.context.message_id}`,
        options,
      );
      if (response.data.hasOwnProperty('message')) {
        getOrderList(1)
          .then(() => {})
          .catch(() => {});
      } else {
        showToastWithGravity('Something went wrong!');
      }
      setCancelInProgress(false);
    } catch (e) {
      handleApiError(e);
      setCancelInProgress(false);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.priceContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.space} />
        <Text style={styles.price}>₹{item.price.value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Divider />
      <FlatList data={order.quote.breakup} renderItem={renderItem} />
      <View>
        <View style={styles.addressContainer}>
          <Text style={{color: colors.grey}}>Billing Address:</Text>
          <Text style={styles.name}>{order.billing.name}</Text>
          <Text style={styles.address}>
            {order.billing.address.building
              ? order.billing.address.building
              : null}
            {order.billing.address.building ? separator : null}{' '}
            {order.billing.address.street}
          </Text>

          <Text>
            {order.billing.address.city} {order.billing.address.state}
          </Text>
        </View>
      </View>
      <Divider />

      <View>
        {order.state !== ORDER_STATUS.CANCELLED ? (
          <>
            <View>
              <View style={styles.subContainer}>
                {order.state === ORDER_STATUS.DELIVERED ? (
                  <TouchableOpacity
                    style={[
                      styles.clearCartButton,
                      {borderColor: colors.greyOutline},
                    ]}>
                    <Text style={styles.text}>{returnLabel}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.clearCartButton,
                      {backgroundColor: colors.greyOutline},
                    ]}
                    onPress={() => {
                      trackOrder()
                        .then(() => {})
                        .catch(() => {});
                    }}>
                    <Text style={styles.text}>Track</Text>
                    {trackInProgress && (
                      <ActivityIndicator
                        showLoading={trackInProgress}
                        color={colors.black}
                        size={14}
                      />
                    )}
                  </TouchableOpacity>
                )}
                <View style={styles.space} />
                <TouchableOpacity
                  style={[
                    styles.clearCartButton,
                    {backgroundColor: colors.accentColor},
                  ]}
                  onPress={cancelOrder}>
                  <Text style={[styles.text, {color: colors.white}]}>
                    {cancel}
                  </Text>
                  {cancelInProgress && (
                    <ActivityIndicator
                      showLoading={cancelInProgress}
                      color={colors.white}
                      size={14}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View
            style={[
              styles.cancelledButton,
              {
                borderColor: colors.error,
                backgroundColor: colors.cancelledBackground,
              },
            ]}
            onPress={cancelOrder}>
            <Text style={[styles.text, {color: colors.error}]}>Cancelled</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default withTheme(ShippingDetails);

const styles = StyleSheet.create({
  addressContainer: {marginVertical: 20},
  text: {fontSize: 16, marginRight: 5},
  subContainer: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  clearCartButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  space: {margin: 10},
  stepIndicator: {width: 20, height: 20, borderRadius: 50},
  cancelledButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  container: {paddingVertical: 10},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  name: {fontSize: 18, fontWeight: '700', marginVertical: 4},
  title: {fontSize: 16, fontWeight: '700', marginRight: 10, flexShrink: 1},
  price: {fontSize: 16, fontWeight: '700'},
  address: {marginBottom: 4},
});
