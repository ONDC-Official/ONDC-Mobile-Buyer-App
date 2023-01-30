import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {appStyles} from '../../../../styles/styles';
import ListPlaceholder from './component/placeholder/ListPlaceholder';
import ProductCardSkeleton from './component/ProductCardSkeleton';
import DashboardProduct from './component/DashboardProduct/DashboardProduct';
import CartFooter from './component/CartFooter/CartFooter';

const ListFooter = ({moreRequested}) =>
  moreRequested ? <ProductCardSkeleton /> : null;

/**
 * Component to show list of requested products
 * @constructor
 * @returns {JSX.Element}
 */
const Products = ({theme, loadMore, productsRequested}) => {
  const navigation = useNavigation();
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const {products} = useSelector(({productReducer}) => productReducer);

  /**
   * Function is used to render single product card in the list
   * @param item:single object from products list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    const element = cartItems.find(one => one.id === item.id);
    item.quantity = element ? element.quantity : 0;
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ProductCardSkeleton />
    ) : (
      <DashboardProduct item={item} navigation={navigation} />
    );
  };

  return (
    <View
      style={[
        appStyles.container,
        {backgroundColor: theme.colors.pageBackground},
      ]}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
        ListEmptyComponent={() => <ListPlaceholder />}
        contentContainerStyle={
          products.length > 0
            ? styles.contentContainerStyle
            : [appStyles.container, styles.emptyContainer]
        }
        onEndReached={loadMore}
        ListFooterComponent={
          <ListFooter
            moreRequested={productsRequested && products.length > 0}
          />
        }
      />
      <CartFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 8},
  emptyContainer: {
    backgroundColor: 'white',
  },
});

export default withTheme(Products);
