import {ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Button, Text} from 'react-native-paper';
import moment from 'moment';
import {ISSUE_TYPES} from '../../../../utils/issueTypes';
import {CURRENCY_SYMBOLS} from '../../../../utils/constants';
import {compareDateWithDuration} from '../../../../utils/utils';
import {theme} from '../../../../utils/theme';
import GetStatusButton from '../components/GetStatusButton';

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
  const {complaintDetails} = useSelector(
    ({complaintReducer}) => complaintReducer,
  );
  const [actions, setActions] = useState<any[]>([]);
  const [showTakeActionButton, setShowTakeActionButton] =
    useState<boolean>(false);

  useEffect(() => {
    const mergeIssueActions = (actions: any) => {
      let resActions = actions.respondent_actions,
        comActions = actions.complainant_actions.map((item: any) => {
          return {...item, respondent_action: item.complainant_action};
        }),
        mergedActions = [...comActions, ...resActions];

      mergedActions.sort(
        (a, b) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      );
      const lastAction =
        mergedActions[mergedActions.length - 1]?.respondent_action;
      if (
        lastAction === 'PROCESSING' ||
        lastAction === 'OPEN' ||
        lastAction === 'ESCALATE'
      ) {
        setShowTakeActionButton(
          compareDateWithDuration(
            'PT1H',
            mergedActions[mergedActions.length - 1]?.updated_at,
          ),
        );
      } else if (
        lastAction !== 'ESCALATE' &&
        mergedActions.some(x => x.respondent_action === 'RESOLVED')
      ) {
        setShowTakeActionButton(true);
      } else {
        setShowTakeActionButton(false);
      }
      console.log(JSON.stringify(mergedActions, undefined, 4));
      setActions(mergedActions);
    };

    if (complaintDetails) {
      mergeIssueActions(complaintDetails?.issue_actions);
    }
  }, [complaintDetails]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.pageContainer}>
      <View style={styles.card}>
        <Text variant={'titleMedium'} style={styles.title}>
          Complaint Details
        </Text>
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
                <Text variant={'labelMedium'} style={styles.actionTitle}>
                  {action?.complainant_action}
                </Text>
                <Text variant={'labelMedium'} style={styles.actionTitle}>
                  {moment(action?.updated_at).format('DD MMM YYYY hh:mma')}
                </Text>
              </View>
              <Text variant={'labelMedium'} style={styles.shortDescription}>
                {action?.short_desc}
              </Text>
              {!!action?.updated_by && (
                <Text variant={'labelMedium'}>
                  Updated by: {action?.updated_by?.person?.name}
                </Text>
              )}
            </View>
          </View>
        ))}
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
          <View>
            <Text variant={'bodyMedium'}>{complaintDetails?.issue_status}</Text>
          </View>
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
            {moment(complaintDetails?.created_at).format('DD MMM YYYY hh:mma')}{' '}
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

        {showTakeActionButton ? (
          <Button mode="outlined" style={styles.actionButton}>
            Take Action
          </Button>
        ) : (
          <GetStatusButton
            transactionId={complaintDetails?.transaction_id}
            bppId={complaintDetails?.bppId}
            issueId={complaintDetails?.issueId}
            domain={complaintDetails?.domain}
          />
        )}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#686868',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
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
    backgroundColor: '#B9B9B9',
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
    borderLeftColor: '#0000001A',
    borderStyle: 'dashed',
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
    color: '#1A1A1A',
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
    color: '#1A1A1A',
  },
  row: {
    marginBottom: 4,
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
    color: '#686868',
  },
  qty: {
    color: '#686868',
  },
  actionButton: {
    borderRadius: 8,
    borderColor: theme.colors.primary,
  },
});

export default ComplaintDetails;
