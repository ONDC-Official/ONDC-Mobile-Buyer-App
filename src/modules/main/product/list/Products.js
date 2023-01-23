import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Text, withTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {appStyles} from '../../../../styles/styles';
import ListPlaceholder from './component/placeholder/ListPlaceholder';
import ProductCardSkeleton from './component/ProductCardSkeleton';
import DashboardProduct from './component/DashboardProduct/DashboardProduct';

/**
 * Component to show list of requested products
 * @constructor
 * @returns {JSX.Element}
 */
const Products = ({theme, imageBackgroundColor, loadMore}) => {
  const navigation = useNavigation();
  const {cartItems, subTotal} = useSelector(({cartReducer}) => cartReducer);
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
      <ProductCardSkeleton item={item} />
    ) : (
      <DashboardProduct
        imageBackgroundColor={imageBackgroundColor}
        item={item}
        navigation={navigation}
      />
    );
  };

  const cartLength = cartItems.length;
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
        onEndReachedThreshold={5}
        onEndReached={loadMore}
      />
      {cartLength > 0 && (
        <View style={[styles.footer, {backgroundColor: theme.colors.footer}]}>
          <View style={appStyles.container}>
            <Text>{cartLength} Item</Text>
            <Text style={styles.totalAmount}>₹{subTotal}</Text>
          </View>
          <View style={appStyles.container}>
            <Button
              mode="contained"
              contentStyle={appStyles.containedButtonContainer}
              labelStyle={appStyles.containedButtonLabel}
              onPress={() => navigation.navigate('Cart')}>
              View Cart
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 8},
  footer: {
    padding: 16,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  emptyContainer: {
    backgroundColor: 'white',
  }
});

export default withTheme(Products);
