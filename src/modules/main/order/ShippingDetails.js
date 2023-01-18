import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Linking, StyleSheet, View} from 'react-native';
import RNEventSource from 'react-native-event-source';
import ClearButton from '../../../components/button/ClearButton';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../styles/styles';
import {getData, postData} from '../../../utils/api';
import {
  ON_CANCEL_ORDER,
  ON_GET_STATUS,
  ON_SUPPORT,
  ON_TRACK_ORDER,
  ON_UPDATE_ORDER,
  SERVER_URL,
  SUPPORT,
} from '../../../utils/apiUtilities';
import {FAQS, ORDER_STATUS, UPDATE_TYPE} from '../../../utils/Constants';
import {showToastWithGravity} from '../../../utils/utils';
import {getStatus, trackOrder} from './OrderHistoryUtils';
import Overlay from './Overlay';
import StatusContainer from './StatusContainer';
import Support from './Support';
import {useSelector} from 'react-redux';
import {Divider, Text, withTheme} from 'react-native-paper';

/**
 * Component is used to display shipping details to the user when card is expanded
 * @param order:single order object
 * @param getOrderList:function to request order list
 * @param theme:application theme
 * @returns {JSX.Element}
 * @constructor
 */
const ShippingDetails = ({order, getOrderList, activeSections, theme}) => {
  const {colors} = theme;
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const {token} = useSelector(({authReducer}) => authReducer);
  const {handleApiError} = useNetworkErrorHandling();
  const [cancelInProgress, setCancelInProgress] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [trackInProgress, setTrackInProgress] = useState(false);
  const [statusInProgress, setStatusInProgress] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [cancelMessageId, setCancelMessageId] = useState(null);
  const [trackMessageId, setTrackMessageId] = useState(null);
  const [supportMessageId, setSupportMessageId] = useState(null);
  const [statusMessageId, setStatusMessageId] = useState(null);
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
          <Text style={[styles.quantity, {color: colors.greyOutline}]}>
            QTY:{item.product?.quantity}
          </Text>
          <StatusContainer product={item} />
        </>
      </>
    );
  };

  const getSupport = () => {
    setCallInProgress(true);
    postData(
      `${SERVER_URL}${SUPPORT}`,
      [
        {
          context: {
            bpp_id: order.bppId,
            transaction_id: order.transactionId,
          },
          message: {
            ref_id: order.id,
          },
        },
      ],
      options,
    )
      .then(({data}) => {
        if (data[0].message.ack.status === 'ACK') {
          setSupportMessageId(data[0].context.message_id);
        }
      })
      .catch(error => {
        handleApiError(error);
        setCallInProgress(true);
      });
  };

  /**
   * function request support info
   * @param messageId:message id received in get support API
   * @returns {Promise<void>}
   */
  const onGetSupport = async messageId => {
    try {
      const {data} = await getData(
        `${SERVER_URL}${ON_SUPPORT}messageIds=${messageId}`,
        options,
      );

      if (data[0].message.hasOwnProperty('phone')) {
        setSellerInfo(data[0].message);
      }
      setModalVisible(true);
    } catch (error) {
      handleApiError(error);
    }
  };

  const onTrackOrder = async messageId => {
    try {
      const {data} = await getData(
        `${SERVER_URL}${ON_TRACK_ORDER}messageIds=${messageId}`,
        options,
      );

      if (data[0].message.tracking.status === 'active') {
        const supported = await Linking.canOpenURL(FAQS);
        if (supported) {
          await Linking.openURL(FAQS);
        }
      }
    } catch (e) {
      handleApiError(e);
    }
  };

  const onGetStatus = async id => {
    try {
      const {data} = await getData(`${SERVER_URL}${ON_GET_STATUS}${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setStatusInProgress(false);
      getOrderList(1)
        .then(() => {})
        .catch(() => {});
    } catch (error) {
      console.log(error);
      handleApiError(error);
      setStatusInProgress(false);
    }
  };

  const onCancel = async id => {
    try {
      const {data} = await getData(
        `${SERVER_URL}${ON_CANCEL_ORDER}messageId=${id}`,
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
        `${SERVER_URL}${ON_UPDATE_ORDER}messageId=${id}`,
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
      setTrackInProgress(false);
      setCancelInProgress(false);
      setStatusInProgress(false);
      setCallInProgress(false);
      setUpdateInProgress(false);
    }
  };
  useEffect(() => {
    let eventSource;
    let timer;

    if (supportMessageId && isFocused) {
      eventSource = new RNEventSource(
        `${SERVER_URL}/clientApis/events?messageId=${supportMessageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (!timer) {
        timer = setTimeout(removeEvents, 20000, eventSource);
      }

      eventSource.addEventListener('on_support', event => {
        const data = JSON.parse(event.data);
        onGetSupport(data.messageId)
          .then(() => {})
          .catch(() => {});
      });
    }

    return () => {
      removeEvents(eventSource);
    };
  }, [supportMessageId]);

  useEffect(() => {
    let eventSource;
    let timer;
    if (updateMessageId && isFocused) {
      eventSource = new RNEventSource(
        `${SERVER_URL}/clientApis/events?messageId=${updateMessageId}`,
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

    if (statusMessageId && isFocused) {
      eventSource = new RNEventSource(
        `${SERVER_URL}/clientApis/events?messageId=${statusMessageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (!timer) {
        timer = setTimeout(removeEvents, 20000, eventSource);
      }

      eventSource.addEventListener('on_status', event => {
        const data = JSON.parse(event.data);
        onGetStatus(data.messageId)
          .then(() => {})
          .catch(() => {});
      });
    }

    return () => {
      removeEvents(eventSource);
    };
  }, [statusMessageId]);

  useEffect(() => {
    let eventSource;
    let timer;
    if (cancelMessageId) {
      eventSource = new RNEventSource(
        `${SERVER_URL}/clientApis/events?messageId=${cancelMessageId}`,
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

  useEffect(() => {
    let eventSource;
    let timer;
    if (trackMessageId) {
      eventSource = new RNEventSource(
        `${SERVER_URL}/clientApis/events?messageId=${trackMessageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (!timer) {
        timer = setTimeout(removeEvents, 20000, eventSource);
      }
      eventSource.addEventListener('on_track', event => {
        const data = JSON.parse(event.data);
        onTrackOrder(data.messageId)
          .then(() => {})
          .catch(() => {});
      });
    }
    return () => {
      removeEvents(eventSource);
    };
  }, [trackMessageId]);

  return (
    <>
      <View style={[appStyles.container, styles.container]}>
        <Divider />
        <FlatList data={order?.items} renderItem={renderItem} />
        <View style={styles.addressContainer}>
          <Text style={{color: colors.grey}}>Shipped To</Text>
          <Text style={styles.name}>{shippingAddress?.name}</Text>
          <Text style={styles.address}>{contact?.email}</Text>
          <Text style={styles.address}>{contact?.phone}</Text>

          <Text style={styles.address}>
            {shippingAddress?.street}, {shippingAddress?.city},{' '}
            {shippingAddress?.state}
          </Text>
          <Text>
            {shippingAddress?.areaCode ? shippingAddress?.areaCode : null}
          </Text>
        </View>
        <View style={styles.addressContainer}>
          <Text style={{color: colors.grey}}>Billed To</Text>
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
        <Divider style={styles.divider} />

        <View style={[styles.rowContainer, styles.actionContainer]}>
          <ClearButton
            title={'Call'}
            onPress={() => getSupport()}
            textColor={colors.primary}
            disabled={callInProgress}
            loading={callInProgress}
          />
          {order.state !== ORDER_STATUS.CANCELLED && (
            <>
              {order.state === ORDER_STATUS.DELIVERED ? (
                <ClearButton
                  textColor={colors.primary}
                  title={"Return"}
                />
              ) : (
                <>
                  <ClearButton
                    title={'Get Status'}
                    onPress={() => {
                      getStatus(
                        setStatusInProgress,
                        setStatusMessageId,
                        order,
                        options,
                      )
                        .then(() => {})
                        .catch(e => {
                          handleApiError(e);
                        });
                    }}
                    textColor={colors.primary}
                    loading={statusInProgress}
                  />
                  <ClearButton
                    title={"Track"}
                    onPress={() => {
                      trackOrder(
                        setTrackInProgress,
                        setTrackMessageId,
                        order,
                        options,
                      )
                        .then(() => {})
                        .catch(e => handleApiError(e));
                    }}
                    textColor={colors.primary}
                    loading={trackInProgress}
                  />
                </>
              )}

              <ClearButton
                title={"Cancel"}
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
        <Overlay
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
  cancelledButton: {width: 110},
  quantity: {fontWeight: '700'},
});
