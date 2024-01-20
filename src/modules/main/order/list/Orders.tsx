import React, {memo, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {keyExtractor, skeletonList} from '../../../../utils/utils';
import ListFooter from '../components/ListFooter';
import OrderSkeleton from '../components/OrderSkeleton';
import Order from '../components/Order';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, ORDERS} from '../../../../utils/apiActions';

const CancelToken = axios.CancelToken;

/**
 * Component to render orders screen
 * @constructor
 * @returns {JSX.Element}
 */
const Orders: React.FC<any> = () => {
  const isFocused = useIsFocused();
  const source = useRef<any>(null);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const totalOrders = useRef<number>(0);
  const pageNumber = useRef<number>(1);

  const [orders, setOrders] = useState<any>([]);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(false);
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false);
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);

  /**
   * function used to request list of orders
   * @param currentPage: It specifies the number of page
   * @returns {Promise<void>}
   */
  const getOrderList = async (currentPage: number) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ORDERS}?pageNumber=${currentPage}&limit=10`,
        source.current.token,
      );

      console.log(JSON.stringify(data, undefined, 4));
      totalOrders.current = data.totalCount;
      setOrders(currentPage === 1 ? data.orders : [...orders, ...data.orders]);
      pageNumber.current = pageNumber.current + 1;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404 && orders.length === 0) {
          setOrders([]);
        } else {
          handleApiError(error);
        }
      } else {
        handleApiError(error);
      }
    }
  };

  /**
   * Function is called when to get next list of elements on infinite scroll
   */
  const loadMoreList = () => {
    if (totalOrders.current > orders?.length && !moreListRequested) {
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
    if (isFocused) {
      setApiInProgress(true);
      pageNumber.current = 1;
      getOrderList(pageNumber.current)
        .then(() => {
          setApiInProgress(false);
        })
        .catch(() => {
          setApiInProgress(false);
        });
    }
  }, [isFocused]);

  useEffect(() => {
    setApiInProgress(true);
    getOrderList(pageNumber.current)
      .then(() => {
        setApiInProgress(false);
      })
      .catch(() => {
        setApiInProgress(false);
      });
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
   * Component to render single card
   * @param item: single order object
   * @constructor
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => <Order order={item} />;

  if (apiInProgress) {
    return (
      <View style={styles.pageContainer}>
        <FlatList
          data={skeletonList}
          renderItem={() => <OrderSkeleton />}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text>No data found</Text>}
        refreshing={refreshInProgress}
        keyExtractor={keyExtractor}
        onRefresh={onRefreshHandler}
        onEndReached={loadMoreList}
        contentContainerStyle={
          orders.length > 0
            ? styles.contentContainerStyle
            : [appStyles.container, styles.emptyContainer]
        }
        ListFooterComponent={props => (
          <ListFooter moreRequested={moreListRequested} {...props} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainerStyle: {paddingVertical: 10},
  emptyContainer: {justifyContent: 'center', alignItems: 'center'},
  divider: {
    backgroundColor: '#E8E8E8',
    height: 1,
    marginVertical: 24,
  },
});

export default memo(Orders);
