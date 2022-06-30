import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Linking, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ContainButton from '../../../components/button/ContainButton';
import OutlineButton from '../../../components/button/OutlineButton';
import {Context as AuthContext} from '../../../context/Auth';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../styles/styles';
import {getData, postData} from '../../../utils/api';
import {BASE_URL, CANCEL_ORDER, ON_CANCEL_ORDER, ON_TRACK_ORDER, TRACK_ORDER,} from '../../../utils/apiUtilities';
import {FAQS, ORDER_STATUS} from '../../../utils/Constants';
import {showToastWithGravity} from '../../../utils/utils';
import Support from './Support';

/**
 * Component is used to display single item with title and cost
 * @param item:single ordered item
 * @returns {JSX.Element}
 * @constructor
 */
const renderItem = ({item}) => (
  <View style={[styles.rowContainer, styles.priceContainer]}>
    <Text style={styles.title} numberOfLines={1}>
      {item.title}
    </Text>
    <Text style={styles.price}>₹{item.price.value}</Text>
  </View>
);

/**
 * Component is used to display shipping details to the user when card is expanded
 * @param order:single order object
 * @param getOrderList:function to request order list
 * @param theme:application theme
 * @returns {JSX.Element}
 * @constructor
 */
const ShippingDetails = ({order, getOrderList, theme}) => {
  const {colors} = theme;
  const {t} = useTranslation();
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const [cancelInProgress, setCancelInProgress] = useState(false);
  const [trackInProgress, setTrackInProgress] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const shippingAddress = order?.fulfillment?.end?.location?.address;
  const contact = order?.fulfillment?.end?.contact;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const supportInfo = {
    bpp_id: order.bppId,
    transaction_id: order.transactionId,
    ref_id: order.id,
  };

  /**
   * function used to request tracking details of order
   * @returns {Promise<void>}
   */
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

  /**
   * function used to request cancel order
   * @returns {Promise<void>}
   */
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
      if (response.data.message) {
        getOrderList(1)
          .then(() => {})
          .catch(() => {});
      } else {
        showToastWithGravity(t('network_error.something_went_wrong'));
      }
      setCancelInProgress(false);
    } catch (e) {
      handleApiError(e);
      setCancelInProgress(false);
    }
  };

  return (
    <View style={[appStyles.container, styles.container]}>
      <Divider/>
      <FlatList data={order?.quote?.breakup} renderItem={renderItem}/>
        <View style={styles.addressContainer}>
          <Text style={{color: colors.grey}}>{t('main.order.shipped_to')}</Text>
          <Text style={styles.name}>{shippingAddress?.name}</Text>
          <Text style={styles.address}>{contact?.email}</Text>
          <Text style={styles.address}>{contact?.phone}</Text>

          <Text style={styles.address}>
            {shippingAddress?.street}, {shippingAddress?.city},{' '}
            {shippingAddress?.state}
          </Text>
          <Text>
            {shippingAddress?.areaCode
              ? shippingAddress?.areaCode
              : null}
          </Text>
        </View>
        <View style={styles.addressContainer}>
          <Text style={{color: colors.grey}}>{t('main.order.billed_to')}</Text>
          <Text style={styles.name}>{order?.billing?.name}</Text>
          <Text style={styles.address}>{order?.billing?.email}</Text>
          <Text style={styles.address}>{order?.billing?.phone}</Text>

          <Text style={styles.address}>
            {order?.billing?.address.street}, {order?.billing?.address.city},{' '}
            {order?.billing?.address.state}
          </Text>
          <Text>
            {order?.billing?.address.areaCode
              ? order?.billing?.address.areaCode
              : null}
          </Text>
        </View>
      <Divider style={styles.divider}/>

      <View style={[styles.rowContainer, styles.actionContainer]}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[styles.icon, {backgroundColor: colors.accentColor}]}>
          <Icon name="phone" color={colors.white} size={20}/>
        </TouchableOpacity>
        <Support
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          item={supportInfo}
        />
        {order.state !== ORDER_STATUS.CANCELLED ? (
          <View style={styles.subContainer}>
            {order.state === ORDER_STATUS.DELIVERED ? (
              <View style={styles.Button}>
                <ContainButton
                  backgroundColor={colors.greyOutline}
                  borderColor={colors.greyOutline}
                  title={t('main.order.return')}
                />
              </View>
            ) : (
              <View style={styles.Button}>
                <ContainButton
                  title={t('main.order.track')}
                  onPress={() => {
                    trackOrder()
                      .then(() => {})
                      .catch(() => {});
                  }}
                  loader={trackInProgress}
                />
              </View>
            )}
            <View style={styles.space}/>
            <View style={styles.Button}>
              <OutlineButton
                title={t('main.order.cancel')}
                onPress={() => {
                  cancelOrder()
                    .then(() => {})
                    .catch(() => {});
                }}
                loader={cancelInProgress}
                color={colors.error}
              />
            </View>
          </View>
        ) : (
          <View style={styles.Button}>
            <ContainButton
              backgroundColor={colors.cancelledBackground}
              borderColor={colors.error}
              color={colors.error}
              title={t('main.order.cancelled')}
              loader={cancelInProgress}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default withTheme(ShippingDetails);

const styles = StyleSheet.create({
  addressContainer: {marginTop: 20, flexShrink: 1},
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  space: {margin: 5},
  actionContainer: {paddingTop: 10},
  container: {
    paddingTop: 8,
  },
  rowContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    marginTop: 10,
  },
  name: {fontSize: 18, fontWeight: '500', marginVertical: 4, flexShrink: 1},
  title: {fontSize: 16, marginRight: 10, flexShrink: 1},
  price: {fontSize: 16, marginLeft: 10},
  address: {marginBottom: 4},
  icon: {paddingVertical: 8, paddingHorizontal: 10, borderRadius: 50},
  divider: {marginTop: 10},
  Button: {width: 90},
});
