import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import SingleAddress from './Address';
import {skeletonList} from '../../../../../utils/utils';
import AddressSkeleton from './AddressSkeleton';
import {appStyles} from '../../../../../styles/styles';
import useRefreshToken from '../../../../../hooks/useRefreshToken';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {API_BASE_URL, DELIVERY_ADDRESS} from '../../../../../utils/apiActions';

interface Address {
  _id: string;
  userId: string;
  id: string;
  descriptor: {
    name: string;
    phone: string;
    email: string;
  };
  defaultAddress: boolean;
  address: {
    door: string;
    name: string | null;
    building: string | null;
    street: string | null;
    locality: string | null;
    ward: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    areaCode: string | null;
    tag: string | null;
    lat: string | null;
    lng: string | null;
  };
}

interface AddressList {
  navigation: any;
  route: any;
}

const CancelToken = axios.CancelToken;

const AddressList: React.FC<AddressList> = ({navigation, route: {params}}) => {
  const [t] = useTranslation();
  const isFocused = useIsFocused();
  const {address} = useSelector(({address}) => address);
  const source = useRef<any>(null);
  const dispatch = useDispatch();
  const {} = useRefreshToken();
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();
  const [apiInProgress, setApiInProgress] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(address);

  /**
   * function to get list of address from server
   * @returns {Promise<void>}
   */
  const getAddressList = async () => {
    try {
      setApiInProgress(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${DELIVERY_ADDRESS}`,
        source.current.token,
      );
      setAddresses(data);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          setAddresses([]);
        } else {
          handleApiError(error);
        }
      } else {
        handleApiError(error);
      }
    } finally {
      setApiInProgress(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getAddressList()
        .then(() => {})
        .catch(() => {});
    }

    return () => {
      if (source.current) {
        source.current.cancel();
      }
    };
  }, [isFocused]);

  const addAddress = () =>
    navigation.navigate('AddDefaultAddress', {setDefault: false});

  const onAddressSelect = async (item: any) => {
    setCurrentAddress(item);
  };

  const renderItem = ({item}: {item: any}) => {
    const isSelected = currentAddress?.id === item?.id;
    return item.hasOwnProperty('isSkeleton') ? (
      <AddressSkeleton />
    ) : (
      <SingleAddress
        item={item}
        isCurrentAddress={isSelected}
        params={params}
        onAddressSelect={onAddressSelect}
      />
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: t('Address List.Delivery Address'),
    });
  }, []);

  const list = apiInProgress ? skeletonList : addresses;

  return (
    <View style={appStyles.container}>
      <FlatList
        style={appStyles.container}
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <View style={[appStyles.container, appStyles.centerContainer]}>
            <Text variant={'bodyMedium'}>
              {t('Address List.No address available')}
            </Text>
          </View>
        )}
        contentContainerStyle={
          list.length > 0 ? styles.contentContainerStyle : appStyles.container
        }
      />
      <Button style={styles.addButton} mode={'contained'} onPress={addAddress}>
        {t('Address List.Add Address')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 16,
  },
  addButton: {
    borderRadius: 8,
    marginHorizontal: 16,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddressList;
