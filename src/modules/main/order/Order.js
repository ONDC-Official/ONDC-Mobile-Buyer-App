import React, {memo, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../styles/styles';
import {getData} from '../../../utils/api';
import {BASE_URL, GET_ORDERS} from '../../../utils/apiUtilities';
import {keyExtractor, skeletonList} from '../../../utils/utils';
import ListFooter from './components/ListFooter';
import OrderCardSkeleton from './components/OrderCardSkeleton';
import OrderHeader from './components/OrderHeader';

/**
 * Component to render orders screen
 * @constructor
 * @returns {JSX.Element}
 */
const Order = () => {
  const {token} = useSelector(({authReducer}) => authReducer);

  const {handleApiError} = useNetworkErrorHandling();

  const totalOrders = useRef(null);
  const pageNumber = useRef(1);

  const [orders, setOrders] = useState(null);
  const [moreListRequested, setMoreListRequested] = useState(false);
  const [refreshInProgress, setRefreshInProgress] = useState(false);

  /**
   * function used to request list of orders
   * @param number:It specifies the number of page
   * @returns {Promise<void>}
   */
  const getOrderList = async number => {
    try {
      const {data} = await getData(
        `${BASE_URL}${GET_ORDERS}?pageNumber=${number}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      totalOrders.current = data.totalCount;

      setOrders(number === 1 ? data.orders : [...orders, ...data.orders]);
      pageNumber.current = pageNumber.current + 1;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404 && orders.length === 0) {
          setOrders([]);
        } else {
          handleApiError(error);
        }
      }
    }
  };

  /**
   * Function is called when to get next list of elements on infinite scroll
   */
  const loadMoreList = () => {
    console.log(totalOrders.current, orders.length);
    if (totalOrders.current > orders.length && !moreListRequested) {
      setMoreListRequested(true);
      getOrderList(pageNumber.current)
        .then(() => {
          setMoreListRequested(false);
        })
        .catch(() => {
          setMoreListRequested(false);
        });
    }
  };

  useEffect(() => {
    getOrderList(pageNumber.current)
      .then(() => {})
      .catch(() => {});
  }, []);

  const onRefreshHandler = () => {
    pageNumber.current = 1;
    setRefreshInProgress(true);
    getOrderList(1)
      .then(() => {
        setRefreshInProgress(false);
      })
      .catch(() => {
        setRefreshInProgress(false);
      });
  };

  /**
   * Component to render signle card
   * @param item:single order object
   * @constructor
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) =>
    item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <OrderCardSkeleton item={item} />
    ) : (
      <OrderHeader item={item} />
    );

  const listData = orders ? orders : skeletonList;

  return (
    <View style={appStyles.container}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text>No data found</Text>}
        refreshing={refreshInProgress}
        keyExtractor={keyExtractor}
        onRefresh={onRefreshHandler}
        onEndReached={loadMoreList}
        contentContainerStyle={
          listData.length > 0
            ? styles.contentContainerStyle
            : [appStyles.container, styles.emptyContainer]
        }
        ListFooterComponent={<ListFooter moreRequested={moreListRequested} />}
      />
    </View>
  );
};

export default memo(Order);

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 10},
  emptyContainer: {justifyContent: 'center', alignItems: 'center'},
});
