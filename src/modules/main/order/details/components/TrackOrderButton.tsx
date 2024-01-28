import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import React, {useRef, useState} from 'react';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';
// @ts-ignore
import RNEventSource from 'react-native-event-source';

import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {SSE_TIMEOUT} from '../../../../../utils/constants';
import {makeButtonStyles} from './buttonStyles';
import {updateRequestingTracker} from '../../../../../redux/order/actions';
import {API_BASE_URL, TRACK_ORDER} from '../../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../../utils/utils';

interface TrackOrderButton {}

const CancelToken = axios.CancelToken;
const screenHeight: number = Dimensions.get('screen').height;
const TrackOrderButton: React.FC<TrackOrderButton> = ({}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = makeButtonStyles(theme.colors);
  const trackingSheet = useRef<any>(null);
  const {orderDetails, requestingStatus, requestingTracker} = useSelector(
    ({orderReducer}) => orderReducer,
  );
  const trackEventSourceResponseRef = useRef<any>(null);
  const {token} = useSelector(({authReducer}) => authReducer);
  const source = useRef<any>(null);
  const eventTimeOutRef = useRef<any>(null);
  const [trackingUrl, setTrackingUrl] = useState<string>('');
  const [tracking, setTracking] = useState<any>(null);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();

  // TRACK APIS
  // use this api to track and order
  const handleFetchTrackOrderDetails = async () => {
    trackEventSourceResponseRef.current = [];
    dispatch(updateRequestingTracker(true));
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
      dispatch(updateRequestingTracker(false));
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
        dispatch(updateRequestingTracker(false));
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
      dispatch(updateRequestingTracker(false));
      trackEventSourceResponseRef.current = [
        ...trackEventSourceResponseRef.current,
        data[0],
      ];
      const {message} = data[0];
      if (message.tracking.status === 'active' && message.tracking.url === '') {
        setTracking(null);
        dispatch(updateRequestingTracker(false));
        showToastWithGravity(
          'Tracking information is not provided by the provider.',
        );
        return;
      } else if (message?.tracking?.url === '') {
        setTracking(null);
        dispatch(updateRequestingTracker(false));
        showToastWithGravity(
          'Tracking information not available for this product',
        );
        return;
      } else if (
        message.tracking.status === 'active' &&
        (message?.tracking?.url !== '' || message?.tracking?.url !== undefined)
      ) {
        dispatch(updateRequestingTracker(false));
        setTrackingUrl(message?.tracking?.url);
        trackingSheet.current.open();
        setTracking(null);
      } else if (
        message.tracking.status === 'active' &&
        message?.tracking?.location?.gps
      ) {
        setTracking(message?.tracking);
      } else {
        setTracking(null);
        dispatch(updateRequestingTracker(false));
        showToastWithGravity(
          'Tracking information is not provided by the provider.',
        );
        return;
      }
    } catch (err: any) {
      dispatch(updateRequestingTracker(false));
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.forEach((timeout: any) => {
        timeout.eventSource.close();
        clearTimeout(timeout.timer);
      });
    }
  };

  const hideTrackingSheet = () => trackingSheet?.current?.close();

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        disabled={requestingTracker || requestingStatus}
        onPress={handleFetchTrackOrderDetails}>
        {requestingTracker ? (
          <ActivityIndicator size={14} color={theme.colors.primary} />
        ) : (
          <></>
        )}
        <Text variant={'bodyMedium'} style={styles.label}>
          Track
        </Text>
      </TouchableOpacity>
      <RBSheet
        ref={trackingSheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
          wrapper: styles.wrapper,
        }}>
        <View style={styles.closeSheet}>
          <TouchableOpacity onPress={hideTrackingSheet}>
            <Icon name={'close-circle'} color={theme.colors.error} size={32} />
          </TouchableOpacity>
        </View>
        <WebView style={styles.webView} source={{uri: trackingUrl}} />
      </RBSheet>
    </>
  );
};
export default TrackOrderButton;
