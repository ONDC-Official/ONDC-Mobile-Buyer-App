import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
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
import AddressTag from '../../dashboard/components/AddressTag';
import useRefreshToken from '../../../../hooks/useRefreshToken';

const SearchProductList = ({navigation, theme, route: {params}}) => {
  const isFocused = useIsFocused();
  const {} = useRefreshToken();
  const [address, setAddress] = useState(null);

  const {products} = useSelector(({productReducer}) => productReducer);
  const {filters} = useSelector(({filterReducer}) => filterReducer);

  const {onSearch, loadMore, updateFilterCount, productsRequested} =
    useProductList(params?.category);

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
    } else {
      onSearch('', SEARCH_QUERY.UNKNOWN);
    }
  }, []);

  useEffect(() => {
    const searchOnAddressChange = async () => {
      const newAddress = await getStoredData('address');
      if (isFocused && newAddress !== address) {
        if (params) {
          onSearch(params.category, SEARCH_QUERY.CATEGORY);
        } else {
          onSearch('', SEARCH_QUERY.UNKNOWN);
        }
      }
    };
    searchOnAddressChange();
  }, [address]);

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

      {filters && products.length > 0 && (
        <SortAndFilter updateFilterCount={updateFilterCount} />
      )}

      <Products loadMore={loadMore} productsRequested={productsRequested} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default withTheme(SearchProductList);
