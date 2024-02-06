import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, Text, useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {ISSUE_TYPES} from '../../../../utils/issueTypes';
import {updateComplaint} from '../../../../redux/complaint/actions';
import ComplaintStatus from './ComplaintStatus';

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
  const dispatch = useDispatch();
  const theme = useTheme();
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
          <Text variant={'bodyMedium'} style={styles.title}>
            {order_details?.items[0]?.product?.descriptor?.name}
          </Text>
          <ComplaintStatus status={issue_status} />
        </View>
        <Text variant={'labelMedium'} style={styles.address}>
          {address?.building},{address?.locality},{address?.city},
          {address?.state},{address?.country} - {address?.area_code}
        </Text>
        <View style={styles.row}>
          <Text variant={'labelMedium'} style={styles.label}>
            {complaint?.category}:{' '}
          </Text>
          <Text variant={'labelMedium'} style={styles.value}>
            {categories.find(one => one.enums === complaint?.sub_category)
              ?.value ?? 'NA'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant={'labelMedium'} style={styles.label}>
            Issue Id:{' '}
          </Text>
          <Text variant={'labelMedium'} style={styles.value}>
            {complaint?.issueId}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant={'labelMedium'} style={styles.label}>
            Issue Raised On:{' '}
          </Text>
          <Text variant={'labelMedium'} style={styles.value}>
            {moment(complaint?.created_at).format('DD MMM YYYY hh:mma')}
          </Text>
        </View>
        <View style={styles.actionContainer}>
          <Button
            mode={'outlined'}
            onPress={navigateToDetails}
            style={styles.button}>
            View Summary
          </Button>
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
      marginTop: 16,
      paddingHorizontal: 16,
    },
    image: {
      width: 52,
      height: 52,
      borderRadius: 12,
      marginRight: 8,
    },
    details: {
      flex: 1,
    },
    title: {
      color: '#222222',
    },
    address: {
      color: '#686868',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    label: {
      color: '#686868',
    },
    value: {
      color: '#222222',
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
    },
    button: {
      borderRadius: 8,
      borderColor: colors.primary,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

export default Complaint;
