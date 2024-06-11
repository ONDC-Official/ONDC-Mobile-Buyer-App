import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {
  API_BASE_URL,
  ISSUE,
  ON_ISSUE,
  RAISE_ISSUE,
} from '../../../../../utils/apiActions';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {showToastWithGravity} from '../../../../../utils/utils';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {SSE_TIMEOUT} from '../../../../../utils/constants';
import {useAppTheme} from '../../../../../utils/theme';
import InputField from '../../../../../components/input/InputField';
import {useTranslation} from 'react-i18next';

const CancelToken = axios.CancelToken;
const EscalateForm = ({
  hideEscalateModalVisible,
  onSuccess,
}: {
  hideEscalateModalVisible: () => void;
  onSuccess: (data: any[]) => void;
}) => {
  const {t} = useTranslation();
  const source = useRef<any>(null);
  const eventTimeOutRef = useRef<any>(null);
  const responseRef = useRef<any[]>([]);
  const [remarks, setRemarks] = useState<string>('');
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const {complaintDetails} = useSelector(
    ({complaintReducer}) => complaintReducer,
  );
  const {token} = useSelector(({authReducer}) => authReducer);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  // on Issue api
  const getPartialCancelOrderDetails = async (
    message_id: any,
    issueActions: any,
  ) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ON_ISSUE}${message_id}`,
        source.current.token,
      );
      let successData = [
        {
          respondent_action: 'ESCALATE',
          short_desc: remarks,
          updated_at: new Date(),
          updated_by: issueActions.complainant_actions[0].updated_by,
        },
      ];
      responseRef.current = [...responseRef.current, data];
      if (data?.message) {
        setApiInProgress(false);
        let respondentArray =
          data.message?.issue?.issue_actions?.respondent_actions;
        let processObj = respondentArray[respondentArray.length - 1];
        onSuccess([...successData, processObj]);
      } else {
        setApiInProgress(false);
        onSuccess(successData);
      }
    } catch (err: any) {
      setApiInProgress(false);
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.eventSource.close();
      clearTimeout(eventTimeOutRef.current.timer);
    }
  };

  const onEscalateIssue = (messageId: any, issueActions: any) => {
    const eventSource = new RNEventSource(
      `${API_BASE_URL}${ISSUE}${messageId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    eventSource.addEventListener('on_issue', (event: any) => {
      const data = JSON.parse(event.data);
      getPartialCancelOrderDetails(data.messageId, issueActions)
        .then(() => {})
        .catch((error: any) => {
          console.log(error);
        });
    });

    const timer = setTimeout(() => {
      eventTimeOutRef.current.eventSource.close();
      clearTimeout(eventTimeOutRef.current.timer);
      if (responseRef.current.length <= 0) {
        setApiInProgress(false);
        return;
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = {
      eventSource,
      timer,
    };
  };

  const escalateComplaint = async () => {
    try {
      setApiInProgress(true);
      const formData = {
        context: {
          action: 'issue',
          time: new Date(),
          transaction_id: complaintDetails?.transaction_id,
        },
        message: {
          issue: {
            id: complaintDetails?.issueId,
            status: 'OPEN',
            issue_type: 'GRIEVANCE',
            updated_at: new Date(),
            created_at: complaintDetails?.created_at,
            issue_actions: {
              complainant_actions: [
                ...complaintDetails?.issue_actions.complainant_actions,
                {
                  complainant_action: 'ESCALATE',
                  short_desc: remarks,
                  updated_at: new Date(),
                  updated_by:
                    complaintDetails?.issue_actions.complainant_actions[0]
                      .updated_by,
                },
              ],
            },
          },
        },
      };

      source.current = CancelToken.source();
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${RAISE_ISSUE}`,
        formData,
        source.current.token,
      );
      //Error handling workflow eg, NACK
      if (data.message && data.message.ack.status === 'NACK') {
        showToastWithGravity(
          t('Global.Something went wrong, please try again after some time'),
        );
        setApiInProgress(false);
      } else {
        onEscalateIssue(
          data.context?.message_id,
          complaintDetails?.issue_actions,
        );
      }
    } catch (err: any) {
      showToastWithGravity(err?.message);
      setApiInProgress(false);
    } finally {
      setApiInProgress(false);
    }
  };

  return (
    <View style={styles.modal}>
      <View style={styles.modalHeader}>
        <Text variant={'titleLarge'} style={styles.title}>
          {t('Escalate Form.Escalate')}
        </Text>
        <TouchableOpacity onPress={hideEscalateModalVisible}>
          <Icon name={'clear'} size={24} color={theme.colors.neutral400} />
        </TouchableOpacity>
      </View>
      <View style={styles.modalContainer}>
        <InputField
          inputLabel={'Remarks'}
          dense
          required
          value={remarks}
          mode={'outlined'}
          placeholder={'Enter the remarks'}
          onChangeText={(text: string) => setRemarks(text)}
        />
        <View style={styles.buttonContainer}>
          <Button
            contentStyle={styles.buttonContent}
            style={styles.button}
            mode={'outlined'}
            onPress={hideEscalateModalVisible}>
            Cancel
          </Button>
          <Button
            contentStyle={styles.buttonContent}
            style={styles.button}
            onPress={escalateComplaint}
            mode={'contained'}
            disabled={remarks.length === 0 || apiInProgress}>
            Confirm
          </Button>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    modal: {
      backgroundColor: colors.white,
      borderRadius: 16,
      margin: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral100,
    },
    title: {
      color: colors.neutral400,
    },
    modalContainer: {
      padding: 16,
    },
    buttonContainer: {
      marginTop: 28,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    button: {
      flex: 1,
      borderRadius: 8,
      borderColor: colors.primary,
    },
    buttonContent: {
      height: 44,
    },
  });

export default EscalateForm;
