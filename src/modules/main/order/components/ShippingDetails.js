import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';
import {Divider, Text, withTheme} from 'react-native-paper';

import ClearButton from '../../../../components/button/ClearButton';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {getData} from '../../../../utils/api';
import {
  BASE_URL,
  ON_CANCEL_ORDER,
  ON_UPDATE_ORDER,
} from '../../../../utils/apiUtilities';
import {ORDER_STATUS, UPDATE_TYPE} from '../../../../utils/Constants';
import {showToastWithGravity} from '../../../../utils/utils';
import CancelDialog from './dialogs/CancelDialog';
import StatusContainer from './StatusContainer';
import Support from './dialogs/Support';
import CallSeller from './actions/CallSeller';
import Address from './Address';
import GetOrderStatus from './actions/GetOrderStatus';
import TrackOrder from './actions/TrackOrder';

/**
 * Component is used to display single item with title and cost
 * @param item:single ordered item
 * @returns {JSX.Element}
 * @constructor
 */
const renderItem = ({item}) => {
  return (
    <>
      <View style={[styles.rowContainer, styles.priceContainer]}>
        <Text style={styles.title} numberOfLines={1}>
          {item.product?.descriptor?.name}
        </Text>
        <Text style={styles.price}>₹{item.product?.price?.value}</Text>
      </View>
      <>
        <Text style={styles.quantity}>QTY:&nbsp;{item.product?.quantity}</Text>
        <StatusContainer product={item} />
      </>
    </>
  );
};

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
  const isFocused = useIsFocused();
  const {token} = useSelector(({authReducer}) => authReducer);
  const {handleApiError} = useNetworkErrorHandling();
  const [cancelInProgress, setCancelInProgress] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [cancelMessageId, setCancelMessageId] = useState(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [updateMessageId, setUpdateMessageId] = useState(null);
  const [updateType, setUpdateType] = useState(null);

  const shippingAddress = order?.fulfillments[0]?.end?.location?.address;
  const contact = order?.fulfillments[0]?.end?.contact;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const onCancel = async id => {
    try {
      const {data} = await getData(
        `${BASE_URL}${ON_CANCEL_ORDER}messageId=${id}`,
        options,
      );
      if (data.message) {
        getOrderList(1)
          .then(() => {})
          .catch(() => {});
      } else {
        showToastWithGravity(
          'Something went wrong, please try again after some time.',
        );
      }
      setShowOverlay(false);
      setCancelInProgress(false);
    } catch (e) {
      handleApiError(e);
      setCancelInProgress(false);
    }
  };

  const onUpdate = async id => {
    try {
      const {data} = await getData(
        `${BASE_URL}${ON_UPDATE_ORDER}messageId=${id}`,
        options,
      );
      if (data.message) {
        getOrderList(1)
          .then(() => {})
          .catch(() => {});
      } else {
        showToastWithGravity(
          'Something went wrong, please try again after some time.',
        );
      }
      setUpdateInProgress(false);
      setShowOverlay(false);
    } catch (e) {
      console.log(e);
      handleApiError(e);
      setUpdateInProgress(false);
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

  useEffect(() => {
    let eventSource;
    let timer;
    if (updateMessageId && isFocused) {
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

  useEffect(() => {
    let eventSource;
    let timer;
    if (cancelMessageId) {
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
  }, [cancelMessageId]);

  return (
    <>
      <View style={[appStyles.container, styles.container]}>
        <Divider />
        <FlatList
          data={order?.items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
        <Divider style={styles.divider} />
        <Address
          title="Shipped To"
          name={shippingAddress?.name}
          email={contact?.email}
          phone={contact?.phone}
          address={shippingAddress}
        />
        <Divider style={styles.divider} />
        <Address
          title="Billed To"
          name={shippingAddress?.name}
          email={contact?.email}
          phone={contact?.phone}
          address={order?.billing?.address}
        />
        <Divider style={styles.divider} />

        <View style={styles.actionContainer}>
          <CallSeller
            bppId={order.bppId}
            orderId={order.id}
            transactionId={order.transactionId}
            updateSellerInfo={setSellerInfo}
            setModalVisible={setModalVisible}
          />
          {order.state !== ORDER_STATUS.CANCELLED && (
            <>
              {order.state === ORDER_STATUS.DELIVERED ? (
                <ClearButton textColor={colors.primary} title={'Return'} />
              ) : (
                <>
                  <GetOrderStatus
                    bppId={order.bppId}
                    orderId={order.id}
                    transactionId={order.transactionId}
                    getOrderList={getOrderList}
                  />

                  <TrackOrder
                    bppId={order.bppId}
                    orderId={order.id}
                    transactionId={order.transactionId}
                  />
                </>
              )}

              <ClearButton
                title={'Cancel'}
                onPress={() => {
                  setShowOverlay(true);
                  setUpdateType(UPDATE_TYPE.CANCEL);
                }}
                textColor={colors.primary}
              />
            </>
          )}
        </View>
      </View>
      {modalVisible && (
        <Support
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          sellerInfo={sellerInfo}
        />
      )}
      {showOverlay && (
        <CancelDialog
          showOverlay={showOverlay}
          breakup={order.items}
          setShowOverlay={setShowOverlay}
          order={order}
          setCancelInProgress={setCancelInProgress}
          setCancelMessageId={setCancelMessageId}
          setUpdateMessageId={setUpdateMessageId}
          cancelInProgress={cancelInProgress}
          updateInProgress={updateInProgress}
          setUpdateInProgress={setUpdateInProgress}
          updateType={updateType}
        />
      )}
    </>
  );
};

export default withTheme(ShippingDetails);

const styles = StyleSheet.create({
  addressContainer: {marginTop: 20, flexShrink: 1},
  actionContainer: {
    paddingVertical: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
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
  divider: {marginTop: 10},
  quantity: {fontWeight: '700'},
});
