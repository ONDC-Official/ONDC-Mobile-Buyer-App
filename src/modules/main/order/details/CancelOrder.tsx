import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Menu,
  Modal,
  Portal,
  RadioButton,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useRef, useState} from 'react';
import axios from 'axios';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';
import {CANCELLATION_REASONS, SSE_TIMEOUT} from '../../../../utils/constants';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {
  API_BASE_URL,
  CANCEL_ORDER,
  ORDER_EVENT,
} from '../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../utils/utils';

const CancelToken = axios.CancelToken;

const CancelOrder = ({
  route: {params},
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const eventTimeOutRef = useRef<any>(null);
  const cancelEventSourceResponseRef = useRef<any[]>([]);
  const source = useRef<any>(null);
  const {token} = useSelector(({authReducer}) => authReducer);
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [selectedReason, setSelectedReason] = useState<any>(
    CANCELLATION_REASONS[0],
  );
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const updateSelectedReason = (reason: any) => {
    setSelectedReason(reason);
    closeMenu();
  };

  const closeModal = () => setShowConfirmation(false);

  // on cancel Api
  const getCancelOrderDetails = async (messageId: any) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}/clientApis/v2/on_cancel_order?messageIds=${messageId}`,
        source.current.token,
      );
      cancelEventSourceResponseRef.current = [
        ...cancelEventSourceResponseRef.current,
        data[0],
      ];
      if (data?.message) {
        navigation.goBack();
      } else {
        showToastWithGravity(
          'Something went wrong!, product status cannot be updated',
        );
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.eventSource.close();
      clearTimeout(eventTimeOutRef.current.timer);
    }
  };

  // STATUS APIS
  // use this function to fetch support info through events
  const fetchCancelOrderDataThroughEvents = (messageId: any) => {
    const eventSource = new RNEventSource(
      `${API_BASE_URL}${ORDER_EVENT}${messageId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    eventSource.addEventListener('on_cancel', (event: any) => {
      const data = JSON.parse(event?.data);
      getCancelOrderDetails(data.messageId);
    });

    const timer = setTimeout(() => {
      eventSource.close();
      clearTimeout(timer);

      if (cancelEventSourceResponseRef.current.length <= 0) {
        showToastWithGravity(
          'Cannot proceed with you request now! Please try again',
        );
        setLoading(false);
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = {
      eventSource,
      timer,
    };
  };

  const cancelOrder = async () => {
    cancelEventSourceResponseRef.current = [];
    setLoading(true);
    source.current = CancelToken.source();
    try {
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${CANCEL_ORDER}`,
        {
          context: {
            domain: params.domain,
            bpp_id: params.bppId,
            bppUrl: params.bppUrl,
            transaction_id: params.transactionId,
          },
          message: {
            order_id: params.orderId,
            cancellation_reason_id: selectedReason?.key,
          },
        },
        source.current.token,
      );
      //Error handling workflow eg, NACK
      if (data.message.ack.status === 'NACK') {
        setLoading(false);
        showToastWithGravity('Something went wrong, please try again');
      } else {
        fetchCancelOrderDataThroughEvents(data.context.message_id);
      }
    } catch (err: any) {
      console.log(err);
      showToastWithGravity(err?.message);
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.page}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={'clear'} color={'#1A1A1A'} size={20} />
          </TouchableOpacity>
          <Text variant={'titleSmall'} style={styles.pageTitle}>
            Cancel Order
          </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.radioContainer}>
              <RadioButton value="complete_order" status={'checked'} />
              <Text style={styles.radioTitle} variant={'bodySmall'}>
                Complete order
              </Text>
            </View>
            <Text variant={'bodyMedium'} style={styles.message}>
              Select reason*
            </Text>
            <Menu
              style={styles.menuContainer}
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity
                  style={styles.selectDropdown}
                  onPress={openMenu}>
                  <Text variant={'bodySmall'} style={styles.dropdownText}>
                    {selectedReason.value}
                  </Text>
                  <Icon
                    name={'keyboard-arrow-down'}
                    size={20}
                    color={'#1A1A1A'}
                  />
                </TouchableOpacity>
              }>
              {CANCELLATION_REASONS.filter(
                (one: any) => !one.isApplicableForCancellation,
              ).map((one: any) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  key={one.key}
                  onPress={() => updateSelectedReason(one)}>
                  <Text style={styles.dropdownText}>{one.value}</Text>
                </TouchableOpacity>
              ))}
            </Menu>
          </View>
          <Button mode={'contained'} onPress={() => setShowConfirmation(true)}>
            Cancel
          </Button>
        </View>
      </View>
      <Portal>
        <Modal
          visible={showConfirmation}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Icon name={'clear'} size={20} color={'#1A1A1A'} />
            </TouchableOpacity>
          </View>
          <View style={styles.cancelImageContainer}>
            <Image
              source={require('../../../../assets/cancel.png')}
              style={styles.cancelImage}
            />
          </View>
          <Text variant={'titleLarge'} style={styles.cancelTitle}>
            Cancel Order
          </Text>
          <Text variant={'bodySmall'} style={styles.cancelMessage}>
            Are You sure you would like to cancel this order?
          </Text>
          <View style={styles.actionContainer}>
            <Button
              disabled={loading}
              mode={'outlined'}
              style={styles.modalButton}
              onPress={closeModal}>
              No
            </Button>
            <View style={styles.separator} />
            <Button
              disabled={loading}
              icon={() =>
                loading ? (
                  <ActivityIndicator size={14} color={theme.colors.primary} />
                ) : (
                  <></>
                )
              }
              mode={'contained'}
              style={styles.modalButton}
              onPress={cancelOrder}>
              Yes
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    page: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      flexDirection: 'row',
    },
    pageTitle: {
      marginLeft: 20,
      color: '#1A1A1A',
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioTitle: {
      marginLeft: 8,
      color: '#4F4F4F',
    },
    container: {
      paddingHorizontal: 16,
      paddingTop: 20,
      flex: 1,
    },
    message: {
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 4,
    },
    selectDropdown: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#B9B9B9',
      paddingHorizontal: 9,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dropdownItem: {
      padding: 16,
    },
    dropdownText: {
      flex: 1,
    },
    menuContainer: {
      backgroundColor: '#fff',
      marginTop: 16,
      marginRight: 32,
    },
    formContainer: {
      flex: 1,
    },
    modalContent: {
      backgroundColor: '#fff',
      margin: 20,
      borderRadius: 16,
    },
    modalHeader: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    cancelImage: {
      width: 100,
      height: 100,
    },
    cancelImageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    cancelTitle: {
      marginBottom: 6,
      color: '#1A1A1A',
      textAlign: 'center',
    },
    cancelMessage: {
      color: '#1A1A1A',
      marginBottom: 20,
      textAlign: 'center',
      paddingHorizontal: 16,
    },
    separator: {
      width: 10,
    },
    modalButton: {
      flex: 1,
    },
    actionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginHorizontal: 16,
    },
  });

export default CancelOrder;
