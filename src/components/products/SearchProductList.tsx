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
import {API_BASE_URL, GLOBAL_SEARCH_ITEMS} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import ProductSkeleton from '../skeleton/ProductSkeleton';
import {
  compareIgnoringSpaces,
  showToastWithGravity,
  skeletonList,
} from '../../utils/utils';
import {useAppTheme} from '../../utils/theme';
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
  const {address} = useSelector((state: any) => state.address);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const {language} = useSelector(({auth}) => auth);
  const {
    startVoice,
    userInteractionStarted,
    userInput,
    stopAndDestroyVoiceListener,
    setAllowRestarts,
  } = useReadAudio(language);

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
      // if (language !== 'en') {
      //   if (!transliterationRequest?.callbackUrl) {
      //     await withoutConfigRequest();
      //   }
      //   const searchResponse = await computeRequestTransliteration(query);
      //   query = searchResponse?.pipelineResponse[0]?.output[0]?.target;
      // }

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
    ({item}: {item: any}) => <Product product={item} search isOpen />,
    [],
  );

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
      pageNumber.current = 1;
      setProductsRequested(true);
      searchProducts().then(() => {
        voiceDetectionStarted.current = true;
        startVoice().then(() => {});
      });
    } else {
      totalProducts.current = 0;
      setProducts([]);
    }
  }, [searchQuery]);

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
