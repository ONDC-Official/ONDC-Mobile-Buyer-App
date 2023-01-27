import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import RNEventSource from 'react-native-event-source';
import {Linking} from 'react-native';

import {getData, postData} from '../../../../../utils/api';
import {
  BASE_URL,
  ON_TRACK_ORDER,
  TRACK_ORDER,
} from '../../../../../utils/apiUtilities';
import {useIsFocused} from '@react-navigation/native';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {FAQS} from '../../../../../utils/Constants';

export default (bppId, transactionId, orderId) => {
  const isFocused = useIsFocused();
  const {handleApiError} = useNetworkErrorHandling();
  const {token} = useSelector(({authReducer}) => authReducer);
  const [trackInProgress, setTrackInProgress] = useState(false);
  const [trackMessageId, setTrackMessageId] = useState(null);

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
            transaction_id: transactionId,
            bpp_id: bppId,
          },
          message: {order_id: orderId},
        },
      ];
      const {data} = await postData(`${BASE_URL}${TRACK_ORDER}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data[0].message.ack.status === 'ACK') {
        setTrackMessageId(data[0].context.message_id);
      }
    } catch (e) {
      setTrackInProgress(false);
      handleApiError(e);
    }
  };

  const removeEvents = eventSource => {
    if (eventSource) {
      eventSource.removeAllListeners();
      eventSource.close();
      setTrackInProgress(false);
    }
  };

  const onTrackOrder = async messageId => {
    try {
      const {data} = await getData(
        `${BASE_URL}${ON_TRACK_ORDER}messageIds=${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data[0].message.tracking.status === 'active') {
        const supported = await Linking.canOpenURL(FAQS);
        if (supported) {
          await Linking.openURL(FAQS);
          setTrackInProgress(false);
        }
      }
    } catch (e) {
      handleApiError(e);
      setTrackInProgress(false);
    }
  };

  useEffect(() => {
    let eventSource;
    let timer;
    if (trackMessageId && isFocused) {
      eventSource = new RNEventSource(
        `${BASE_URL}/clientApis/events?messageId=${trackMessageId}`,
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
  }, [trackMessageId, isFocused]);

  return {
    trackOrder,
    trackInProgress,
  };
};
