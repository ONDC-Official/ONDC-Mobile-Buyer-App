import {ActivityIndicator, Text} from 'react-native-paper';
import React, {useEffect, useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {useTranslation} from 'react-i18next';

import {
  API_BASE_URL,
  ORDER_EVENT,
  ORDER_STATUS,
} from '../../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../../utils/utils';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {SSE_TIMEOUT} from '../../../../../utils/constants';
import {makeButtonStyles} from './buttonStyles';
import {updateRequestingStatus} from '../../../../../redux/order/actions';
import {useAppTheme} from '../../../../../utils/theme';

interface GetStatusButton {
  onUpdateOrder: (value: any, selfUpdate: boolean) => void;
}

const CancelToken = axios.CancelToken;

const GetStatusButton: React.FC<GetStatusButton> = ({onUpdateOrder}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {orderDetails, requestingStatus} = useSelector(
    ({orderReducer}) => orderReducer,
  );
  const {token} = useSelector(({authReducer}) => authReducer);
  const source = useRef<any>(null);
  const eventTimeOutRef = useRef<any>(null);
  const statusEventSourceResponseRef = useRef<any>(null);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const theme = useAppTheme();
  const styles = makeButtonStyles(theme.colors);

  // use this api to get updated status of the order
  const handleFetchUpdatedStatus = async (selfUpdate = false) => {
    statusEventSourceResponseRef.current = [];
    if (!selfUpdate) {
      dispatch(updateRequestingStatus(true));
    }
    source.current = CancelToken.source();
    const transaction_id = orderDetails?.transactionId;
    const bpp_id = orderDetails?.bppId;
    const order_id = orderDetails?.id;
    try {
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${ORDER_STATUS}`,
        [
          {
            context: {
              transaction_id,
              bpp_id,
            },
            message: {
              order_id,
            },
          },
        ],
        source.current.token,
      );
      //Error handling workflow eg, NACK
      if (data[0].error && data[0].message.ack.status === 'NACK') {
        dispatch(updateRequestingStatus(false));
        showToastWithGravity(data[0].error.message);
      } else {
        fetchStatusDataThroughEvents(data[0]?.context?.message_id, selfUpdate);
      }
    } catch (err: any) {
      showToastWithGravity(err?.message);
      dispatch(updateRequestingStatus(false));
    }
  };

  const getUpdatedStatus = async (messageId: any, selfUpdate: boolean) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}/clientApis/v2/on_order_status?messageIds=${messageId}`,
        source.current.token,
      );
      statusEventSourceResponseRef.current = [
        ...statusEventSourceResponseRef.current,
        data[0],
      ];
      const {message, error = {}} = data[0];
      if (error?.message) {
        showToastWithGravity('Cannot get status for this product');
        dispatch(updateRequestingStatus(false));
        return;
      }
      if (message?.order) {
        onUpdateOrder(message?.order, selfUpdate);
        if (!selfUpdate) {
          showToastWithGravity(t('Profile.Order status updated successfully'));
        }
      }
      dispatch(updateRequestingStatus(false));
    } catch (err: any) {
      dispatch(updateRequestingStatus(false));
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.eventSource.close();
      clearTimeout(eventTimeOutRef.current.timer);
    }
  };

  // STATUS APIS
  // use this function to fetch support info through events
  const fetchStatusDataThroughEvents = (
    messageId: any,
    selfUpdate: boolean,
  ) => {
    const eventSource = new RNEventSource(
      `${API_BASE_URL}${ORDER_EVENT}${messageId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    eventSource.addEventListener('on_status', (event: any) => {
      const data = JSON.parse(event?.data);
      getUpdatedStatus(data.messageId, selfUpdate).then(() => {});
    });

    const timer = setTimeout(() => {
      eventSource.close();
      clearTimeout(timer);

      if (statusEventSourceResponseRef.current.length <= 0) {
        showToastWithGravity(
          'Cannot proceed with you request now! Please try again',
        );
        dispatch(updateRequestingStatus(false));
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = {
      eventSource,
      timer,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleFetchUpdatedStatus(true).then(() => {});
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      disabled={requestingStatus}
      onPress={() => handleFetchUpdatedStatus()}>
      {requestingStatus ? (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size={14} color={theme.colors.primary} />
        </View>
      ) : (
        <></>
      )}
      <Text variant={'bodyMedium'} style={styles.label}>
        {t('Profile.Get Status')}
      </Text>
    </TouchableOpacity>
  );
};

export default GetStatusButton;
