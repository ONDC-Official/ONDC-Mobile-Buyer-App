import {ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Button, List, Modal, Portal, Text} from 'react-native-paper';
import moment from 'moment';
import {ISSUE_TYPES} from '../../../../utils/issueTypes';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';
import {useAppTheme} from '../../../../utils/theme';
import GetStatusButton from '../components/GetStatusButton';
import ComplaintStatus from '../components/ComplaintStatus';
import EscalateForm from './components/EscalateForm';
import CloseForm from './components/CloseForm';

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
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {complaintDetails} = useSelector(
    ({complaintReducer}) => complaintReducer,
  );
  const [actions, setActions] = useState<any[]>([]);
  const [escalateModalVisible, setEscalateModalVisible] =
    useState<boolean>(false);
  const [closeModalVisible, setCloseModalVisible] = useState<boolean>(false);

  const hideEscalateModalVisible = () => setEscalateModalVisible(false);
  const showEscalateModalVisible = () => setEscalateModalVisible(true);

  const hideCloseModal = () => setCloseModalVisible(false);
  const showCloseModal = () => setCloseModalVisible(true);

  const escalationSuccess = (list: any) => {
    setActions([...actions, ...list]);
  };

  useEffect(() => {
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
      setActions(mergedActions);
    };

    if (complaintDetails) {
      mergeIssueActions(complaintDetails?.issue_actions);
    }
  }, [complaintDetails]);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.pageContainer}>
        <View style={styles.accordionContainer}>
          <List.Accordion
            style={styles.accordion}
            title="Complaint Details"
            titleStyle={styles.accordionTitle}>
            <View style={styles.accordionDetails}>
              {actions.map((action: any, actionIndex: number) => (
                <View style={styles.process} key={action?.complainant_action}>
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
                      <Text variant={'labelLarge'} style={styles.date}>
                        {moment(action?.updated_at).format(
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
                      <View style={styles.updateBy}>
                        <Text variant={'labelMedium'}>Updated by: </Text>
                        <Text variant={'labelLarge'}>
                          {action?.updated_by?.person?.name}
                        </Text>
                      </View>
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
                Issue Id:{' '}
              </Text>
              <Text variant={'bodyMedium'} style={styles.text}>
                {complaintDetails?.issueId}
              </Text>
            </View>
            <ComplaintStatus status={complaintDetails?.issue_status} />
          </View>
          <View style={styles.row}>
            <Text variant={'bodySmall'} style={styles.text}>
              Level:{' '}
            </Text>
            <Text variant={'bodyMedium'} style={styles.text}>
              Issue
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant={'bodySmall'} style={styles.text}>
              Order Id:{' '}
            </Text>
            <Text variant={'bodyMedium'} style={styles.text}>
              {complaintDetails?.order_details?.id}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant={'labelMedium'} style={styles.text}>
              Issue Raised On:{' '}
              {moment(complaintDetails?.created_at).format(
                'DD MMM YYYY hh:mma',
              )}{' '}
              | Fulfillment :{' '}
              {categories.find(
                one => one.enums === complaintDetails?.sub_category,
              )?.value ?? 'NA'}
            </Text>
          </View>
          {complaintDetails?.order_details?.items?.map((item: any) => (
            <View key={item.id}>
              <Text variant={'bodyMedium'} style={styles.itemTitle}>
                {item?.product?.descriptor?.name}
              </Text>
              <View style={styles.itemContainer}>
                <Text variant={'bodySmall'} style={styles.qty}>
                  QTY: {item?.quantity?.count} X{' '}
                  {CURRENCY_SYMBOLS[item?.product?.price?.currency]}
                  {item?.product?.price?.value}
                </Text>
                <Text variant={'bodyMedium'}>
                  {CURRENCY_SYMBOLS[item?.product?.price?.currency]}
                  {item?.quantity?.count * item?.product?.price?.value}
                </Text>
              </View>
            </View>
          ))}

          <Text variant={'bodyMedium'} style={styles.itemTitle}>
            {complaintDetails?.description?.short_desc}
          </Text>
          <Text variant={'bodyMedium'} style={styles.itemDescription}>
            {complaintDetails?.description?.long_desc}
          </Text>

          <Text variant={'bodyMedium'} style={styles.itemTitle}>
            Expected Response Time
          </Text>
          <Text variant={'bodyMedium'} style={styles.itemDescription}>
            {moment(complaintDetails?.created_at)
              .add(moment.duration('PT1H').asMilliseconds(), 'milliseconds')
              .format('hh:mm a, MMMM Do, YYYY')}
          </Text>

          <Text variant={'bodyMedium'} style={styles.itemTitle}>
            Expected Resolution Time
          </Text>
          <Text variant={'bodyMedium'} style={styles.itemDescription}>
            {moment(complaintDetails?.created_at)
              .add(moment.duration('P1D').asMilliseconds(), 'milliseconds')
              .format('hh:mm a, MMMM Do, YYYY')}
          </Text>

          <View style={styles.actionButtonContainer}>
            <GetStatusButton
              transactionId={complaintDetails?.transaction_id}
              bppId={complaintDetails?.bppId}
              issueId={complaintDetails?.issueId}
              domain={complaintDetails?.domain}
            />

            <View style={styles.buttonSeparator} />
            <Button
              mode="outlined"
              style={styles.actionButton}
              onPress={showEscalateModalVisible}>
              Escalate
            </Button>
            <View style={styles.buttonSeparator} />

            {complaintDetails?.issue_status !== 'Close' && (
              <Button
                onPress={showCloseModal}
                mode="outlined"
                style={styles.cancelButton}
                textColor={theme.colors.error}>
                Close
              </Button>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <Text variant={'titleMedium'} style={styles.title}>
            Respondent Details
          </Text>

          <Text variant={'bodyMedium'} style={styles.itemTitle}>
            Phone
          </Text>
          <Text variant={'bodyMedium'} style={styles.itemDescription}>
            {complaintDetails?.issue_actions?.respondent_actions[
              complaintDetails?.issue_actions.respondent_actions.length - 1
            ]?.updated_by?.contact?.phone ?? 'N/A'}
          </Text>

          <Text variant={'bodyMedium'} style={styles.itemTitle}>
            Email
          </Text>
          <Text variant={'bodyMedium'} style={styles.itemDescription}>
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
          <CloseForm hideModal={hideCloseModal} onSuccess={escalationSuccess} />
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
      backgroundColor: '#FFFFFF',
      marginBottom: 12,
    },
    accordionContainer: {
      marginBottom: 12,
    },
    accordion: {
      borderWidth: 1,
      borderColor: colors.neutral100,
      borderRadius: 12,
    },
    accordionTitle: {
      fontWeight: '700',
      color: '#000000',
    },
    accordionDetails: {
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
    title: {
      marginBottom: 16,
      color: '#000000',
    },
    process: {
      flexDirection: 'row',
    },
    dot: {
      width: 20,
      height: 20,
      borderRadius: 20,
      backgroundColor: '#008ECC',
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerDot: {
      width: 10,
      height: 10,
      borderRadius: 20,
      backgroundColor: '#FFF',
    },
    dotContainer: {
      marginRight: 8,
    },
    dottedLine: {
      borderLeftWidth: 2,
      borderLeftColor: '#008ECC',
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
      color: '#8A8A8A',
    },
    shortDescription: {
      marginBottom: 4,
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
    row: {
      marginBottom: 4,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    itemTitle: {
      marginBottom: 4,
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
    actionButton: {
      borderRadius: 8,
      borderColor: theme.colors.primary,
    },
    buttonSeparator: {
      width: 6,
    },
    cancelButton: {
      borderRadius: 8,
      borderColor: theme.colors.error,
    },
    updateBy: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default ComplaintDetails;
