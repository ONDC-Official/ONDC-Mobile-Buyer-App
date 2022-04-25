import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {Context as AuthContext} from '../../../context/Auth';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../styles/styles';
import {getData} from '../../../utils/api';
import {BASE_URL, GET_ORDERS} from '../../../utils/apiUtilities';
import {skeletonList} from '../../../utils/utils';
import OrderCard from './OrderCard';
import {Text} from 'react-native-elements';
import OrderCardSkeleton from './OrderCardSkeleton';

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
      if (error.response) {
        if (error.response.status === 404) {
          setOrders([]);
        } else {
          handleApiError(error);
        }
      }
    }
  };

  useEffect(() => {
    getOrderList()
      .then(() => {})
      .catch(() => {});
  }, []);

  const renderItem = ({item}) => {
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <OrderCardSkeleton item={item} />
    ) : (
      <OrderCard item={item} />
    );
  };

  const listData = orders ? orders : skeletonList;
  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <FlatList
          data={listData}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return <Text>No data found</Text>;
          }}
          contentContainerStyle={
            listData.length > 0
              ? styles.contentContainerStyle
              : [appStyles.container, styles.emptyContainer]
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 10},
  emptyContainer: {justifyContent: 'center', alignItems: 'center'},
});
