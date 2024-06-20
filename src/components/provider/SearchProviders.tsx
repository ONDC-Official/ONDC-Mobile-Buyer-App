import axios from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ProgressBar, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import useNetworkHandling from '../../hooks/useNetworkHandling';
import {API_BASE_URL, GLOBAL_SEARCH_STORES} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import ProductSkeleton from '../skeleton/ProductSkeleton';
import {skeletonList} from '../../utils/utils';
import {useAppTheme} from '../../utils/theme';
import useBhashini from '../../hooks/useBhashini';
import useReadAudio from '../../hooks/useReadAudio';
import Provider from './Provider';

interface SearchProductList {
  searchQuery: string;
}

const CancelToken = axios.CancelToken;

const SearchProviders: React.FC<SearchProductList> = ({searchQuery}) => {
  const voiceDetectionStarted = useRef<boolean>(false);
  const navigation = useNavigation<any>();
  const productSearchSource = useRef<any>(null);
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector(({address}) => address);
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
  const {
    withoutConfigRequest,
    computeRequestTransliteration,
    transliterationRequest,
  } = useBhashini();

  const totalProviders = useRef<number>(0);
  const pageNumber = useRef<number>(1);
  const [providers, setProviders] = useState<any[]>([]);
  const [productsRequested, setProductsRequested] = useState<boolean>(false);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(false);

  /**
   * Function is called when to get next list of elements on infinite scroll
   */
  const loadMoreList = () => {
    // if (totalProviders.current > providers?.length && !moreListRequested) {
    //   pageNumber.current = pageNumber.current + 1;
    //   setMoreListRequested(true);
    //   searchProviders()
    //     .then(() => {
    //       setMoreListRequested(false);
    //     })
    //     .catch(() => {
    //       setMoreListRequested(false);
    //       pageNumber.current = pageNumber.current - 1;
    //     });
    // }
  };

  const searchProviders = async () => {
    try {
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
        query = searchResponse?.pipelineResponse[0]?.output[0]?.target;
      }

      let url = `${API_BASE_URL}${GLOBAL_SEARCH_STORES}?pageNumber=${pageNumber.current}&limit=${BRAND_PRODUCTS_LIMIT}&latitude=${address?.address?.lat}&longitude=${address.address.lng}&name=${query}`;
      const {data} = await getDataWithAuth(
        url,
        productSearchSource.current.token,
      );
      totalProviders.current = data.count;
      setProviders(
        pageNumber.current === 1 ? data.data : [...providers, ...data.data],
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setProductsRequested(false);
    }
  };

  const renderItem = useCallback(({item}: {item: any}) => {
    return <Provider provider={item} />;
  }, []);

  useEffect(() => {
    if (searchQuery?.length > 2) {
      pageNumber.current = 1;
      setProductsRequested(true);
      searchProviders().then(() => {
        voiceDetectionStarted.current = true;
        startVoice().then(() => {});
      });
    } else {
      totalProviders.current = 0;
      setProviders([]);
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
          data={skeletonList}
          renderItem={() => <ProductSkeleton />}
          contentContainerStyle={styles.listContainer}
          keyExtractor={item => item.id}
        />
      ) : (
        <FlatList
          data={providers}
          renderItem={renderItem}
          onEndReached={loadMoreList}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text variant={'bodyMedium'}>
                {t('Home.Search Provider List.No providers available')}
              </Text>
            </View>
          )}
          contentContainerStyle={
            providers.length === 0
              ? styles.emptyContainer
              : styles.listContainer
          }
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

export default SearchProviders;

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
