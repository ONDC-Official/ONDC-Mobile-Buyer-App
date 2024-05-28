import axios from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ProgressBar, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import useNetworkHandling from '../../hooks/useNetworkHandling';
import Product from '../../modules/main/provider/components/Product';
import {API_BASE_URL, PRODUCT_SEARCH} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import ProductSkeleton from '../skeleton/ProductSkeleton';
import {
  compareIgnoringSpaces,
  showToastWithGravity,
  skeletonList,
} from '../../utils/utils';
import {useAppTheme} from '../../utils/theme';
import useBhashini from '../../hooks/useBhashini';
import useReadAudio from '../../hooks/useReadAudio';

interface SearchProductList {
  searchQuery: string;
}

const CancelToken = axios.CancelToken;

const SearchProducts: React.FC<SearchProductList> = ({searchQuery}) => {
  const voiceDetectionStarted = useRef<boolean>(false);
  const navigation = useNavigation<any>();
  const productSearchSource = useRef<any>(null);
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const {language} = useSelector(({authReducer}) => authReducer);
  const {
    startVoice,
    userInteractionStarted,
    userInput,
    stopAndDestroyVoiceListener,
    setAllowRestarts,
  } = useReadAudio(language);
  const {
    withoutConfigRequest,
    computeRequestTransliteration,
    transliterationRequest,
  } = useBhashini();

  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [productsRequested, setProductsRequested] = useState<boolean>(false);
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const searchProducts = async (pageNumber: number) => {
    try {
      setProductsRequested(true);
      if (productSearchSource.current) {
        productSearchSource.current.cancel();
      }
      let query = searchQuery;
      productSearchSource.current = CancelToken.source();
      if (language !== 'en') {
        if (!transliterationRequest?.callbackUrl) {
          await withoutConfigRequest();
        }
        const searchResponse = await computeRequestTransliteration(query);
        query = searchResponse?.pipelineResponse[0]?.output[0]?.target[0];
      }
      let url = `${API_BASE_URL}${PRODUCT_SEARCH}?pageNumber=${pageNumber}&limit=${BRAND_PRODUCTS_LIMIT}&name=${query}`;
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

  const renderItem = useCallback(({item}) => {
    return <Product product={item} search />;
  }, []);

  useEffect(() => {
    if (userInput.length > 0) {
      const input = userInput.toLowerCase();
      if (/^(select|choose)\b/i.test(input)) {
        const inputArray = input.split('from');
        const productName = inputArray[0]
          .replace('select', '')
          .replace('choose', '')
          .trim();
        let filteredProducts = [];
        if (inputArray.length > 1) {
          filteredProducts = products.filter(product => {
            return (
              compareIgnoringSpaces(
                product?.item_details?.descriptor?.name.toLowerCase(),
                productName,
              ) &&
              compareIgnoringSpaces(
                product?.provider_details?.descriptor?.name.toLowerCase(),
                inputArray[1].trim(),
              )
            );
          });
        } else {
          filteredProducts = products.filter(product =>
            compareIgnoringSpaces(
              product?.item_details?.descriptor?.name.toLowerCase(),
              productName,
            ),
          );
        }
        if (filteredProducts.length > 1) {
          showToastWithGravity(
            'There are more than 1 product, please provide more details',
          );
        } else if (filteredProducts.length === 1) {
          const product = filteredProducts[0];
          const routeParams: any = {
            brandId: product.provider_details.id,
          };

          if (product.location_details) {
            routeParams.outletId = product.location_details.id;
          }
          stopAndDestroyVoiceListener().then(() => {
            navigation.navigate('BrandDetails', routeParams);
          });
        }
      } else if (compareIgnoringSpaces('go to cart', input)) {
        stopAndDestroyVoiceListener().then(() => {
          navigation.navigate('Cart');
        });
      }
    }
  }, [userInput, products]);

  useEffect(() => {
    if (searchQuery?.length > 2) {
      searchProducts(page).then(() => {
        voiceDetectionStarted.current = true;
        startVoice().then(() => {});
      });
    } else {
      setTotalProducts(0);
      setProducts([]);
    }
  }, [searchQuery, page]);

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
      <View style={styles.filterContainer}>
        <View />
      </View>
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
          key={'grid' + isGridView}
          numColumns={isGridView ? 2 : 1}
          data={products}
          renderItem={renderItem}
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
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 16,
      width: '100%',
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
