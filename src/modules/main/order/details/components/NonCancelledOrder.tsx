import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text} from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import Actions from './Actions';
import DownloadIcon from '../../../../../assets/download.svg';
import DownloadDisabledIcon from '../../../../../assets/download_disabled.svg';
import ProviderDetails from './ProviderDetails';
import ItemDetails from './ItemDetails';
import PaymentMethod from './PaymentMethod';
import RaiseIssueButton from './RaiseIssueButton';
import CancelOrderButton from './CancelOrderButton';
import {useAppTheme} from '../../../../../utils/theme';

const NonCancelledOrder = ({
  getOrderDetails,
}: {
  getOrderDetails: () => void;
}) => {
  const navigation = useNavigation<any>();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  const invoiceAvailable = !!orderDetails?.documents;

  return (
    <View style={styles.orderDetails}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={'arrow-back'} size={24} color={colors.white} />
          </TouchableOpacity>
          <Text
            variant={'titleLarge'}
            style={styles.orderDetailsTitle}
            ellipsizeMode={'tail'}
            numberOfLines={1}>
            {orderDetails?.provider?.descriptor?.name}
          </Text>
          <View style={styles.empty} />
        </View>
        <Text variant={'headlineSmall'} style={styles.orderStatus}>
          Order {orderDetails?.state}
        </Text>
      </View>
      <ScrollView
        style={styles.pageContainer}
        contentContainerStyle={styles.scrollView}>
        <Actions onUpdateOrder={getOrderDetails} />
        <View style={styles.creationHeader}>
          <SimpleLineIcons name={'bag'} color={colors.primary} size={20} />
          {orderDetails?.state !== 'Completed' ? (
            <Text variant={'bodyLarge'} style={styles.creationDate}>
              Order placed on{' '}
              {moment(orderDetails?.createdAt).format('DD MMM hh:mm a')}
            </Text>
          ) : (
            <Text variant={'bodyLarge'} style={styles.creationDate}>
              Order completed on{' '}
              {moment(orderDetails?.updatedAt).format('DD MMM hh:mm a')}
            </Text>
          )}
        </View>
        <View style={styles.orderIdContainer}>
          <Text variant={'titleLarge'} style={styles.orderId}>
            {orderDetails?.id}
          </Text>
          {invoiceAvailable ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(orderDetails?.documents[0]?.url)}>
              <DownloadIcon width={24} height={24} />
            </TouchableOpacity>
          ) : (
            <View>
              <DownloadDisabledIcon width={24} height={24} />
            </View>
          )}
        </View>
        <ProviderDetails
          provider={orderDetails?.provider}
          bppId={orderDetails?.bppId}
          domain={orderDetails?.domain}
        />
        <ItemDetails
          items={orderDetails?.items}
          fulfillments={orderDetails?.fulfillments}
        />
        <PaymentMethod
          payment={orderDetails?.payment}
          address={orderDetails?.fulfillments[0]?.end?.location?.address}
          contact={orderDetails?.fulfillments[0]?.end?.contact}
        />
        <RaiseIssueButton getOrderDetails={getOrderDetails} />
        <CancelOrderButton />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    orderDetails: {
      flex: 1,
    },
    header: {
      backgroundColor: colors.primary,
      paddingBottom: 14,
    },
    headerRow: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    orderDetailsTitle: {
      color: colors.white,
      textAlign: 'center',
    },
    orderStatus: {
      color: colors.white,
      textAlign: 'center',
    },
    empty: {
      width: 24,
      height: 24,
    },
    pageContainer: {
      flex: 1,
      backgroundColor: colors.neutral50,
    },
    scrollView: {
      paddingBottom: 16,
    },
    creationHeader: {
      flexDirection: 'row',
      marginVertical: 20,
      alignItems: 'center',
      marginHorizontal: 16,
    },
    orderIdContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
    },
    orderId: {
      color: colors.neutral300,
    },
    creationDate: {
      marginLeft: 8,
      color: colors.neutral300,
    },
  });

export default NonCancelledOrder;
