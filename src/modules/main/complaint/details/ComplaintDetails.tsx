import {ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Button, List, Modal, Portal, Text} from 'react-native-paper';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {ISSUE_TYPES} from '../../../../utils/issueTypes';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';
import {useAppTheme} from '../../../../utils/theme';
import GetStatusButton from '../components/GetStatusButton';
import ComplaintStatus from '../components/ComplaintStatus';
import EscalateForm from './components/EscalateForm';
import CloseForm from './components/CloseForm';
import {compareDateWithDuration} from '../../../../utils/utils';
import {updateComplaint} from '../../../../redux/complaint/actions';
import useFormatDate from '../../../../hooks/useFormatDate';
import useFormatNumber from '../../../../hooks/useFormatNumber';

const categories = ISSUE_TYPES.map(item => {
  return item.subCategory.map(subcategoryItem => {
    return {
      ...subcategoryItem,
      category: item.value,
      label: subcategoryItem.value,
    };
  });
}).flat();

const ComplaintDetails = () => {
  const {formatNumber} = useFormatNumber();
  const {formatDate} = useFormatDate();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {complaintDetails} = useSelector(
    ({complaintReducer}) => complaintReducer,
  );
  const [actions, setActions] = useState<any[]>([]);
  const [escalateModalVisible, setEscalateModalVisible] =
    useState<boolean>(false);
  const [takeAction, setTakeAction] = useState<boolean>(false);
  const [closeModalVisible, setCloseModalVisible] = useState<boolean>(false);

  const hideEscalateModalVisible = () => setEscalateModalVisible(false);
  const showEscalateModalVisible = () => setEscalateModalVisible(true);

  const hideCloseModal = () => setCloseModalVisible(false);
  const showCloseModal = () => setCloseModalVisible(true);

  const escalationSuccess = (list: any) => {
    setActions([...actions, ...list]);
  };

  const closeSuccess = (list: any) => {
    setActions([...actions, ...list]);
    dispatch(
      updateComplaint(
        Object.assign({}, complaintDetails, {
          issue_status: 'Close',
        }),
      ),
    );
  };

  const mergeIssueActions = (list: any) => {
    let resActions = list.respondent_actions,
      comActions = list.complainant_actions.map((item: any) => {
        return {...item, respondent_action: item.complainant_action};
      }),
      mergedActions = [...comActions, ...resActions];

    mergedActions.sort(
      (a, b) =>
        new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
    );
    let showTakeAction = false;
    const lastAction =
      mergedActions[mergedActions.length - 1]?.respondent_action;
    if (
      lastAction === 'PROCESSING' ||
      lastAction === 'OPEN' ||
      lastAction === 'ESCALATE'
    ) {
      showTakeAction = compareDateWithDuration(
        process.env.EXPECTED_RESPONSE_TIME ?? 'PT1H',
        mergedActions[mergedActions.length - 1]?.updated_at,
      );
    } else {
      showTakeAction =
        lastAction !== 'ESCALATE' &&
        mergedActions.some(x => x.respondent_action === 'RESOLVED');
    }
    setTakeAction(showTakeAction);
    setActions(mergedActions);
  };

  useEffect(() => {
    if (complaintDetails) {
      mergeIssueActions(complaintDetails?.issue_actions);
    }
  }, [complaintDetails]);

  useEffect(() => {
    navigation.setOptions({
      title: t('Complaint Details.Complaint Details'),
    });
  }, []);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.pageContainer}>
        <View style={styles.accordionContainer}>
          <List.Accordion
            style={styles.accordion}
            title={
              <Text variant={'headlineSmall'} style={styles.accordionTitle}>
                {t('Complaint Details.Complaint Details')}
              </Text>
            }>
            <View style={styles.accordionDetails}>
              {actions.map((action: any, actionIndex: number) => (
                <View style={styles.process} key={action?.respondent_action}>
                  <View style={styles.dotContainer}>
                    <View style={styles.dot}>
                      <View style={styles.innerDot} />
                    </View>
                    {actionIndex !== actions.length - 1 && (
                      <View style={styles.dottedLine} />
                    )}
                  </View>
                  <View style={styles.processDetails}>
                    <View style={styles.processHeader}>
                      <Text variant={'labelLarge'} style={styles.actionTitle}>
                        {action?.respondent_action} (Issue)
                      </Text>
                      <Text variant={'labelMedium'} style={styles.date}>
                        {formatDate(
                          moment(action?.updated_at),
                          'DD MMM YYYY hh:mma',
                        )}
                      </Text>
                    </View>
                    <Text
                      variant={'labelLarge'}
                      style={styles.shortDescription}>
                      {action?.short_desc}
                    </Text>
                    {!!action?.updated_by && (
                      <Text variant={'labelMedium'} style={styles.updateByText}>
                        {t('Complaint Details.Updated by')}:{' '}
                        {action?.updated_by?.person?.name}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </List.Accordion>
        </View>
        <View style={styles.card}>
          <View style={styles.orderIdRow}>
            <View style={styles.orderId}>
              <Text variant={'bodySmall'} style={styles.text}>
                {t('Complaint Details.Issue Id')}:{' '}
              </Text>
              <Text
                variant={'bodyLarge'}
                style={styles.text}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {complaintDetails?.issueId}
              </Text>
            </View>
            <ComplaintStatus status={complaintDetails?.issue_status} />
          </View>
          <View style={styles.row}>
            <Text variant={'bodySmall'} style={styles.text}>
              {t('Complaint Details.Level')}:{' '}
            </Text>
            <Text variant={'bodyLarge'} style={styles.text}>
              {t('Complaint Details.Issue')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant={'bodySmall'} style={styles.text}>
              {t('Complaint Details.Order Id')}:{' '}
            </Text>
            <Text variant={'bodyLarge'} style={styles.text}>
              {complaintDetails?.order_details?.id}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant={'labelLarge'} style={styles.issueRaisedOn}>
              {t('Complaint Details.Issue Raised On')}:{' '}
              {formatDate(
                moment(complaintDetails?.created_at),
                'DD MMM YYYY hh:mma',
              )}{' '}
              | Fulfillment :{' '}
              {categories.find(
                one => one.enums === complaintDetails?.sub_category,
              )?.value ?? 'NA'}
            </Text>
          </View>
          {complaintDetails?.order_details?.items?.map((item: any) => (
            <View
              key={`${item.id}${item.fulfillment_id}`}
              style={styles.itemRow}>
              <Text variant={'bodyLarge'} style={styles.itemTitle}>
                {item?.product?.descriptor?.name}
              </Text>
              <View style={styles.itemContainer}>
                <Text variant={'bodySmall'} style={styles.qty}>
                  {t('Complaint Details.QTY')}: {item?.quantity?.count} X{' '}
                  {CURRENCY_SYMBOLS[item?.product?.price?.currency]}
                  {formatNumber(item?.product?.price?.value)}
                </Text>
                <Text variant={'bodyLarge'} style={styles.itemQuantity}>
                  {CURRENCY_SYMBOLS[item?.product?.price?.currency]}
                  {formatNumber(
                    item?.quantity?.count * item?.product?.price?.value,
                  )}
                </Text>
              </View>
            </View>
          ))}

          <Text variant={'bodyLarge'} style={styles.itemTitle}>
            {complaintDetails?.description?.short_desc}
          </Text>
          <Text variant={'bodySmall'} style={styles.itemDescription}>
            {complaintDetails?.description?.long_desc}
          </Text>

          <Text variant={'bodyLarge'} style={styles.itemTitle}>
            {t('Complaint Details.Expected Response Time')}
          </Text>
          <Text variant={'bodySmall'} style={styles.itemDescription}>
            {formatDate(
              moment(complaintDetails?.created_at).add(
                moment.duration('PT1H').asMilliseconds(),
                'milliseconds',
              ),
              'hh:mm a, MMMM Do, YYYY',
            )}
          </Text>

          <Text variant={'bodyLarge'} style={styles.itemTitle}>
            {t('Complaint Details.Expected Resolution Time')}
          </Text>
          <Text variant={'bodySmall'} style={styles.itemDescription}>
            {formatDate(
              moment(complaintDetails?.created_at).add(
                moment.duration('P1D').asMilliseconds(),
                'milliseconds',
              ),
              'hh:mm a, MMMM Do, YYYY',
            )}
          </Text>

          <View style={styles.actionButtonContainer}>
            {!takeAction ? (
              <GetStatusButton
                mergeIssueActions={mergeIssueActions}
                complainantActions={
                  complaintDetails?.issue_actions?.complainant_actions
                }
                transactionId={complaintDetails?.transaction_id}
                bppId={complaintDetails?.bppId}
                issueId={complaintDetails?.issueId}
                domain={complaintDetails?.domain}
              />
            ) : (
              <View style={styles.actionButtonContainer}>
                <Button
                  mode="outlined"
                  contentStyle={styles.actionButtonContent}
                  style={styles.actionButton}
                  onPress={showEscalateModalVisible}>
                  {t('Complaint Details.Escalate')}
                </Button>

                {complaintDetails?.issue_status !== 'Close' && (
                  <Button
                    onPress={showCloseModal}
                    mode="outlined"
                    contentStyle={styles.actionButtonContent}
                    style={styles.cancelButton}
                    textColor={theme.colors.error}>
                    {t('Complaint Details.Close')}
                  </Button>
                )}
              </View>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <Text variant={'headlineSmall'} style={styles.title}>
            {t('Complaint Details.Respondent Details')}
          </Text>

          <Text variant={'bodyLarge'} style={styles.itemTitle}>
            {t('Complaint Details.Phone')}
          </Text>
          <Text variant={'bodySmall'} style={styles.itemDescription}>
            {complaintDetails?.issue_actions?.respondent_actions[
              complaintDetails?.issue_actions.respondent_actions.length - 1
            ]?.updated_by?.contact?.phone ?? 'N/A'}
          </Text>

          <Text variant={'bodyLarge'} style={styles.itemTitle}>
            {t('Complaint Details.Email')}
          </Text>
          <Text variant={'bodySmall'} style={styles.itemDescription}>
            {complaintDetails?.issue_actions?.respondent_actions[
              complaintDetails?.issue_actions.respondent_actions.length - 1
            ]?.updated_by?.contact?.email ?? 'N/A'}
          </Text>
        </View>
      </ScrollView>
      <Portal>
        <Modal
          visible={escalateModalVisible}
          onDismiss={hideEscalateModalVisible}>
          <EscalateForm
            hideEscalateModalVisible={hideEscalateModalVisible}
            onSuccess={escalationSuccess}
          />
        </Modal>
      </Portal>
      <Portal>
        <Modal visible={closeModalVisible} onDismiss={hideCloseModal}>
          <CloseForm hideModal={hideCloseModal} onSuccess={closeSuccess} />
        </Modal>
      </Portal>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    pageContainer: {
      padding: 16,
    },
    card: {
      borderWidth: 1,
      borderColor: colors.neutral100,
      borderRadius: 12,
      padding: 16,
      backgroundColor: colors.white,
      marginBottom: 12,
    },
    accordionContainer: {
      marginBottom: 12,
    },
    accordion: {
      borderWidth: 1,
      borderColor: colors.neutral100,
      borderRadius: 12,
      backgroundColor: colors.white,
    },
    accordionTitle: {
      color: colors.neutral400,
    },
    accordionDetails: {
      padding: 16,
      backgroundColor: colors.white,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
    title: {
      marginBottom: 16,
    },
    process: {
      flexDirection: 'row',
    },
    dot: {
      width: 20,
      height: 20,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerDot: {
      width: 10,
      height: 10,
      borderRadius: 20,
      backgroundColor: colors.white,
    },
    dotContainer: {
      marginRight: 8,
    },
    dottedLine: {
      borderLeftWidth: 2,
      borderLeftColor: colors.primary,
      borderStyle: 'solid',
      height: 60,
      marginLeft: 9,
    },
    processDetails: {
      flex: 1,
    },
    processHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    actionTitle: {
      color: colors.neutral400,
    },
    date: {
      color: colors.neutral300,
    },
    shortDescription: {
      marginBottom: 4,
      color: colors.neutral400,
    },
    orderIdRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    orderId: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      flex: 1,
      marginRight: 16,
    },
    text: {
      color: colors.neutral400,
    },
    issueRaisedOn: {
      color: colors.neutral300,
    },
    row: {
      marginBottom: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    itemTitle: {
      marginBottom: 4,
      color: colors.neutral400,
    },
    itemRow: {
      marginTop: 16,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    itemDescription: {
      marginBottom: 16,
      color: colors.neutral300,
    },
    qty: {
      color: colors.neutral300,
    },
    itemQuantity: {
      color: colors.neutral400,
    },
    actionButtonContent: {
      height: 36,
    },
    actionButton: {
      borderRadius: 8,
      borderColor: colors.primary,
    },
    buttonSeparator: {
      width: 6,
    },
    cancelButton: {
      borderRadius: 8,
      borderColor: colors.error,
    },
    updateBy: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    updateByText: {
      color: colors.neutral400,
    },
    actionButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
  });

export default ComplaintDetails;
