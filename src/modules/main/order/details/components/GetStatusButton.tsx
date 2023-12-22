import {ActivityIndicator, Button, useTheme} from 'react-native-paper';
import React, {useRef} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {API_BASE_URL, ORDER_STATUS} from '../../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../../utils/utils';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {SSE_TIMEOUT} from '../../../../../utils/constants';

interface GetStatusButton {
  orderDetails: any;
  statusLoading: boolean;
  setStatusLoading: (value: boolean) => void;
  onUpdateOrder: (value: any) => void;
}

const CancelToken = axios.CancelToken;

const GetStatusButton: React.FC<GetStatusButton> = ({
  orderDetails,
  statusLoading,
  setStatusLoading,
  onUpdateOrder,
}) => {
  const {token} = useSelector(({authReducer}) => authReducer);
  const source = useRef<any>(null);
  const eventTimeOutRef = useRef<any>(null);
  const statusEventSourceResponseRef = useRef<any>(null);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const theme = useTheme();

  // use this api to get updated status of the order
  const handleFetchUpdatedStatus = async () => {
    statusEventSourceResponseRef.current = [];
    setStatusLoading(true);
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
        setStatusLoading(false);
        showToastWithGravity(data[0].error.message);
      } else {
        fetchStatusDataThroughEvents(data[0]?.context?.message_id);
      }
    } catch (err: any) {
      setStatusLoading(false);
      showToastWithGravity(err?.message);
    }
  };

  const getUpdatedStatus = async (messageId: any) => {
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
        setStatusLoading(false);
        return;
      }
      if (message?.order) {
        onUpdateOrder(message?.order);
        showToastWithGravity('Order status updated successfully!');
      }
      setStatusLoading(false);
    } catch (err: any) {
      setStatusLoading(false);
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.eventSource.close();
      clearTimeout(eventTimeOutRef.current.timer);
    }
  };

  // STATUS APIS
  // use this function to fetch support info through events
  const fetchStatusDataThroughEvents = (messageId: any) => {
    const eventSource = new RNEventSource(
      `${API_BASE_URL}/clientApis/events?messageId=${messageId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    eventSource.addEventListener('on_status', (event: any) => {
      const data = JSON.parse(event?.data);
      getUpdatedStatus(data.messageId);
    });

    const timer = setTimeout(() => {
      eventSource.close();
      clearTimeout(timer);

      if (statusEventSourceResponseRef.current.length <= 0) {
        showToastWithGravity(
          'Cannot proceed with you request now! Please try again',
        );
        setStatusLoading(false);
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = {
      eventSource,
      timer,
    };
  };

  return (
    <Button
      mode="outlined"
      disabled={statusLoading}
      icon={() =>
        statusLoading ? (
          <ActivityIndicator size={14} color={theme.colors.primary} />
        ) : (
          <></>
        )
      }
      onPress={handleFetchUpdatedStatus}>
      Get Status
    </Button>
  );
};

export default GetStatusButton;
