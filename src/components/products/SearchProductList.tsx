import axios from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import useNetworkHandling from '../../hooks/useNetworkHandling';
import Product from '../../modules/main/provider/components/Product';
import {API_BASE_URL, GLOBAL_SEARCH_ITEMS} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import ProductSkeleton from '../skeleton/ProductSkeleton';
import {skeletonList} from '../../utils/utils';
import {useAppTheme} from '../../utils/theme';

interface SearchProductList {
  searchQuery: string;
}

const CancelToken = axios.CancelToken;

const SearchProducts: React.FC<SearchProductList> = ({searchQuery}) => {
  const productSearchSource = useRef<any>(null);
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector((state: any) => state.address);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const totalProducts = useRef<number>(0);
  const pageNumber = useRef<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const [productsRequested, setProductsRequested] = useState<boolean>(false);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(false);

  /**
   * Function is called when to get next list of elements on infinite scroll
   */
  const loadMoreList = () => {
    if (totalProducts.current > products?.length && !moreListRequested) {
      pageNumber.current = pageNumber.current + 1;
      setMoreListRequested(true);
      searchProducts()
        .then(() => {
          setMoreListRequested(false);
        })
        .catch(() => {
          setMoreListRequested(false);
          pageNumber.current = pageNumber.current - 1;
        });
    }
  };

  const searchProducts = async () => {
    try {
      if (productSearchSource.current) {
        productSearchSource.current.cancel();
      }
      let query = searchQuery;
      productSearchSource.current = CancelToken.source();
      let url = `${API_BASE_URL}${GLOBAL_SEARCH_ITEMS}?pageNumber=${pageNumber.current}&limit=${BRAND_PRODUCTS_LIMIT}&latitude=${address?.address?.lat}&longitude=${address.address.lng}&name=${query}`;
      const {data} = await getDataWithAuth(
        url,
        productSearchSource.current.token,
      );
      totalProducts.current = data.count;
      setProducts(
        pageNumber.current === 1 ? data.data : [...products, ...data.data],
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setProductsRequested(false);
    }
  };

  const renderItem = useCallback(
    ({item}: {item: any}) => (
      <View key={item.id} style={styles.productContainer}>
        <Product product={item} search isOpen />
      </View>
    ),
    [],
  );

  useEffect(() => {
    if (searchQuery?.length > 2) {
      pageNumber.current = 1;
      setProductsRequested(true);
      searchProducts().then(() => {});
    } else {
      totalProducts.current = 0;
      setProducts([]);
    }
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      {productsRequested ? (
        <FlatList
          numColumns={2}
          data={skeletonList}
          renderItem={() => <ProductSkeleton />}
          contentContainerStyle={styles.listContainer}
          keyExtractor={item => item.id}
        />
      ) : (
        <FlatList
          numColumns={2}
          data={products}
          renderItem={renderItem}
          onEndReached={loadMoreList}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text variant={'bodyMedium'}>
                {t('Home.Search Product List.No products available')}
              </Text>
            </View>
          )}
          contentContainerStyle={
            products.length === 0 ? styles.emptyContainer : styles.listContainer
          }
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

export default SearchProducts;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    listContainer: {
      paddingHorizontal: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    productContainer: {
      width: '50%',
      height: 254,
      marginBottom: 12,
    },
  });
