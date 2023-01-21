import React, {useEffect, useState} from 'react';
import RNEventSource from 'react-native-event-source';
import {useIsFocused} from '@react-navigation/native';
import {withTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';

import ClearButton from '../../../../../components/button/ClearButton';
import {getData, postData} from '../../../../../utils/api';
import {BASE_URL, ON_SUPPORT, SUPPORT} from '../../../../../utils/apiUtilities';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';

const CallSeller = ({
  theme,
  bppId,
  transactionId,
  orderId,
  updateSellerInfo,
  setModalVisible,
}) => {
  const isFocused = useIsFocused();
  const {token} = useSelector(({authReducer}) => authReducer);
  const {handleApiError} = useNetworkErrorHandling();
  const [supportMessageId, setSupportMessageId] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);

  const getSupport = () => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    setCallInProgress(true);
    postData(
      `${BASE_URL}${SUPPORT}`,
      [
        {
          context: {
            bpp_id: bppId,
            transaction_id: transactionId,
          },
          message: {
            ref_id: orderId,
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
        setCallInProgress(false);
      });
  };

  /**
   * function request support info
   * @param messageId:message id received in get support API
   * @returns {Promise<void>}
   */
  const onGetSupport = async messageId => {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const {data} = await getData(
        `${BASE_URL}${ON_SUPPORT}messageIds=${messageId}`,
        options,
      );

      if (data[0].message.hasOwnProperty('phone')) {
        updateSellerInfo(data[0].message);
      }
      setModalVisible(true);
    } catch (error) {
      handleApiError(error);
    }
  };

  const removeEvents = eventSource => {
    if (eventSource) {
      eventSource.removeAllListeners();
      eventSource.close();
      setCallInProgress(false);
    }
  };

  useEffect(() => {
    let eventSource;
    let timer;

    if (supportMessageId && isFocused) {
      eventSource = new RNEventSource(
        `${BASE_URL}/clientApis/events?messageId=${supportMessageId}`,
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
  }, [supportMessageId, isFocused]);

  return (
    <ClearButton
      title="Call"
      onPress={getSupport}
      textColor={theme.colors.primary}
      disabled={callInProgress}
      loading={callInProgress}
    />
  );
};

export default withTheme(CallSeller);
