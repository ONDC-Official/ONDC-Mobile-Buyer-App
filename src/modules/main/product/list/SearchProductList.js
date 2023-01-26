import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View,} from 'react-native';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {IconButton, Text, withTheme} from 'react-native-paper';

import {appStyles} from '../../../../styles/styles';
import {getStoredData} from '../../../../utils/storage';
import useProductList from '../hook/useProductList';
import ProductSearch from './component/header/ProductSearch';
import Products from './Products';
import {SEARCH_QUERY} from '../../../../utils/Constants';
import SortAndFilter from './component/header/SortAndFilter';
import HeaderMenu from '../../../../components/headerMenu/HeaderMenu';
import AddressTag from "../../dashboard/components/AddressTag";

const SearchProductList = ({navigation, theme, route: {params}}) => {
  const isFocused = useIsFocused();
  const [address, setAddress] = useState(null);

  const {products} = useSelector(({productReducer}) => productReducer);
  const {filters} = useSelector(({filterReducer}) => filterReducer);

  const {onSearch, loadMore, updateFilterCount} = useProductList(
    params?.category,
  );

  useEffect(() => {
    getStoredData('address').then(response => {
      if (response) {
        setAddress(JSON.parse(response));
      }
    });
  }, [isFocused]);

  useEffect(() => {
    if (params) {
      onSearch(params.category, SEARCH_QUERY.CATEGORY);
    }
  }, []);

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: theme.colors.surface}]}>
      <View>
        <View style={styles.header}>
          <View style={styles.addressContainer}>
            <IconButton
              icon={'arrow-left'}
              onPress={() => navigation.goBack()}
            />
            <AddressTag address={address} />
          </View>

          <HeaderMenu />
        </View>
        <ProductSearch onSearch={onSearch} />
      </View>
      <View>
        {!!params && (
          <Text
            style={[
              {
                color: theme.colors.accent,
              },
              styles.category,
            ]}>
            You are now viewing {params.categoryName}
          </Text>
        )}
      </View>

      {filters && products.length > 0 && (
        <SortAndFilter updateFilterCount={updateFilterCount} />
      )}

      <Products
        imageBackgroundColor={
          params ? theme.colors[params.category] : theme.colors.grocery
        }
        loadMore={loadMore}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  search: {backgroundColor: 'white'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingRight: 12,
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginEnd: 8,
  },
  category: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 20,
  },
});

export default withTheme(SearchProductList);
