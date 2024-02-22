import React, {useEffect, useRef, useState} from 'react';
import {IconButton} from 'react-native-paper';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, ORDERS} from '../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../utils/utils';
import {updateOrderDetails} from '../../../../redux/order/actions';
import NonCancelledOrder from './components/NonCancelledOrder';
import CancelledOrder from './components/CancelledOrder';
import {useAppTheme} from '../../../../utils/theme';

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
  const {colors} = useAppTheme();
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
    return <CancelledOrder />;
  } else {
    return <NonCancelledOrder getOrderDetails={getOrderDetails} />;
  }
};

export default OrderDetails;
