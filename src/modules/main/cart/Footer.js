import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {withTheme, Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';

const clearCartButton = strings('main.cart.clear_cart_title');

const Footer = ({theme, onPress}) => {
  const {colors} = theme;

  return (
    <TouchableOpacity
      style={[styles.clearCartButton, {borderColor: colors.primary}]}
      onPress={onPress}>
      <Text style={[styles.text, {color: colors.primary}]}>
        {clearCartButton}
      </Text>
    </TouchableOpacity>
  );
};

export default withTheme(Footer);

const styles = StyleSheet.create({
  container: {padding: 10},
  text: {fontSize: 20},
  clearCartButton: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    alignSelf: 'center',
  },
});
