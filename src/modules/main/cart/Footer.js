import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {appStyles} from '../../../styles/styles';

/**
 * Component to render footer in cart
 * @param theme
 * @param onCheckout:function handles click event of check out button
 * @param onClearCart:function handles click event of clear cart button
 * @constructor
 * @returns {JSX.Element}
 */
const Footer = ({theme, onCheckout, onClearCart}) => {
  const {colors} = theme;
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const itemsCount = cartItems.reduce((total, item) => {
    total += item.quantity;
    return total;
  }, 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          appStyles.container,
          styles.clearCartButton,
          {
            borderColor: colors.accentColor,
            backgroundColor: colors.accentColor,
          },
        ]}
        onPress={onCheckout}>
        <Text style={[styles.text, {color: colors.white}]}>
          proceed to buy {itemsCount} items
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default withTheme(Footer);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {fontSize: 16, textTransform: 'uppercase'},
  clearCartButton: {
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  space: {margin: 10},
});
