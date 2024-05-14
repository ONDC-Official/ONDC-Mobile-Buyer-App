import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Menu,
  Modal,
  Portal,
  RadioButton,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useRef, useState} from 'react';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
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
import {useAppTheme} from '../../../../utils/theme';

const CancelToken = axios.CancelToken;

const CancelOrder = ({
  route: {params},
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
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
        `${API_BASE_URL}/clientApis/v2/on_cancel_order?messageId=${messageId}`,
        source.current.token,
      );
      cancelEventSourceResponseRef.current = [
        ...cancelEventSourceResponseRef.current,
        data[0],
      ];
      if (data?.message) {
        setShowConfirmation(false);
        navigation.goBack();
      } else {
        showToastWithGravity(
          t(
            'Return Items.Something went wrong, product status cannot be updated',
          ),
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
      getCancelOrderDetails(data.messageId).then(r => {});
    });

    const timer = setTimeout(() => {
      eventSource.close();
      clearTimeout(timer);

      if (cancelEventSourceResponseRef.current.length <= 0) {
        showToastWithGravity(
          t(
            'Return Items.Cannot proceed with you request now. Please try again',
          ),
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
            bpp_uri: params.bppUrl,
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
        showToastWithGravity(
          t('Return Items.Something went wrong, please try again'),
        );
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
            <Icon name={'clear'} color={theme.colors.neutral400} size={20} />
          </TouchableOpacity>
          <Text variant={'titleLarge'} style={styles.pageTitle}>
            {t('Cancel Order.Cancel Order')}
          </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.radioContainer}>
              <RadioButton value="complete_order" status={'checked'} />
              <Text style={styles.radioTitle} variant={'bodySmall'}>
                {t('Cancel Order.Complete order')}
              </Text>
            </View>
            <Text variant={'bodyLarge'} style={styles.message}>
              {t('Cancel Order.Select reason')}*
            </Text>
            <Menu
              contentStyle={styles.menuContainer}
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
                    color={theme.colors.neutral400}
                  />
                </TouchableOpacity>
              }>
              {CANCELLATION_REASONS.filter(
                (one: any) => !one.isApplicableForCancellation,
              ).map((one: any) => {
                const selected = selectedReason.value === one.value;
                return (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    key={one.key}
                    onPress={() => updateSelectedReason(one)}>
                    {selected ? (
                      <Text
                        variant={'bodyLarge'}
                        style={styles.selectedDropdownText}>
                        {one.value}
                      </Text>
                    ) : (
                      <Text variant={'bodySmall'} style={styles.dropdownText}>
                        {one.value}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </Menu>
          </View>
          <Button
            mode={'contained'}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            onPress={() => setShowConfirmation(true)}>
            {t('Cancel Order.Cancel')}
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
              <Icon name={'clear'} size={20} color={theme.colors.neutral400} />
            </TouchableOpacity>
          </View>
          <View style={styles.cancelImageContainer}>
            <Image
              source={require('../../../../assets/cancel.png')}
              style={styles.cancelImage}
            />
          </View>
          <Text variant={'headlineMedium'} style={styles.cancelTitle}>
            {t('Cancel Order.Cancel Order')}
          </Text>
          <Text variant={'bodySmall'} style={styles.cancelMessage}>
            {t(
              'Cancel Order.Are You sure you would like to cancel this order?',
            )}
          </Text>
          <View style={styles.actionContainer}>
            <Button
              disabled={loading}
              mode={'outlined'}
              contentStyle={styles.actionButtonContent}
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
              contentStyle={styles.actionButtonContent}
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
      color: colors.neutral400,
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioTitle: {
      marginLeft: 8,
      color: colors.neutral300,
    },
    container: {
      paddingHorizontal: 16,
      paddingTop: 20,
      flex: 1,
    },
    message: {
      color: colors.neutral500,
      marginTop: 20,
      marginBottom: 4,
    },
    selectDropdown: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.neutral100,
      paddingHorizontal: 9,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dropdownItem: {
      paddingVertical: 7,
      paddingHorizontal: 12,
    },
    dropdownText: {
      flex: 1,
      color: colors.neutral400,
    },
    selectedDropdownText: {
      color: colors.primary,
    },
    menuContainer: {
      backgroundColor: colors.white,
      marginTop: 16,
      marginRight: 32,
    },
    formContainer: {
      flex: 1,
    },
    modalContent: {
      backgroundColor: colors.white,
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
      color: colors.neutral400,
      textAlign: 'center',
    },
    cancelMessage: {
      color: colors.neutral400,
      marginBottom: 20,
      textAlign: 'center',
      paddingHorizontal: 16,
    },
    separator: {
      width: 10,
    },
    modalButton: {
      flex: 1,
      borderRadius: 8,
      borderColor: colors.primary,
    },
    actionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginHorizontal: 16,
    },
    actionButton: {
      borderRadius: 8,
    },
    actionButtonContent: {
      height: 44,
    },
  });

export default CancelOrder;
