import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {Context as AuthContext} from '../../../context/Auth';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../styles/styles';
import {getData} from '../../../utils/api';
import {BASE_URL, GET_ORDERS} from '../../../utils/apiUtilities';
import {skeletonList} from '../../../utils/utils';
import OrderCard from './OrderCard';

const Order = ({}) => {
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const [orders, setOrders] = useState(null);

  const getOrderList = async () => {
    try {
      const {data} = await getData(`${BASE_URL}${GET_ORDERS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    getOrderList()
      .then(() => {})
      .catch(() => {});
  }, []);

  const renderItem = ({item}) => {
    return <OrderCard item={item} />;
  };

  const listData = orders ? orders : skeletonList;
  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <FlatList
          data={orders}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 10},
});
