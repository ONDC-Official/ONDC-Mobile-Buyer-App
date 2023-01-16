import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Avatar} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import {appStyles} from '../../../styles/styles';
import {theme} from '../../../utils/theme';
import {getUserInitials} from '../../../utils/utils';
import {getStoredData} from '../../../utils/storage';
import ProductSearch from '../product/list/component/header/ProductSearch';
import Products from '../product/list/Products';

const Dashboard = ({navigation}) => {
  const isFocused = useIsFocused();
  const [address, setAddress] = useState(null);
  const {name, photoURL} = useSelector(({authReducer}) => authReducer);

  useEffect(() => {
    getStoredData('address').then(response => {
      if (response) {
        setAddress(JSON.parse(response));
      }
    });
  }, [isFocused]);

  return (
    <SafeAreaView style={appStyles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.header}>
          {address ? (
            <TouchableOpacity
              style={styles.addressContainer}
              onPress={() => navigation.navigate('AddressList')}>
              <Text style={styles.address}>{address?.descriptor?.name}</Text>
              <Icon name={'chevron-down'} color={theme.colors.accentColor} />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator
              size={'small'}
              color={theme.colors.accentColor}
            />
          )}

          {photoURL ? (
            <Avatar size={32} rounded source={{uri: photoURL}} />
          ) : (
            <Avatar
              size={32}
              rounded
              title={getUserInitials(name ?? '')}
              containerStyle={{backgroundColor: theme.colors.accentColor}}
            />
          )}
        </View>
        <ProductSearch />
      </View>
      <Products />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: 'white',
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    color: theme.colors.accentColor,
    marginEnd: 8,
  },
});

export default Dashboard;
