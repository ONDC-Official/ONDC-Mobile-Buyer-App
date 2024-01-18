import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, ORDERS} from '../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../utils/utils';
import Actions from './components/Actions';
import ShippingDetails from './components/ShippingDetails';
import ItemDetails from './components/ItemDetails';
import PaymentMethod from './components/PaymentMethod';
import RaiseIssue from './components/RaiseIssue';

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
  const source = useRef<any>(null);
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const {getDataWithAuth} = useNetworkHandling();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [trackingDetails, setTrackingDetails] = useState<any>(null);
  const [apiInProgress, setApiInProgress] = useState<boolean>(true);

  const getOrderDetails = async () => {
    try {
      setApiInProgress(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ORDERS}/${params.orderId}`,
        source.current.token,
      );
      setOrderDetails(data[0]);
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

  const duration = moment.duration(
    orderDetails?.fulfillments[0]['@ondc/org/TAT'],
  );
  const endTime = moment(orderDetails?.createdAt).add(duration);

  return (
    <View style={styles.orderDetails}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity>
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
        <Text variant={'bodySmall'} style={styles.fulfilmentDetails}>
          Will be delivered in {endTime.fromNow()}
        </Text>
      </View>
      <ScrollView style={styles.pageContainer}>
        <Actions
          orderDetails={orderDetails}
          onUpdateOrder={getOrderDetails}
          onUpdateTrackingDetails={setTrackingDetails}
        />
        <ShippingDetails orderDetails={orderDetails} />
        <ItemDetails
          orderId={orderDetails?.id}
          items={orderDetails?.items}
          provider={orderDetails?.provider}
        />
        <PaymentMethod payment={orderDetails?.payment} />
        <RaiseIssue />
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
