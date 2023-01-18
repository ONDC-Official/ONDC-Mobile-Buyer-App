import React, {useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, TouchableOpacity, View,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {Avatar, Text, withTheme} from 'react-native-paper';

import {appStyles} from '../../../styles/styles';
import {getUserInitials} from '../../../utils/utils';
import {getStoredData} from '../../../utils/storage';
import ProductSearch from '../product/list/component/header/ProductSearch';
import Products from '../product/list/Products';
import useProductList from '../product/hook/useProductList';

const Dashboard = ({navigation, theme}) => {
  const isFocused = useIsFocused();
  const [address, setAddress] = useState(null);
  const {name, photoURL} = useSelector(({authReducer}) => authReducer);

  const {onSearch} = useProductList();

  useEffect(() => {
    getStoredData('address').then(response => {
      if (response) {
        setAddress(JSON.parse(response));
      }
    });
  }, [isFocused]);

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: theme.colors.surface}]}>
      <View>
        <View style={styles.header}>
          {address ? (
            <TouchableOpacity
              style={styles.addressContainer}
              onPress={() => navigation.navigate('AddressList')}>
              <Text style={[styles.address, {color: theme.colors.primary}]}>
                {address?.descriptor?.name}
              </Text>
              <Icon name={'chevron-down'} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator
              size={'small'}
              color={theme.colors.primary}
            />
          )}

          {photoURL ? (
            <Avatar.Image size={32} rounded source={{uri: photoURL}} />
          ) : (
            <Avatar.Text
              size={32}
              rounded
              label={getUserInitials(name ?? '')}
            />
          )}
        </View>
        <ProductSearch onSearch={onSearch} />
      </View>
      <Products />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  search: {backgroundColor: 'white'},
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
    marginEnd: 8,
  },
});

export default withTheme(Dashboard);
