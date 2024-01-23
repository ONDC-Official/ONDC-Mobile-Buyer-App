import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import axios from 'axios';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, ORDERS} from '../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../utils/utils';
import Actions from './components/Actions';
import ItemDetails from './components/ItemDetails';
import PaymentMethod from './components/PaymentMethod';
import RaiseIssue from './components/RaiseIssue';
import {updateOrderDetails} from '../../../../redux/order/actions';
import CancelOrderButton from './components/CancelOrderButton';
import DownloadIcon from '../../../../assets/download.svg';
import ProviderDetails from './components/ProviderDetails';

const CancelToken = axios.CancelToken;

const Skeleton = () => (
  <SkeletonPlaceholder>
    <>
      <SkeletonPlaceholder.Item width={100} marginBottom={10} height={20} />
      <SkeletonPlaceholder.Item width={100} marginBottom={10} height={20} />
      <SkeletonPlaceholder.Item width={100} marginBottom={10} height={20} />
      <SkeletonPlaceholder.Item width={100} marginBottom={10} height={20} />
    </>
  </SkeletonPlaceholder>
);
const OrderDetails = ({
  route: {params},
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const dispatch = useDispatch();
  const source = useRef<any>(null);
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const {getDataWithAuth} = useNetworkHandling();
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);
  const [apiInProgress, setApiInProgress] = useState<boolean>(true);

  const getOrderDetails = async () => {
    try {
      setApiInProgress(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ORDERS}/${params.orderId}`,
        source.current.token,
      );
      dispatch(updateOrderDetails(data[0]));
    } catch (err: any) {
      showToastWithGravity(err?.response?.data?.error?.message);
    } finally {
      setApiInProgress(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          size={24}
          icon={'share-variant'}
          iconColor={colors.primary}
          onPress={() =>
            navigation.navigate('AddDefaultAddress', {setDefault: false})
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getOrderDetails().then(() => {});
  }, []);

  if (apiInProgress) {
    return <Skeleton />;
  }

  if (orderDetails?.state === 'Cancelled') {
    return (
      <View style={styles.orderDetails}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name={'arrow-back'} size={24} color={'#fff'} />
            </TouchableOpacity>
            <Text variant={'titleSmall'} style={styles.orderDetailsTitle}>
              Order Details
            </Text>
            <View style={styles.empty} />
          </View>
          <Text variant={'titleMedium'} style={styles.orderStatus}>
            Order {orderDetails?.state}
          </Text>
        </View>
        <ScrollView style={styles.pageContainer}>
          <Actions onUpdateOrder={getOrderDetails} />
          <View style={styles.creationHeader}>
            <SimpleLineIcons name={'bag'} color={colors.primary} size={24} />
            <Text variant={'bodyMedium'} style={styles.creationDate}>
              Order placed on{' '}
              {moment(orderDetails?.createdAt).format('DD MMM hh:mm a')}
            </Text>
          </View>
          <View style={styles.orderIdContainer}>
            <Text variant={'titleSmall'} style={styles.orderId}>
              {orderDetails?.id}
            </Text>
            {!!orderDetails?.documents && (
              <TouchableOpacity
                onPress={() => Linking.openURL(orderDetails?.documents[0]?.url)}>
                <DownloadIcon width={24} height={24} />
              </TouchableOpacity>
            )}
          </View>
          <ProviderDetails provider={orderDetails?.provider} />
          <ItemDetails
            items={orderDetails?.items}
            fulfillments={orderDetails?.fulfillments}
          />
          <PaymentMethod
            payment={orderDetails?.payment}
            address={orderDetails?.fulfillments[0]?.end?.location?.address}
            contact={orderDetails?.fulfillments[0]?.end?.contact}
          />
          <RaiseIssue />
          <CancelOrderButton />
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={styles.orderDetails}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name={'arrow-back'} size={24} color={'#fff'} />
            </TouchableOpacity>
            <Text variant={'titleSmall'} style={styles.orderDetailsTitle}>
              Order Details
            </Text>
            <View style={styles.empty} />
          </View>
          <Text variant={'titleMedium'} style={styles.orderStatus}>
            Order {orderDetails?.state}
          </Text>
        </View>
        <ScrollView style={styles.pageContainer}>
          <Actions onUpdateOrder={getOrderDetails} />
          <View style={styles.creationHeader}>
            <SimpleLineIcons name={'bag'} color={colors.primary} size={24} />
            <Text variant={'bodyMedium'} style={styles.creationDate}>
              Order placed on{' '}
              {moment(orderDetails?.createdAt).format('DD MMM hh:mm a')}
            </Text>
          </View>
          <View style={styles.orderIdContainer}>
            <Text variant={'titleSmall'} style={styles.orderId}>
              {orderDetails?.id}
            </Text>
            {!!orderDetails?.documents && (
              <TouchableOpacity
                onPress={() => Linking.openURL(orderDetails?.documents[0]?.url)}>
                <DownloadIcon width={24} height={24} />
              </TouchableOpacity>
            )}
          </View>
          <ProviderDetails provider={orderDetails?.provider} />
          <ItemDetails
            items={orderDetails?.items}
            fulfillments={orderDetails?.fulfillments}
          />
          <PaymentMethod
            payment={orderDetails?.payment}
            address={orderDetails?.fulfillments[0]?.end?.location?.address}
            contact={orderDetails?.fulfillments[0]?.end?.contact}
          />
          <RaiseIssue />
          <CancelOrderButton />
        </ScrollView>
      </View>
    );
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    orderDetails: {
      flex: 1,
    },
    header: {
      backgroundColor: colors.primary,
      paddingBottom: 10,
    },
    headerRow: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    orderDetailsTitle: {
      color: '#fff',
    },
    fulfilmentDetails: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 8,
    },
    orderStatus: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 8,
    },
    empty: {
      width: 24,
      height: 24,
    },
    pageContainer: {
      flex: 1,
      backgroundColor: '#FAFAFA',
    },
    creationHeader: {
      flexDirection: 'row',
      marginVertical: 22,
      alignItems: 'center',
      marginHorizontal: 16,
    },
    orderIdContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
    },
    orderId: {
      color: '#686868',
    },
    creationDate: {
      marginLeft: 8,
      color: '#686868',
    },
    shippingContainer: {
      paddingTop: 24,
      paddingHorizontal: 16,
    },
    shippingTitle: {
      marginBottom: 12,
      fontWeight: '600',
    },
    accordion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    accordionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    arrivalLabel: {
      color: '#686868',
    },
    arrivalDate: {
      color: '#1A1A1A',
      marginLeft: 8,
    },
  });

export default OrderDetails;
