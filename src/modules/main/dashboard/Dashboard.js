import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused} from '@react-navigation/native';
import {Text, withTheme} from 'react-native-paper';

import {appStyles} from '../../../styles/styles';
import {getStoredData} from '../../../utils/storage';
import ProductSearch from '../product/list/component/header/ProductSearch';
import Home from './components/Home';
import HeaderMenu from '../../../components/headerMenu/HeaderMenu';

const Dashboard = ({navigation, theme}) => {
  const isFocused = useIsFocused();
  const [address, setAddress] = useState(null);

  const getAddress = () => {
    getStoredData('address').then(response => {
      if (response) {
        setAddress(JSON.parse(response));
      }
    });
  };

  useEffect(() => {
    getAddress();
  }, [isFocused]);

  useEffect(() => {
    getAddress();
  }, []);

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
                {address?.address?.tag
                  ? address?.address?.tag
                  : address?.descriptor?.city}
              </Text>
              <Icon name={'chevron-down'} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size={'small'} color={theme.colors.primary} />
          )}

          <HeaderMenu />
        </View>
        <ProductSearch viewOnly />
      </View>
      <Home />
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
