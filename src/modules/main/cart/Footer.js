import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {appStyles} from '../../../styles/styles';
import {withTheme} from 'react-native-paper';

/**
 * Component to render footer in cart
 * @param theme
 * @param onCheckout:function handles click event of check out button
 * @constructor
 * @returns {JSX.Element}
 */
const Footer = ({theme, onCheckout}) => {
  const {colors} = theme;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          appStyles.container,
          styles.clearCartButton,
          {
            borderColor: colors.primary,
            backgroundColor: colors.primary,
          },
        ]}
        onPress={onCheckout}>
        <Text style={[styles.text, {color: colors.white}]}>
          Checkout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default withTheme(Footer);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: 300,
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
