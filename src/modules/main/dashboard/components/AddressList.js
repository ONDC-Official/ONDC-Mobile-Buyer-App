import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {getData} from '../../../../utils/api';
import {BASE_URL, DELIVERY_ADDRESS} from '../../../../utils/apiUtilities';
import {useSelector} from 'react-redux';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import Address from './Address';
import {getStoredData} from '../../../../utils/storage';
import {skeletonList} from '../../../../utils/utils';
import AddressSkeleton from './AddressSkeleton';
import {Button, IconButton, withTheme} from 'react-native-paper';
import {appStyles} from '../../../../styles/styles';
import useRefreshToken from "../../../../hooks/useRefreshToken";

const AddressList = ({navigation, theme, route: {params}}) => {
  const {} = useRefreshToken();
  const {token} = useSelector(({authReducer}) => authReducer);
  const {handleApiError} = useNetworkErrorHandling();
  const [apiInProgress, setApiInProgress] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);

  /**
   * function to get list of address from server
   * @returns {Promise<void>}
   */
  const getAddressList = async () => {
    try {
      setApiInProgress(true);
      const {data} = await getData(`${BASE_URL}${DELIVERY_ADDRESS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(data);
      setApiInProgress(false);
    } catch (error) {
      console.log(error);
      setApiInProgress(false);
      if (error.response) {
        if (error.response.status === 404) {
          setAddresses([]);
        } else {
          handleApiError(error);
        }
      } else {
        handleApiError(error);
      }
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          size={24}
          icon={'plus-circle'}
          iconColor={theme.colors.primary}
          onPress={() =>
            navigation.navigate('AddDefaultAddress', {setDefault: false})
          }
        />
      ),
    });

    const unsubscribeFocus = navigation.addListener('focus', () => {
      getAddressList()
        .then(() => {})
        .catch(() => {});
    });

    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  useEffect(() => {
    getStoredData('address').then(response => {
      if (response) {
        setCurrentAddress(JSON.parse(response));
      }
    });
  }, []);

  const renderItem = ({item}) => {
    const isSelected = currentAddress?.id === item?.id;
    return item.hasOwnProperty('isSkeleton') ? (
      <AddressSkeleton />
    ) : (
      <Address item={item} isCurrentAddress={isSelected} params={params} />
    );
  };

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
            <Button
              labelStyle={appStyles.containedButtonLabel}
              contentStyle={appStyles.containedButtonContainer}
              mode="outlined"
              onPress={() => navigation.navigate('AddDefaultAddress')}>
              Add Address
            </Button>
          </View>
        )}
        contentContainerStyle={
          list.length > 0 ? styles.contentContainerStyle : appStyles.container
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    marginVertical: 16,
  },
});

export default withTheme(AddressList);
