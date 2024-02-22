import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Icon from 'react-native-vector-icons/MaterialIcons';

import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {API_BASE_URL, PROVIDERS} from '../../../../../utils/apiActions';
import {skeletonList} from '../../../../../utils/utils';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import Brand from './Brand';
import {useAppTheme} from '../../../../../utils/theme';

const CancelToken = axios.CancelToken;

const BrandSkeleton = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  return (
    <View style={styles.brand}>
      <SkeletonPlaceholder>
        <View style={styles.brandSkeleton} />
      </SkeletonPlaceholder>
    </View>
  );
};

const AllProviders = () => {
  const source = useRef<any>(null);
  const theme = useAppTheme();
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
      <View style={styles.header}>
        <Text variant={'titleMedium'} style={styles.title}>
          All Providers
        </Text>
        <TouchableOpacity style={styles.viewAllContainer}>
          <Text variant={'bodyMedium'} style={styles.viewAllLabel}>
            View All
          </Text>
          <Icon
            name={'keyboard-arrow-right'}
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
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
          keyExtractor={(item, index) => `${item.id}${index}`}
        />
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginTop: 28,
      paddingHorizontal: 16,
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
    viewAllContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    title: {
      color: colors.neutral400,
    },
    viewAllLabel: {
      color: colors.neutral400,
    },
  });

export default AllProviders;
