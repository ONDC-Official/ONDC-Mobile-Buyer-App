import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import OrderSummary from './components/OrderSummary';
import axios from 'axios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, ORDERS} from '../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../utils/utils';

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
    getOrderDetails().then(r => {});
  }, []);

  if (apiInProgress) {
    return <Skeleton />;
  }

  return (
    <ScrollView style={styles.pageContainer}>
      <OrderSummary
        orderDetails={orderDetails}
        onUpdateOrder={getOrderDetails}
        onUpdateTrackingDetails={setTrackingDetails}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    margin: 8,
    backgroundColor: 'white',
  },
  actionContainer: {
    paddingVertical: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  helpContainer: {
    padding: 8,
  },
  container: {
    paddingTop: 8,
  },
  rowContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  helpLabel: {
    fontSize: 18,
  },
  name: {fontSize: 18, fontWeight: '500', marginVertical: 4, flexShrink: 1},
  title: {fontSize: 16, marginRight: 10, flexShrink: 1},
  price: {fontSize: 16, marginLeft: 10},
  address: {marginBottom: 4},
  quantity: {fontWeight: '700'},
  addressContainer: {paddingHorizontal: 12, marginTop: 20, flexShrink: 1},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
});

export default OrderDetails;
