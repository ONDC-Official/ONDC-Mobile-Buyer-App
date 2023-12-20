import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import OrderSummary from './components/OrderSummary';
import axios from 'axios';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, ORDERS} from '../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../utils/utils';

const CancelToken = axios.CancelToken;

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
  const [orderDetails, setOrderDetails] = useState<any>(params.order);
  const [trackingDetails, setTrackingDetails] = useState<any>(null);

  const getOrderDetails = async () => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ORDERS}/${params.order.id}`,
        source.current.token,
      );
      setOrderDetails(data[0]);
    } catch (err: any) {
      showToastWithGravity(err?.response?.data?.error?.message);
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
