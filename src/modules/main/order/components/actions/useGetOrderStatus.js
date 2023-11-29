import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import RNEventSource from 'react-native-event-source';
import {useSelector} from 'react-redux';

import {getData, postData} from '../../../../../utils/api';
import {
  BASE_URL,
  GET_STATUS,
  ON_GET_STATUS,
} from '../../../../../utils/apiUtilities';
import {alertWithOneButton} from '../../../../../utils/alerts';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {showToastWithGravity} from '../../../../../utils/utils';

export default (bppId, transactionId, orderId) => {
  const isFocused = useIsFocused();
  const {handleApiError} = useNetworkErrorHandling();
  const {token} = useSelector(({authReducer}) => authReducer);
  const [statusInProgress, setStatusInProgress] = useState(false);
  const [statusMessageId, setStatusMessageId] = useState(null);

  const getStatus = async () => {
    try {
      setStatusInProgress(true);
      const payload = [
        {
          context: {
            bpp_id: bppId,
            transaction_id: transactionId,
          },
          message: {order_id: orderId},
        },
      ];
      const {data} = await postData(`${BASE_URL}${GET_STATUS}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data[0]?.message?.ack?.status === 'ACK') {
        setStatusMessageId(`${data[0].context.message_id}`);
      } else {
        alertWithOneButton(
          'Unable to Call',
          'Unable to place your call currently, please try again',
          'Ok',
          () => {},
        );
      }
    } catch (e) {
      setStatusInProgress(false);
      handleApiError(e);
    }
  };

  const onGetStatus = async id => {
    try {
      const statusResponse = await getData(`${BASE_URL}${ON_GET_STATUS}${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setStatusInProgress(false);
      const status = statusResponse.data[0]?.message.order?.state;
      const statement = status
        ? `Your current order status is: ${status}`
        : 'Sorry, we are not able to fetch the status at the moment, Please try after sometime.';
      showToastWithGravity(statement);
    } catch (error) {
      console.error(error);
      handleApiError(error);
      setStatusInProgress(false);
    }
  };

  const removeEvents = eventSource => {
    if (eventSource) {
      eventSource.removeAllListeners();
      eventSource.close();
      setStatusInProgress(false);
    }
  };

  useEffect(() => {
    let eventSource;
    let timer;

    if (statusMessageId && isFocused) {
      eventSource = new RNEventSource(
        `${BASE_URL}/clientApis/events?messageId=${statusMessageId}`,
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
  }, [statusMessageId, isFocused]);

  return {
    getStatus,
    statusInProgress,
  };
};
