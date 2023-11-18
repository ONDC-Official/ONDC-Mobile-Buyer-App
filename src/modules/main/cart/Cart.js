import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Text, withTheme} from 'react-native-paper';

import {clearCart} from '../../../redux/actions';
import {appStyles} from '../../../styles/styles';
import {alertWithTwoButtons} from '../../../utils/alerts';
import EmptyComponent from './EmptyComponent';
import DashboardProduct from '../product/list/component/DashboardProduct/DashboardProduct';
import {stringToDecimal} from '../../../utils/utils';

/**
 * Component to render list of items added in cart
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @constructor
 * @returns {JSX.Element}
 */
const Cart = ({navigation, theme}) => {
  const dispatch = useDispatch();

  const {colors} = theme;

  const {cartItems, subTotal} = useSelector(({cartReducer}) => cartReducer);

  const emptyCart = () => dispatch(clearCart());

  /**
   * function handles click event of clear cart button
   * which clears the cart list
   */
  const onClearCart = () => {
    alertWithTwoButtons(
      null,
      'Are you sure you want to clear cart?',
      'Ok',
      emptyCart,
      'Cancel',
      () => {
      },
    );
  };

  /**
   * Function is used to render single product card in the list
   * @param item:single object from cart list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => (
    <DashboardProduct item={item} navigation={navigation}/>
  );

  useEffect(() => {
    if (cartItems.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <Button
            mode="text"
            labelStyle={appStyles.containedButtonLabel}
            onPress={onClearCart}>
            Empty Cart
          </Button>
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: null,
      });
    }
  }, [navigation, cartItems]);

  const cartLength = cartItems.length;
  return (
    <View
      style={[
        appStyles.container,
        styles.container,
        {backgroundColor: colors.backgroundColor},
      ]}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          return <EmptyComponent navigation={navigation}/>;
        }}
        contentContainerStyle={
          cartLength === 0 ? appStyles.container : styles.contentContainerStyle
        }
      />
      {cartLength > 0 && (
        <View style={[styles.footer, {backgroundColor: theme.colors.footer}]}>
          <View style={appStyles.container}>
            <Text>Subtotal</Text>
            <Text style={styles.totalAmount}>₹{stringToDecimal(subTotal)}</Text>
          </View>
          <View style={appStyles.container}>
            <Button
              mode="contained"
              contentStyle={appStyles.containedButtonContainer}
              labelStyle={appStyles.containedButtonLabel}
              onPress={() =>
                navigation.navigate('AddressList', {
                  navigateToNext: 'BillingAddressPicker',
                })
              }>
              Checkout
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default withTheme(Cart);

const styles = StyleSheet.create({
  contentContainerStyle: {paddingBottom: 10},
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
});
