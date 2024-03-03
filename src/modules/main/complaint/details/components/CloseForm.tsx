import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {API_BASE_URL, RAISE_ISSUE} from '../../../../../utils/apiActions';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {showToastWithGravity} from '../../../../../utils/utils';
// @ts-ignore
import RNEventSource from 'react-native-event-source';
import {useAppTheme} from '../../../../../utils/theme';

const CancelToken = axios.CancelToken;
const CloseForm = ({
  hideModal,
  onSuccess,
}: {
  hideModal: () => void;
  onSuccess: (data: any[]) => void;
}) => {
  const source = useRef<any>(null);
  const [rating, setRating] = useState<string>('');
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const {complaintDetails} = useSelector(
    ({complaintReducer}) => complaintReducer,
  );
  const {postDataWithAuth} = useNetworkHandling();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

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
            id: complaintDetails.issue_id,
            status: 'CLOSED',
            rating: rating,
            updated_at: new Date(),
            created_at: complaintDetails.created_at,
            issue_actions: {
              complainant_actions: [
                ...complaintDetails.issue_actions.complainant_actions,
                {
                  complainant_action: 'CLOSE',
                  short_desc: 'Complaint closed',
                  updated_at: new Date(),
                  updated_by:
                    complaintDetails.issue_actions.complainant_actions[0]
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
        showToastWithGravity('Something went wrong');
        setApiInProgress(false);
      } else {
        onSuccess([
          {
            respondent_action: 'CLOSE',
            short_desc: 'Complaint closed',
            updated_at: new Date(),
            updated_by:
              complaintDetails.issue_actions.complainant_actions[0].updated_by,
          },
        ]);
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
        <Text variant={'titleSmall'}>Close</Text>
        <TouchableOpacity onPress={hideModal}>
          <Icon name={'clear'} size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.modalContainer}>
        <Text variant={'bodyMedium'} style={styles.message}>
          Choose Rating*
        </Text>
        <View style={styles.ratingContainer}>
          <TouchableOpacity
            onPress={() => setRating('THUMBS-UP')}
            style={[
              styles.ratingButton,
              rating === 'THUMBS-UP' ? styles.selectedRating : {},
            ]}>
            <FontAwesomeIcon name={'thumbs-o-up'} size={24} color={'#000000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setRating('THUMBS-DOWN')}
            style={[
              styles.ratingButton,
              rating === 'THUMBS-DOWN' ? styles.selectedRating : {},
            ]}>
            <FontAwesomeIcon
              name={'thumbs-o-down'}
              size={24}
              color={'#000000'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} mode={'outlined'} onPress={hideModal}>
            Cancel
          </Button>
          <View style={styles.separator} />
          <Button
            style={styles.button}
            onPress={escalateComplaint}
            mode={'contained'}
            disabled={rating.length === 0 || apiInProgress}>
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
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral100,
    },
    modalContainer: {
      padding: 12,
    },
    message: {
      color: '#1D1D1D',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    ratingButton: {
      width: 44,
      height: 44,
      marginRight: 12,
      borderColor: '#B5B5B5',
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedRating: {
      backgroundColor: colors.primary,
    },
    buttonContainer: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      flex: 1,
      borderRadius: 8,
      borderColor: colors.primary,
    },
    separator: {
      width: 15,
    },
  });

export default CloseForm;
