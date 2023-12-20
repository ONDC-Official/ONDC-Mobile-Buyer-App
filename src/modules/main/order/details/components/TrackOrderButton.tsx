import {ActivityIndicator, Button, useTheme} from 'react-native-paper';
import React, {useRef} from 'react';
import {API_BASE_URL, TRACK_ORDER} from '../../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../../utils/utils';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {Linking} from 'react-native';
// @ts-ignore
import RNEventSource from 'react-native-event-source';

import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {SSE_TIMEOUT} from '../../../../../utils/constants';

interface TrackOrderButton {
  orderDetails: any;
  trackOrderLoading: boolean;
  statusLoading: boolean;
  setTrackOrderLoading: (value: boolean) => void;
  onUpdateTrackingDetails: (value: any) => void;
}

const CancelToken = axios.CancelToken;

const TrackOrderButton: React.FC<TrackOrderButton> = ({
  orderDetails,
  trackOrderLoading,
  statusLoading,
  setTrackOrderLoading,
  onUpdateTrackingDetails,
}) => {
  const trackEventSourceResponseRef = useRef<any>(null);
  const {token} = useSelector(({authReducer}) => authReducer);
  const source = useRef<any>(null);
  const eventTimeOutRef = useRef<any>(null);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const theme = useTheme();

  // TRACK APIS
  // use this api to track and order
  const handleFetchTrackOrderDetails = async () => {
    trackEventSourceResponseRef.current = [];
    setTrackOrderLoading(true);
    const transaction_id = orderDetails?.transactionId;
    const bpp_id = orderDetails?.bppId;
    const order_id = orderDetails?.id;
    try {
      source.current = CancelToken.source();
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${TRACK_ORDER}`,
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
      fetchTrackingDataThroughEvents(data[0]?.context?.message_id);
    } catch (err: any) {
      setTrackOrderLoading(false);
      showToastWithGravity(err?.message);
    }
  };

  // use this function to fetch tracking info through events
  const fetchTrackingDataThroughEvents = (messageId: any) => {
    const eventSource = new RNEventSource(
      `${API_BASE_URL}/clientApis/events?messageId=${messageId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    eventSource.addEventListener('on_track', (event: any) => {
      const data = JSON.parse(event?.data);
      getTrackOrderDetails(data.messageId).then(() => {});
    });

    const timer = setTimeout(() => {
      eventSource.close();
      clearTimeout(timer);

      if (trackEventSourceResponseRef.current.length <= 0) {
        showToastWithGravity(
          'Cannot proceed with you request now! Please try again',
        );
        setTrackOrderLoading(false);
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = {
      eventSource,
      timer,
    };
  };

  // on track order
  const getTrackOrderDetails = async (messageId: any) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}/clientApis/v2/on_track?messageIds=${messageId}`,
        source.current.token,
      );
      setTrackOrderLoading(false);
      trackEventSourceResponseRef.current = [
        ...trackEventSourceResponseRef.current,
        data[0],
      ];
      const {message} = data[0];
      if (message.tracking.status === 'active' && message.tracking.url === '') {
        onUpdateTrackingDetails(null);
        setTrackOrderLoading(false);
        showToastWithGravity(
          'Tracking information is not provided by the provider.',
        );
        return;
      } else if (message?.tracking?.url === '') {
        onUpdateTrackingDetails(null);
        setTrackOrderLoading(false);
        showToastWithGravity(
          'Tracking information not available for this product',
        );
        return;
      } else if (
        message.tracking.status === 'active' &&
        message?.tracking?.location?.gps
      ) {
        onUpdateTrackingDetails(message?.tracking);
      } else if (
        message.tracking.status === 'active' &&
        (message?.tracking?.url !== '' || message?.tracking?.url !== undefined)
      ) {
        setTrackOrderLoading(false);
        await Linking.openURL(message?.tracking?.url);
        onUpdateTrackingDetails(null);
      } else {
        onUpdateTrackingDetails(null);
        setTrackOrderLoading(false);
        showToastWithGravity(
          'Tracking information is not provided by the provider.',
        );
        return;
      }
    } catch (err: any) {
      setTrackOrderLoading(false);
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.forEach((timeout: any) => {
        timeout.eventSource.close();
        clearTimeout(timeout.timer);
      });
    }
  };

  return (
    <Button
      mode="outlined"
      disabled={trackOrderLoading || statusLoading}
      icon={() =>
        trackOrderLoading ? (
          <ActivityIndicator size={14} color={theme.colors.primary} />
        ) : (
          <></>
        )
      }
      onPress={handleFetchTrackOrderDetails}>
      Track
    </Button>
  );
};
export default TrackOrderButton;
