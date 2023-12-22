import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {API_BASE_URL, PROVIDERS} from '../../../../../utils/apiActions';
import {skeletonList} from '../../../../../utils/utils';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import Brand from './Brand';

const CancelToken = axios.CancelToken;

const BrandSkeleton = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  return (
    <View style={styles.brand}>
      <SkeletonPlaceholder>
        <View style={styles.brandSkeleton} />
      </SkeletonPlaceholder>
    </View>
  );
};

const TopBrands = () => {
  const source = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [providers, setProviders] = useState<any[]>([]);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getAllProviders = async () => {
    try {
      setApiRequested(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${PROVIDERS}`,
        source.current.token,
      );
      setProviders(data.response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  useEffect(() => {
    getAllProviders().then(() => {});

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text variant={'titleSmall'} style={styles.title}>
        All Providers
      </Text>
      {apiRequested ? (
        <FlatList
          horizontal
          data={skeletonList}
          renderItem={() => <BrandSkeleton />}
          keyExtractor={item => item.id}
        />
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={providers}
          renderItem={({item}) => <Brand brand={item} />}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 40,
      paddingHorizontal: 16,
    },
    title: {
      marginBottom: 12,
    },
    brand: {
      width: 109,
      height: 109,
      marginRight: 15,
      borderRadius: 12,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandSkeleton: {
      width: 109,
      height: 109,
    },
  });

export default TopBrands;
