import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {FlatList, StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {
  API_BASE_URL,
  SERVICEABLE_LOCATIONS,
} from '../../../../utils/apiActions';
import {skeletonList} from '../../../../utils/utils';
import Store from '../../stores/components/Store';
import SectionHeaderWithViewAll from '../../../../components/sectionHeaderWithViewAll/SectionHeaderWithViewAll';
import {FB_DOMAIN} from '../../../../utils/constants';
import {saveStoresList} from '../../../../toolkit/reducer/stores';
import useCalculateTimeToShip from '../../../../hooks/useCalculateTimeToShip';

interface StoresNearMe {
  domain?: string;
}

const CancelToken = axios.CancelToken;

const BrandSkeleton = () => {
  const styles = makeStyles();
  return (
    <View style={styles.brand}>
      <SkeletonPlaceholder>
        <View style={styles.brandSkeleton} />
      </SkeletonPlaceholder>
    </View>
  );
};

const StoresNearMe: React.FC<StoresNearMe> = ({domain}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const styles = makeStyles();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {address} = useSelector((state: any) => state?.address);
  const source = useRef<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const {calculateTimeToShip} = useCalculateTimeToShip();

  const getAllLocations = async () => {
    try {
      setApiRequested(true);
      const limit = domain === FB_DOMAIN ? 12 : 9;
      source.current = CancelToken.source();
      const url = `${API_BASE_URL}${SERVICEABLE_LOCATIONS}?latitude=${
        address.address.lat
      }&longitude=${address.address.lng}&pincode=${
        address.address.areaCode
      }&radius=100${domain ? `&domain=${domain}` : ''}&limit=${limit}`;
      const {data} = await getDataWithAuth(url, source.current.token);
      setLocations(
        calculateTimeToShip(data.data, {
          latitude: address.address.lat,
          longitude: address.address.lng,
        }),
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  const showAllStores = () => {
    dispatch(saveStoresList(locations));
    navigation.navigate('StoresNearMe', {domain});
  };

  const renderSkeletonItem = useCallback(() => <BrandSkeleton />, []);

  const renderItem = useCallback(
    ({item}: {item: any}) => <Store store={item} />,
    [],
  );

  useEffect(() => {
    if (address) {
      getAllLocations().then(() => {});
    }

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, [domain, address]);

  return (
    <View style={styles.sectionContainer}>
      <SectionHeaderWithViewAll
        title={t('Home.Stores Near Me')}
        viewAll={showAllStores}
      />

      <View style={styles.container}>
        {apiRequested ? (
          <FlatList
            contentContainerStyle={styles.listContainer}
            numColumns={3}
            data={skeletonList}
            keyExtractor={item => item.id}
            renderItem={renderSkeletonItem}
          />
        ) : (
          <FlatList
            contentContainerStyle={styles.listContainer}
            numColumns={3}
            data={locations}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      marginTop: 12,
    },
    brand: {
      width: 113,
      marginRight: 11,
      marginBottom: 15,
    },
    brandSkeleton: {
      width: 113,
      height: 108,
      marginRight: 11,
    },
    sectionContainer: {
      paddingTop: 28,
    },
    listContainer: {
      paddingHorizontal: 8,
    },
  });

export default StoresNearMe;
