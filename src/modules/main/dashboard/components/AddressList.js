import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {getData} from '../../../../utils/api';
import {GET_ADDRESS, SERVER_URL} from '../../../../utils/apiUtilities';
import {useSelector} from 'react-redux';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {theme} from '../../../../utils/theme';
import Address from './Address';
import {Divider} from 'react-native-elements';
import {getStoredData} from '../../../../utils/storage';
import {skeletonList} from '../../../../utils/utils';
import AddressSkeleton from './AddressSkeleton';

const AddressList = ({navigation}) => {
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
      const {data} = await getData(`${SERVER_URL}${GET_ADDRESS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(data);
      setApiInProgress(false);
    } catch (error) {
      setApiInProgress(false);
      if (error.response) {
        if (error.response.status === 404) {
          setAddresses([]);
        } else {
          handleApiError(error);
        }
      }
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('AddDefaultAddress', {setDefault: false})
          }>
          <Icon
            size={18}
            name={'plus-circle'}
            color={theme.colors.accentColor}
          />
        </TouchableOpacity>
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
      <Address item={item} isCurrentAddress={isSelected} />
    );
  };

  return (
    <View>
      <FlatList
        data={apiInProgress ? skeletonList : addresses}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => {
          return <View />;
        }}
        contentContainerStyle={styles.containerStyle}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginEnd: 16,
  },
  containerStyle: {
    marginVertical: 16,
  },
});

export default AddressList;
