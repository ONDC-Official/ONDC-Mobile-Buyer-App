import React, {useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  FlatList,
} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
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
import Button from './Button';
import Support from './Support';

const returnLabel = strings('main.order.return');
const cancel = strings('main.order.cancel');

const ShippingDetails = ({order, getOrderList, theme}) => {
  const {colors} = theme;
  const separator = ',';
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const [cancelInProgress, setCancelInProgress] = useState(false);
  const [trackInProgress, setTrackInProgress] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getSupportObj = {
    bpp_id: order.bppId,
    transaction_id: order.transactionId,
    ref_id: order.id,
  };

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
      console.log(response.data);
      if (response.data.message) {
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

      <View style={[styles.priceContainer, styles.container]}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={[styles.icon, {backgroundColor: colors.accentColor}]}>
          <Icon name="phone" color={colors.white} size={20} />
        </TouchableOpacity>
        <Support
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          item={getSupportObj}
        />
        {order.state !== ORDER_STATUS.CANCELLED ? (
          <>
            <View>
              <View style={styles.subContainer}>
                {order.state === ORDER_STATUS.DELIVERED ? (
                  <Button
                    backgroundColor={colors.greyOutline}
                    borderColor={colors.greyOutline}
                    title={returnLabel}
                  />
                ) : (
                  <Button
                    backgroundColor={colors.greyOutline}
                    borderColor={colors.greyOutline}
                    title={'Track'}
                    onPress={() => {
                      trackOrder()
                        .then(() => {})
                        .catch(() => {});
                    }}
                    loader={trackInProgress}
                    color={colors.black}
                  />
                )}
                <View style={styles.space} />
                <Button
                  backgroundColor={colors.accentColor}
                  borderColor={colors.accentColor}
                  title={cancel}
                  onPress={() => {
                    cancelOrder()
                      .then(() => {})
                      .catch(() => {});
                  }}
                  loader={cancelInProgress}
                  color={colors.white}
                />
              </View>
            </View>
          </>
        ) : (
          <Button
            backgroundColor={colors.cancelledBackground}
            borderColor={colors.error}
            color={colors.error}
            title={'Cancelled'}
            loader={cancelInProgress}
          />
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  space: {margin: 5},
  container: {paddingVertical: 10},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  name: {fontSize: 18, fontWeight: '700', marginVertical: 4},
  title: {fontSize: 16, fontWeight: '700', marginRight: 10, flexShrink: 1},
  price: {fontSize: 16, fontWeight: '700'},
  address: {marginBottom: 4},
  icon: {paddingVertical: 8, paddingHorizontal: 10, borderRadius: 50},
});
