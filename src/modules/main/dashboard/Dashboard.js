import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View,} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {withTheme} from 'react-native-paper';

import {appStyles} from '../../../styles/styles';
import {getStoredData} from '../../../utils/storage';
import ProductSearch from '../product/list/component/header/ProductSearch';
import Home from './components/Home';
import HeaderMenu from '../../../components/headerMenu/HeaderMenu';
import AddressTag from "./components/AddressTag";

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
          <AddressTag address={address} />

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
    padding: 12,
  },
});

export default withTheme(Dashboard);
