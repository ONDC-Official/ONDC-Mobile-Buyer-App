import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';

const message = strings('main.cart.empty_cart_message');

const EmptyComponent = () => {
  return (
    <View style={[appStyles.container, styles.container]}>
      <Text>{message}</Text>
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
});
