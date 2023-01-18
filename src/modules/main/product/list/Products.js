import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, withTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {appStyles} from '../../../../styles/styles';
import ListPlaceholder from './component/placeholder/ListPlaceholder';
import ProductCardSkeleton from './component/ProductCardSkeleton';
import DashboardProduct from './component/DashboardProduct/DashboardProduct';
import SortAndFilter from './component/header/SortAndFilter';
import filters from './component/Filters';

/**
 * Component to show list of requested products
 * @constructor
 * @returns {JSX.Element}
 */
const Products = ({theme}) => {
  const navigation = useNavigation();
  const {products} = useSelector(({productReducer}) => productReducer);
  const {cartItems, subTotal} = useSelector(({cartReducer}) => cartReducer);

  /**
   * Function is used to render single product card in the list
   * @param item:single object from products list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    const element = cartItems.find(one => one.id === item.id);
    item.quantity = element ? element.quantity : 0;
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ProductCardSkeleton item={item} />
    ) : (
      <DashboardProduct item={item} navigation={navigation} confirmed={true} />
    );
  };

  const cartLength = cartItems.length;
  return (
    <View
      style={[
        appStyles.container,
        {backgroundColor: theme.colors.pageBackground},
      ]}>
      {filters && products.length > 0 && <SortAndFilter />}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
        ListEmptyComponent={() => <ListPlaceholder />}
        contentContainerStyle={
          products.length > 0
            ? styles.contentContainerStyle
            : appStyles.container
        }
      />
      {cartLength > 0 && (
        <View style={styles.footer}>
          <Button mode="contained" onPress={() => navigation.navigate('Cart')}>
            {cartLength} Item | ₹{subTotal} View Cart
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 8},
  footer: {
    padding: 16,
  },
});

export default withTheme(Products);
