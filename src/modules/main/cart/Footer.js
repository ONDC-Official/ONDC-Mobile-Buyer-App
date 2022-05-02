import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';

const clearCartButton = strings('main.cart.clear_cart_title');
const checkOutButton = strings('main.cart.checkout');

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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          appStyles.container,
          styles.clearCartButton,
          {borderColor: colors.accentColor},
        ]}
        onPress={onClearCart}>
        <Text style={[styles.text, {color: colors.accentColor}]}>
          {clearCartButton}
        </Text>
      </TouchableOpacity>
      <View style={styles.space}/>
      <TouchableOpacity
        style={[
          appStyles.container,
          styles.clearCartButton,
          {borderColor: colors.accentColor},
        ]}
        onPress={onCheckout}>
        <Text style={[styles.text, {color: colors.accentColor}]}>
          {checkOutButton}
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
  text: {fontSize: 20},
  clearCartButton: {
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
  },
  space: {margin: 10},
});
