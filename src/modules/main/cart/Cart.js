import React, {useContext} from 'react';
import {View, SafeAreaView, FlatList, StyleSheet} from 'react-native';
import {withTheme, Text} from 'react-native-elements';
import {CartContext} from '../../../context/Cart';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';
import ProductCard from '../product/ProductCard';
import EmptyComponent from './EmptyComponent';
import Footer from './Footer';

const subTotalLabel = strings('main.cart.sub_total_label');
const message = strings('main.cart.empty_cart_message');

/**
 * Component to render list of items added in cart
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @constructor
 * @returns {JSX.Element}
 */
const Cart = ({navigation, theme}) => {
  const {colors} = theme;
  const {
    cart,
    list,
    removeItemFromCart,
    storeItemInCart,
    storeList,
    clearCart,
    updateItemInCart,
    updateCart,
  } = useContext(CartContext);

  /**
   * function  use to calculate total price of item added in cart
   */
  const subTotal = cart.reduce((total, item) => {
    total += item.price.value * item.quantity;
    return total;
  }, 0);

  /**
   * function  use to remove item from cart
   */
  const removeItem = cartItem => {
    const newArray = list.slice();
    let selectedItem = newArray.find(item => {
      return item.id === cartItem.id;
    });
    if (selectedItem) {
      selectedItem.quantity = selectedItem.quantity - 1;
      removeItemFromCart(selectedItem);
      storeList(newArray);
    } else {
      updateItemInCart(cartItem);
    }
  };

  /**
   * function  use to add item in cart
   */
  const addItem = addedItem => {
    const newArray = list.slice();
    let selectedItem = newArray.find(item => {
      return item.id === addedItem.id;
    });
    if (selectedItem) {
      selectedItem.quantity = selectedItem.quantity + 1;
      storeItemInCart(selectedItem);
      storeList(newArray);
    } else {
      updateCart(addedItem);
    }
  };

  /**
   * function handles click event of clear cart button
   * which cleares the cart list
   */
  const onPressHandler = () => {
    let newList = list.slice();
    newList.forEach(item => (item.quantity = 0));
    storeList(newList);
    clearCart();
  };

  /**
   * function handles click event of checkout button
   */
  const onCheckout = () => navigation.navigate('AddressPicker');

  /**
   * Function is used to render single product card in the list
   * @param item:single object from cart list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    console.log(item.descriptor, '////', item.bpp_id);
    return (
      <ProductCard item={item} removeItem={removeItem} addItem={addItem} />
    );
  };

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <View
        style={[
          appStyles.container,
          styles.container,
          {backgroundColor: colors.backgroundColor},
        ]}>
        {cart.length !== 0 && (
          <View style={[styles.header, {backgroundColor: colors.white}]}>
            <Text style={styles.text}>
              {subTotalLabel} {subTotal}
            </Text>
          </View>
        )}
        <FlatList
          data={cart}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return <EmptyComponent message={message} />;
          }}
          contentContainerStyle={
            cart.length === 0
              ? appStyles.container
              : styles.contentContainerStyle
          }
        />
        {cart.length !== 0 && (
          <Footer onPress={onPressHandler} onCheckout={onCheckout} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default withTheme(Cart);

const styles = StyleSheet.create({
  container: {paddingBottom: 10},
  text: {fontSize: 20},
  clearCartButton: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    alignSelf: 'center',
  },
  contentContainerStyle: {paddingBottom: 10},
  header: {
    padding: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    marginBottom: 10,
  },
});
