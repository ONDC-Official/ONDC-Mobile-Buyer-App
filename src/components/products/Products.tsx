import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import axios from 'axios';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ProgressBar} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import useNetworkHandling from '../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, PRODUCT_SEARCH} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import Filters from './Filters';
import {
  compareIgnoringSpaces,
  showToastWithGravity,
  skeletonList,
} from '../../utils/utils';
import ProductSkeleton from '../skeleton/ProductSkeleton';
import Product from '../../modules/main/provider/components/Product';
import {useAppTheme} from '../../utils/theme';
import ProductSearch from './ProductSearch';
import useReadAudio from '../../hooks/useReadAudio';

interface Products {
  providerId: any;
  customMenu: any;
  subCategories: any[];
  search?: boolean;
  outlet: any;
  provider:any;
}

const CancelToken = axios.CancelToken;

const Products: React.FC<Products> = ({
  providerId = null,
  customMenu = null,
  subCategories = [],
  search = false,
  outlet,
  provider,
}) => {
  const voiceDetectionStarted = useRef<boolean>(false);
  const navigation = useNavigation<any>();
  const productSearchSource = useRef<any>(null);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {language} = useSelector(({auth}) => auth);
  const {
    startVoice,
    userInteractionStarted,
    userInput,
    stopAndDestroyVoiceListener,
    setAllowRestarts,
  } = useReadAudio(language);
  const [productsRequested, setProductsRequested] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedAttributes, setSelectedAttributes] = useState<any>({});
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const searchProducts = async (
    pageNumber: number,
    selectedProvider: any,
    selectedMenu: any,
    subCategoryIds: any,
    attributes: any,
  ) => {
    try {
      setProductsRequested(true);
      productSearchSource.current = CancelToken.source();
      let url = `${API_BASE_URL}${PRODUCT_SEARCH}?pageNumber=${pageNumber}&limit=${BRAND_PRODUCTS_LIMIT}`;
      url += selectedProvider ? `&providerIds=${selectedProvider}` : '';
      url += selectedMenu ? `&customMenu=${selectedMenu}` : '';
      url +=
        subCategoryIds.length > 0
          ? `&categoryIds=${subCategoryIds.join(',')}`
          : '';
      Object.keys(attributes).map(key => {
        url += `&${key}=${attributes[key].join(',')}`;
      });

      const {data} = await getDataWithAuth(
        url,
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

  const filteredProducts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    // Filter the products based on the search query
    return products.filter(
      product =>
        product?.item_details?.descriptor?.name
          ?.toLowerCase()
          .includes(lowerQuery) ||
        product?.provider_details?.descriptor?.name
          ?.toLowerCase()
          .includes(lowerQuery),
    );
  }, [products, searchQuery]);

  useEffect(() => {
    searchProducts(
      page,
      providerId,
      customMenu,
      subCategories,
      selectedAttributes,
    ).then(() => {
      voiceDetectionStarted.current = true;
      startVoice().then(() => {});
    });
  }, [page, providerId, customMenu, subCategories, selectedAttributes]);

  useEffect(() => {
    if (userInput.length > 0) {
      const input = userInput.toLowerCase();
      if (/^(select|choose)\b/i.test(input)) {
        const productName = input
          .replace('select', '')
          .replace('choose', '')
          .trim();
        let selectedProducts = [];
        selectedProducts = products.filter(product =>
          compareIgnoringSpaces(
            product?.item_details?.descriptor?.name.toLowerCase(),
            productName,
          ),
        );
        if (selectedProducts.length > 1) {
          showToastWithGravity(
            'There are more than 1 product, please provide more details',
          );
        } else {
          const product = selectedProducts[0];
          stopAndDestroyVoiceListener().then(() => {
            navigation.navigate('ProductDetails', {productId: product.id});
          });
        }
      } else if (compareIgnoringSpaces('go to cart', input)) {
        stopAndDestroyVoiceListener().then(() => {
          navigation.navigate('Cart');
        });
      }
    }
  }, [userInput, products]);

  useFocusEffect(
    useCallback(() => {
      if (voiceDetectionStarted.current) {
        setAllowRestarts();
      }
    }, []),
  );

  return (
    <View style={styles.container}>
      {userInteractionStarted && (
        <ProgressBar indeterminate color={theme.colors.success600} />
      )}
      <Filters
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={setSelectedAttributes}
        providerId={providerId}
        category={subCategories.length ? subCategories[0] : null}
      />
      <View style={styles.searchContainer}>
        <ProductSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </View>

      {productsRequested ? (
        <View style={styles.listContainer}>
          {skeletonList.map(product => (
            <View key={product.id} style={styles.productContainer}>
              <ProductSkeleton />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.listContainer}>
          {filteredProducts.map(product => (
            <View key={product.id} style={styles.productContainer}>
              <Product product={product} search={search} outlet={outlet} provider={provider}/>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    productContainer: {
      width: '50%',
      height: 254,
      marginBottom: 12,
    },
    searchContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    searchBar: {
      borderRadius: 60,
      height: 40,
    },
    searchInput: {
      paddingVertical: 0,
    },
    listContainer: {
      paddingHorizontal: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 24,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default Products;
