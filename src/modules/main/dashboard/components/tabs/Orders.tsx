import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Searchbar, Text} from 'react-native-paper';
import axios from 'axios';
import {useTranslation} from 'react-i18next';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../../styles/styles';
import {keyExtractor, skeletonList} from '../../../../../utils/utils';
import ListFooter from '../../../order/components/ListFooter';
import OrderSkeleton from '../../../order/components/OrderSkeleton';
import Order from '../../../order/components/Order';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {API_BASE_URL, ORDERS} from '../../../../../utils/apiActions';
import {useAppTheme} from '../../../../../utils/theme';
import FiltersIcon from '../../../../../assets/filter.svg';
import FilterList from '../../../order/components/FilterList';
import useStatusBarColor from '../../../../../hooks/useStatusBarColor';

const CancelToken = axios.CancelToken;

/**
 * Component to render orders screen
 * @constructor
 * @returns {JSX.Element}
 */
const Orders: React.FC<any> = () => {
  const refFilterSheet = useRef<any>(null);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const isFocused = useIsFocused();
  const source = useRef<any>(null);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const totalOrders = useRef<number>(0);
  const pageNumber = useRef<number>(1);

  const [orders, setOrders] = useState<any>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [moreListRequested, setMoreListRequested] = useState<boolean>(false);
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false);
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);

  useStatusBarColor('dark-content', theme.colors.white);

  /**
   * function used to request list of orders
   * @returns {Promise<void>}
   * @param currentPage
   * @param filter
   */
  const getOrderList = async (
    currentPage: number,
    filter: string,
  ): Promise<void> => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${ORDERS}?pageNumber=${currentPage}&limit=10&${
          filter.length > 0 ? `state=${filter}` : ''
        }`,
        source.current.token,
      );
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
      getOrderList(pageNumber.current, selectedFilter)
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
      getOrderList(pageNumber.current, selectedFilter)
        .then(() => {
          setApiInProgress(false);
        })
        .catch(() => {
          setApiInProgress(false);
        });
    }
  }, [isFocused, selectedFilter]);

  useEffect(() => {
    navigation.setOptions({
      title: t('Profile.Order History'),
    });
  }, []);

  const onRefreshHandler = () => {
    pageNumber.current = 1;
    setRefreshInProgress(true);
    getOrderList(1, selectedFilter)
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
  const renderItem = useCallback(
    ({item}: {item: any}): JSX.Element => <Order order={item} />,
    [],
  );

  const renderSkeletonItem = useCallback(() => <OrderSkeleton />, []);

  const emptyComponent = useCallback(() => {
    return <Text>{t('Orders.No data found')}</Text>;
  }, []);

  if (apiInProgress) {
    return (
      <View style={styles.pageContainer}>
        <FlatList
          data={skeletonList}
          renderItem={renderSkeletonItem}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.pageContainer}>
        <View style={styles.header}>
          <Text variant={'titleLarge'} style={styles.pageTitle}>
            {t('Profile.Order History')}
          </Text>
        </View>
        <View style={styles.searchHeader}>
          <Searchbar
            editable
            iconColor={theme.colors.primary}
            rippleColor={theme.colors.neutral400}
            inputStyle={styles.searchInput}
            style={styles.search}
            placeholderTextColor={theme.colors.neutral300}
            placeholder={t('Orders.Search')}
            value={''}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => refFilterSheet.current.open()}>
            <FiltersIcon width={14} height={14} />
            <Text variant={'bodyMedium'} style={styles.filterButtonText}>
              {t('Orders.Filter')}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={orders}
          renderItem={renderItem}
          ListEmptyComponent={emptyComponent}
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
      <RBSheet
        ref={refFilterSheet}
        height={260}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <FilterList
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          close={() => refFilterSheet.current.close()}
        />
      </RBSheet>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      backgroundColor: colors.white,
    },
    pageTitle: {
      color: colors.neutral400,
    },
    searchHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      width: '100%',
      marginBottom: 16,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    filterButtonText: {
      color: colors.primary,
    },
    contentContainerStyle: {paddingVertical: 10},
    emptyContainer: {justifyContent: 'center', alignItems: 'center'},
    searchInput: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      minHeight: 40,
      flex: 1,
    },
    search: {
      flex: 1,
      height: 44,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral100,
      borderRadius: 58,
    },
    rbSheet: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
  });

export default memo(Orders);
