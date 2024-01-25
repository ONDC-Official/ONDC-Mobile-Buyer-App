import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Product from '../../modules/main/provider/components/Product';
import {API_BASE_URL, PRODUCT_SEARCH} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import useNetworkHandling from '../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';

interface SearchProducts {
  searchQuery: string;
}

const CancelToken = axios.CancelToken;

const SearchProducts: React.FC<SearchProducts> = ({searchQuery}) => {
  const productSearchSource = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [productsRequested, setProductsRequested] = useState<boolean>(true);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const searchProducts = async (pageNumber: number) => {
    try {
      setProductsRequested(true);
      productSearchSource.current = CancelToken.source();

      let url = `${API_BASE_URL}${PRODUCT_SEARCH}?pageNumber=${pageNumber}&limit=${BRAND_PRODUCTS_LIMIT}&name=${searchQuery}`;
      console.log('url => ', url);
      const {data} = await getDataWithAuth(
        url,
        productSearchSource.current.token,
      );
      console.log('Response => ', data?.response?.count);
      setTotalProducts(data.response.count);
      setProducts(data.response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setProductsRequested(false);
    }
  };

  useEffect(() => {
    searchProducts(page);
  }, [searchQuery]);

  return (
    <View>
      <FlatList
        key={'grid'}
        numColumns={2}
        data={products}
        renderItem={({item}) => <Product product={item} isGrid={isGridView} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text variant={'bodyMedium'}>No products available</Text>
          </View>
        )}
        contentContainerStyle={
          products.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default SearchProducts;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      marginTop: 12,
    },
    listContainer: {
      paddingHorizontal: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
