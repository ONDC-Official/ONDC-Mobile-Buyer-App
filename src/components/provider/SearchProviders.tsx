import axios from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ProgressBar, Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import useNetworkErrorHandling from '../../hooks/useNetworkErrorHandling';
import useNetworkHandling from '../../hooks/useNetworkHandling';
import {API_BASE_URL, GLOBAL_SEARCH_STORES} from '../../utils/apiActions';
import {BRAND_PRODUCTS_LIMIT} from '../../utils/constants';
import ProductSkeleton from '../skeleton/ProductSkeleton';
import {skeletonList} from '../../utils/utils';
import {useAppTheme} from '../../utils/theme';
import useReadAudio from '../../hooks/useReadAudio';
import Provider from './Provider';

interface SearchProductList {
  searchQuery: string;
}

const CancelToken = axios.CancelToken;

const SearchProviders: React.FC<SearchProductList> = ({searchQuery}) => {
  const voiceDetectionStarted = useRef<boolean>(false);
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
    setAllowRestarts,
  } = useReadAudio(language);

  const totalProviders = useRef<number>(0);
  const [providers, setProviders] = useState<any[]>([]);
  const [productsRequested, setProductsRequested] = useState<boolean>(false);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(false);
  const [providerId, setProviderId] = useState<string>('');

  /**
   * Function is called when to get next list of elements on infinite scroll
   */
  const loadMoreList = () => {
    if (totalProviders.current > providers?.length && !moreListRequested) {
      setMoreListRequested(true);
      searchProviders()
        .then(() => {
          setMoreListRequested(false);
        })
        .catch(() => {
          setMoreListRequested(false);
        });
    }
  };

  const searchProviders = async () => {
    try {
      if (productSearchSource.current) {
        productSearchSource.current.cancel();
      }
      productSearchSource.current = CancelToken.source();
      const afterString = providerId ? `&afterKey=${providerId}` : '';
      let url = `${API_BASE_URL}${GLOBAL_SEARCH_STORES}?limit=${BRAND_PRODUCTS_LIMIT}&latitude=${address?.address?.lat}&longitude=${address.address.lng}&pincode=${address.address.areaCode}&name=${searchQuery}${afterString}`;
      const {data} = await getDataWithAuth(
        url,
        productSearchSource.current.token,
      );
      totalProviders.current = data.response.count;
      setProviderId(data?.response?.afterKey?.provider_id);
      setProviders([...providers, ...data?.response?.data]);
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
