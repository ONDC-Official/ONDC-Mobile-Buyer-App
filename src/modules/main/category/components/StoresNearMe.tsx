import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, LOCATIONS} from '../../../../utils/apiActions';
import {skeletonList} from '../../../../utils/utils';

interface StoresNearMe {
  domain: string;
}

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

const NoImageAvailable = require('../../../../assets/noImage.png');

const StoresNearMe: React.FC<StoresNearMe> = ({domain}) => {
  const {latitude, longitude} = useSelector(
    ({locationReducer}) => locationReducer,
  );
  const source = useRef<any>(null);
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [locations, setLocations] = useState<any[]>([]);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getAllLocations = async () => {
    try {
      setApiRequested(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${LOCATIONS}?domain=${domain}&latitude=${latitude}&longitude=${longitude}&radius=100`,
        source.current.token,
      );
      setLocations(data.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  useEffect(() => {
    getAllLocations().then(() => {});

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text variant={'titleSmall'} style={styles.title}>
        Stores near me
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
          horizontal
          data={locations}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.brand}>
              <FastImage
                source={
                  item?.provider_descriptor?.images.length > 0
                    ? {uri: item?.provider_descriptor?.images[0]}
                    : NoImageAvailable
                }
                style={styles.brandImage}
              />
              <Text variant={'bodyMedium'}>
                {item?.provider_descriptor?.name}
              </Text>
            </TouchableOpacity>
          )}
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
      paddingLeft: 16,
    },
    title: {
      marginBottom: 12,
    },
    brand: {
      width: 160,
      marginRight: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandImage: {
      padding: 16,
      borderRadius: 10,
      width: 160,
      height: 160,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EDEDED',
      marginBottom: 12,
    },
    brandSkeleton: {
      width: 160,
      height: 160,
      marginRight: 20,
    },
  });

export default StoresNearMe;
