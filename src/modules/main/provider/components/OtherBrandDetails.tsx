import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {API_BASE_URL, PRODUCT_SEARCH} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {skeletonList} from '../../../../utils/utils';
import CustomMenu from './CustomMenu';
import Filters from './Filters';
import {BRAND_PRODUCTS_LIMIT} from '../../../../utils/constants';
import ProductSkeleton from '../../../../components/skeleton/ProductSkeleton';
import Product from './Product';

interface OtherBrandDetails {
  provider: any;
}

const CancelToken = axios.CancelToken;

const OtherBrandDetails: React.FC<OtherBrandDetails> = ({provider}) => {
  const productSearchSource = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [productsRequested, setProductsRequested] = useState<boolean>(true);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const searchProducts = async (pageNumber: number) => {
    try {
      setProductsRequested(true);
      productSearchSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${PRODUCT_SEARCH}?providerIds=${provider.id}&pageNumber=${pageNumber}&limit=${BRAND_PRODUCTS_LIMIT}`,
        productSearchSource.current.token,
      );
      setTotalProducts(data.response.count);
      setProducts(data.response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setProductsRequested(false);
    }
  };

  useEffect(() => {
    searchProducts(page).then(() => {});
  }, [page]);

  return (
    <View style={styles.container}>
      <CustomMenu providerId={provider.id} providerDomain={provider.domain} />
      <View style={styles.filterContainer}>
        <Filters providerId={provider.id} />
        <View style={styles.reorderContainer}>
          <TouchableOpacity
            onPress={() => setIsGridView(true)}
            style={[
              styles.reorderButton,
              isGridView
                ? styles.activeReorderButton
                : styles.defaultReorderButton,
            ]}>
            <Icon name={'reorder-vertical'} size={20} />
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
            <Icon name={'reorder-horizontal'} size={20} />
          </TouchableOpacity>
        </View>
      </View>
      {productsRequested ? (
        <FlatList
          numColumns={2}
          data={skeletonList}
          renderItem={() => <ProductSkeleton />}
          contentContainerStyle={styles.listContainer}
          keyExtractor={item => item.id}
        />
      ) : isGridView ? (
        <FlatList
          key={'grid'}
          numColumns={2}
          data={products}
          renderItem={({item}) => (
            <Product product={item} isGrid={isGridView} />
          )}
          contentContainerStyle={styles.listContainer}
          keyExtractor={item => item.id}
        />
      ) : (
        <FlatList
          key={'list'}
          data={products}
          renderItem={({item}) => (
            <Product product={item} isGrid={isGridView} />
          )}
          contentContainerStyle={styles.listContainer}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    menuContainer: {
      paddingVertical: 16,
      paddingLeft: 16,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
      marginTop: 8,
    },
    reorderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
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
  });

export default OtherBrandDetails;
