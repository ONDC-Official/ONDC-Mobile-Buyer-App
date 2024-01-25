import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Product from '../../modules/main/provider/components/Product';
import {API_BASE_URL, PRODUCT_SEARCH} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import useNetworkHandling from '../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
      <View style={styles.filterContainer}>
        <View />
        <View style={styles.reorderContainer}>
          <TouchableOpacity
            onPress={() => setIsGridView(true)}
            style={[
              styles.reorderButton,
              isGridView
                ? styles.activeReorderButton
                : styles.defaultReorderButton,
            ]}>
            <Icon
              name={'reorder-vertical'}
              size={20}
              color={isGridView ? '#fff' : '#333'}
            />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            onPress={() => setIsGridView(false)}
            style={[
              styles.reorderButton,
              isGridView
                ? styles.defaultReorderButton
                : styles.activeReorderButton,
            ]}>
            <Icon
              name={'reorder-horizontal'}
              size={20}
              color={isGridView ? '#333' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        key={'grid' + isGridView}
        numColumns={isGridView ? 2 : 1}
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
    },

    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
      marginTop: 20,
      width: '100%',
    },
    reorderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
    },
    separator: {
      width: 9,
    },
    reorderButton: {
      padding: 6,
      borderRadius: 8,
      borderWidth: 1,
    },
    activeReorderButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    defaultReorderButton: {
      borderColor: '#E8E8E8',
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
