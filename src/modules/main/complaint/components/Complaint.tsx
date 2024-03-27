import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {ISSUE_TYPES} from '../../../../utils/issueTypes';
import {updateComplaint} from '../../../../redux/complaint/actions';
import ComplaintStatus from './ComplaintStatus';
import {useAppTheme} from '../../../../utils/theme';

const categories = ISSUE_TYPES.map(item => {
  return item.subCategory.map(subcategoryItem => {
    return {
      ...subcategoryItem,
      category: item.value,
      label: subcategoryItem.value,
    };
  });
}).flat();

const Complaint = ({complaint}: {complaint: any}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<any>();

  const {issue_status, order_details} = complaint;

  const address = order_details?.fulfillments[0]?.end?.location?.address;

  const navigateToDetails = () => {
    dispatch(updateComplaint(complaint));
    navigation.navigate('ComplaintDetails');
  };

  return (
    <View style={styles.container}>
      <FastImage
        source={{
          uri: order_details?.items[0]?.product?.descriptor?.symbol,
        }}
        style={styles.image}
      />
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text
            variant={'bodyLarge'}
            style={styles.title}
            ellipsizeMode={'tail'}
            numberOfLines={1}>
            {order_details?.items[0]?.product?.descriptor?.name}
          </Text>
          <ComplaintStatus status={issue_status} />
        </View>
        <Text variant={'labelMedium'} style={styles.address}>
          {address?.building},{address?.locality},{address?.city},
          {address?.state},{address?.country} - {address?.area_code}
        </Text>
        <View style={styles.row}>
          <Text variant={'labelSmall'} style={styles.label}>
            {complaint?.category}:{' '}
          </Text>
          <Text variant={'labelLarge'} style={styles.value} numberOfLines={2}>
            {categories.find(one => one.enums === complaint?.sub_category)
              ?.value ?? 'NA'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant={'labelSmall'} style={styles.label}>
            {t('Complaint.Issue Id')}:{' '}
          </Text>
          <Text variant={'labelLarge'} style={styles.value} numberOfLines={2}>
            {complaint?.issueId}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant={'labelSmall'} style={styles.label}>
            {t('Complaint.Issue Raised On')}:{' '}
          </Text>
          <Text variant={'labelLarge'} style={styles.value}>
            {moment(complaint?.created_at).format('DD MMM YYYY hh:mma')}
          </Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity onPress={navigateToDetails} style={styles.button}>
            <Text variant={'labelLarge'} style={styles.buttonLabel}>
              {t('Complaint.View Summary')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
      borderRadius: 8,
      borderColor: colors.neutral100,
      backgroundColor: colors.white,
      borderWidth: 1,
      marginBottom: 16,
    },
    image: {
      width: 52,
      height: 52,
      borderRadius: 12,
      marginRight: 12,
    },
    details: {
      flex: 1,
    },
    title: {
      color: colors.neutral400,
    },
    address: {
      color: colors.neutral300,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    label: {
      color: colors.neutral300,
    },
    value: {
      color: colors.neutral400,
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
    },
    button: {
      borderRadius: 8,
      borderColor: colors.primary,
      height: 28,
      width: 117,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonLabel: {
      color: colors.primary,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

export default Complaint;
