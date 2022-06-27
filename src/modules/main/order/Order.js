import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {Context as AuthContext} from '../../../context/Auth';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../styles/styles';
import {getData} from '../../../utils/api';
import {BASE_URL, GET_ORDERS} from '../../../utils/apiUtilities';
import {keyExtractor, skeletonList} from '../../../utils/utils';
import ListFooter from './ListFooter';
import OrderAccordion from './OrderAccordion';
import OrderCardSkeleton from './OrderCardSkeleton';

/**
 * Component to render orders screen
 * @constructor
 * @returns {JSX.Element}
 */
const Order = () => {
  const {
    state: {token},
  } = useContext(AuthContext);

  const {t} = useTranslation();

  const {handleApiError} = useNetworkErrorHandling();

  const [orders, setOrders] = useState(null);

  const [totalOrders, setTotalOrders] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);

  const [moreListRequested, setMoreListRequested] = useState(false);

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
      setTotalOrders(data.totalCount);

      setOrders(number === 1 ? data.orders : [...orders, ...data.orders]);
      setPageNumber(pageNumber + 1);
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

  /**
   * Function is called when to get next list of elements on infinite scroll
   */
  const loadMoreList = () => {
    if (orders) {
      if (totalOrders > orders.length) {
        setMoreListRequested(true);
        getOrderList(pageNumber)
          .then(() => {
            setMoreListRequested(false);
          })
          .catch(() => {
            setMoreListRequested(false);
          });
      }
    }
  };

  useEffect(() => {
    getOrderList(pageNumber)
      .then(() => {})
      .catch(() => {});
  }, []);

  /**
   * Component to render signle card
   * @param item:single order object
   * @constructor
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
    <OrderCardSkeleton item={item}/>
  ) : (
    <OrderAccordion item={item} getOrderList={getOrderList}/>
  );

  const listData = orders ? orders : skeletonList;

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={appStyles.container}>
        <FlatList
          data={listData}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return <Text>{t('main.order.list_empty_message')}</Text>;
          }}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.2}
          onEndReached={loadMoreList}
          contentContainerStyle={
            listData.length > 0
              ? styles.contentContainerStyle
              : [appStyles.container, styles.emptyContainer]
          }
          ListFooterComponent={<ListFooter moreRequested={moreListRequested}/>}
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
