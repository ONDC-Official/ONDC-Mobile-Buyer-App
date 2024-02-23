import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {API_BASE_URL, LOCATIONS} from '../../../../utils/apiActions';
import {skeletonList} from '../../../../utils/utils';
import {FB_DOMAIN} from '../../../../utils/constants';
import {useAppTheme} from '../../../../utils/theme';
import {saveStoresList} from '../../../../redux/stores/actions';
import Store from "../../stores/components/Store";

interface StoresNearMe {
  domain?: string;
}

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

const StoresNearMe: React.FC<StoresNearMe> = ({domain}) => {
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {address} = useSelector(({addressReducer}) => addressReducer);
  const source = useRef<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [apiRequested, setApiRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getAllLocations = async () => {
    try {
      setApiRequested(true);
      source.current = CancelToken.source();
      const url = `${API_BASE_URL}${LOCATIONS}?latitude=${
        address.address.lat
      }&longitude=${address.address.lng}&radius=100${
        domain ? `&domain=${domain}` : ''
      }`;
      const {data} = await getDataWithAuth(url, source.current.token);
      setLocations(data.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setApiRequested(false);
    }
  };

  const showAllStores = () => {
    dispatch(saveStoresList(locations));
    navigation.navigate('StoresNearMe');
  };

  useEffect(() => {
    getAllLocations().then(() => {});

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, [domain]);

  const numColumns = apiRequested
    ? Math.ceil(skeletonList.length / 2)
    : Math.ceil(locations.length / 2);

  return (
    <View>
      <View style={styles.header}>
        <Text variant={'titleMedium'} style={styles.viewAllLabel}>
          Stores Near Me
        </Text>
        <TouchableOpacity
          style={styles.viewAllContainer}
          onPress={showAllStores}>
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

      <View style={styles.container}>
        {apiRequested ? (
          <FlatList
            horizontal
            data={skeletonList}
            renderItem={() => <BrandSkeleton />}
            keyExtractor={item => item.id}
          />
        ) : (
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{
                alignSelf: 'flex-start',
              }}
              numColumns={numColumns}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={locations}
              renderItem={({item}) => <Store store={item} />}
              keyExtractor={item => item.id}
              ListEmptyComponent={() => (
                <Text variant={'bodyLarge'}>No stores near you</Text>
              )}
            />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    brand: {
      width: 113,
      marginRight: 11,
      marginBottom: 15,
    },
    brandImage: {
      borderRadius: 8,
      width: 113,
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      objectFit: 'contain',
    },
    brandSkeleton: {
      width: 113,
      height: 108,
      marginRight: 11,
    },
    viewAllContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 28,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    viewAllLabel: {
      color: colors.neutral400,
    },
    name: {
      color: colors.neutral400,
      marginBottom: 4,
    },
    details: {
      color: colors.neutral300,
    },
  });

export default StoresNearMe;
