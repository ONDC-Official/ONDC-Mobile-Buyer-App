import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {skeletonList} from '../../../utils/utils';
import useNetworkHandling from '../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, PROVIDER_LOCATIONS} from '../../../utils/apiActions';
import {appStyles} from '../../../styles/styles';
import Page from '../../../components/page/Page';
import {useAppTheme} from '../../../utils/theme';

interface Outlets {
  navigation: any;
  route: any;
}

const CancelToken = axios.CancelToken;

const OutletSkeleton = () => {
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

const NoImageAvailable = require('../../../assets/noImage.png');

const Outlets: React.FC<Outlets> = ({navigation, route: {params}}) => {
  const {address} = useSelector((state: any) => state.address);
  const source = useRef<any>(null);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [locations, setLocations] = useState<any[]>([]);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getAllOutlets = async () => {
    try {
      setApiRequested(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${PROVIDER_LOCATIONS}?provider=${params.brandId}&latitude=${address?.address?.lat}&longitude=${address?.address?.lng}&radius=100`,
        source.current.token,
      );
      setLocations(data.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  const navigateToBrandDetails = (provider: any) => {
    navigation.navigate('BrandDetails', {
      brandId: provider.provider,
      outletId: provider.id,
    });
  };

  useEffect(() => {
    getAllOutlets().then(() => {});

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, []);

  return (
    <Page>
      <View style={styles.container}>
        {apiRequested ? (
          <FlatList
            numColumns={2}
            data={skeletonList}
            renderItem={() => <OutletSkeleton />}
            keyExtractor={item => item.id}
          />
        ) : (
          <FlatList
            numColumns={2}
            data={locations}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.brand}
                onPress={() => navigateToBrandDetails(item)}>
                <FastImage
                  source={
                    item?.provider_descriptor?.symbol
                      ? {uri: item?.provider_descriptor?.symbol}
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
            ListEmptyComponent={() => (
              <View style={[appStyles.container, appStyles.centerContainer]}>
                <Text>No Outlets available</Text>
              </View>
            )}
            contentContainerStyle={
              locations.length > 0
                ? styles.contentContainer
                : appStyles.container
            }
          />
        )}
      </View>
    </Page>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 40,
      paddingHorizontal: 16,
      flex: 1,
    },
    title: {
      marginBottom: 12,
    },
    brand: {
      flex: 1,
      borderRadius: 12,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandSkeleton: {
      width: 160,
      height: 160,
    },
    brandImage: {
      width: 160,
      height: 160,
      marginBottom: 12,
    },
    contentContainer: {
      paddingBottom: 16,
    },
  });
export default Outlets;
