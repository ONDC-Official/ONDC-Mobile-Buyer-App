import {ActivityIndicator, Button} from 'react-native-paper';
import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
// @ts-ignore
import RNEventSource from 'react-native-event-source';

import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {
  API_BASE_URL,
  ISSUE,
  ISSUE_STATUS,
  ON_ISSUE_STATUS,
} from '../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../utils/utils';
import {SSE_TIMEOUT} from '../../../../utils/constants';
import {useAppTheme} from '../../../../utils/theme';

const CancelToken = axios.CancelToken;
const GetStatusButton = ({
  transactionId,
  bppId,
  issueId,
  domain,
}: {
  transactionId: any;
  bppId: any;
  issueId: any;
  domain: any;
}) => {
  const {token} = useSelector(({authReducer}) => authReducer);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const source = useRef<any>(null);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const cancelPartialEventSourceResponseRef = useRef<any[]>([]);
  const eventTimeOutRef = useRef<any>(null);
  const responseRef = useRef<any[]>([]);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const getIssueStatusDetails = async (messageId: any) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ON_ISSUE_STATUS}${messageId}`,
        source.current.token,
      );
      cancelPartialEventSourceResponseRef.current = [
        ...cancelPartialEventSourceResponseRef.current,
        data,
      ];
      setStatusLoading(false);
      if (data?.message) {
        console.log(JSON.stringify(data.message, undefined, 4));
        // mergeRespondantArrays({
        //   respondent_actions:
        //     data.message.issue?.issue_actions.respondent_actions,
        //   complainant_actions: issue_actions.complainant_actions,
        // });
        // dispatch({
        //   type: toast_actions.ADD_TOAST,
        //   payload: {
        //     id: Math.floor(Math.random() * 100),
        //     type: toast_types.success,
        //     message: 'Complaint status updated successfully!',
        //   },
        // });
      } else {
        showToastWithGravity(
          'Something went wrong!, issue status cannot be fetched',
        );
      }
    } catch (err: any) {
      setStatusLoading(false);
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.forEach(({eventSource, timer}) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  };

  const fetchIssueStatusThroughEvents = (messageId: any) => {
    const eventSource = new RNEventSource(
      `${API_BASE_URL}${ISSUE}${messageId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    eventSource.addEventListener('on_issue_status', (event: any) => {
      const data = JSON.parse(event.data);
      getIssueStatusDetails(data.messageId)
        .then(() => {})
        .catch((error: any) => {
          console.log(error);
        });
    });

    const timer = setTimeout(() => {
      eventTimeOutRef.current.eventSource.close();
      clearTimeout(eventTimeOutRef.current.timer);
      if (responseRef.current.length <= 0) {
        setStatusLoading(false);
        return;
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = {
      eventSource,
      timer,
    };
  };

  const checkIssueStatus = async () => {
    cancelPartialEventSourceResponseRef.current = [];
    setStatusLoading(true);
    try {
      source.current = CancelToken.source();
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${ISSUE_STATUS}`,
        {
          context: {
            transaction_id: transactionId,
            bpp_id: bppId,
            domain,
          },
          message: {
            issue_id: issueId,
          },
        },
        source.current.token,
      );
      //Error handling workflow eg, NACK
      if (data.message && data.message.ack.status === 'NACK') {
        setStatusLoading(false);
        showToastWithGravity('Something went wrong');
      } else {
        fetchIssueStatusThroughEvents(data.context?.message_id);
      }
    } catch (err: any) {
      setStatusLoading(false);
      showToastWithGravity(err?.message);
      handleApiError(err);
    }
  };

  return (
    <Button
      contentStyle={styles.actionButtonContent}
      disabled={statusLoading}
      icon={() =>
        statusLoading ? (
          <ActivityIndicator size={14} color={theme.colors.primary} />
        ) : (
          <></>
        )
      }
      mode="outlined"
      style={styles.actionButton}
      onPress={checkIssueStatus}>
      Get Status
    </Button>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    actionButton: {
      borderRadius: 8,
      borderColor: colors.primary,
    },
    actionButtonContent: {
      height: 36,
    },
  });

export default GetStatusButton;
