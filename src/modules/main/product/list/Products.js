import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {appStyles} from '../../../../styles/styles';
import ListPlaceholder from './component/placeholder/ListPlaceholder';
import ProductCardSkeleton from './component/ProductCardSkeleton';
import DashboardProduct from './component/DashboardProduct/DashboardProduct';
import {theme} from '../../../../utils/theme';
import ContainButton from '../../../../components/button/ContainButton';

/**
 * Component to show list of requested products
 * @constructor
 * @returns {JSX.Element}
 */
const Products = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
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
    <View style={appStyles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
        ListEmptyComponent={() => <ListPlaceholder />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.contentContainerStyle}
      />
      {cartLength > 0 && (
        <View style={styles.footer}>
          <ContainButton
            title={t('main.product.view_products_in_cart', {
              count: cartLength,
              total: subTotal,
            })}
            style={styles.row}
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 16},
  separator: {
    height: 0.5,
    width: '100%',
    backgroundColor: theme.colors.primary,
  },
  footer: {
    padding: 16,
  },
});

export default withTheme(Products);
