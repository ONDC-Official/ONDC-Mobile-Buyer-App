import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';

const shopNow = strings('main.cart.shop_now');
const emptyCartMessage = strings('main.cart.empty_cart');
const message = strings('main.cart.message');

/**
 * Component to render list empty component
 * @param message: empty list message
 * @constructor
 * @returns {JSX.Element}
 */
const EmptyComponent = ({theme, navigation}) => {
  const {colors} = theme;
  return (
    <View style={[appStyles.container, styles.container]}>
      <Icon name="folder-open" size={60} color={colors.accentColor} />
      <Text style={styles.title}>{emptyCartMessage}</Text>
      <Text style={styles.subTitle}>{message}</Text>
      <TouchableOpacity
        style={[styles.button, {borderColor: colors.accentColor}]}
        onPress={() => navigation.navigate('Dashboard', {screen: 'Products'})}>
        <Text style={{color: colors.accentColor}}>{shopNow}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default withTheme(EmptyComponent);

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 18, fontWeight: '600', marginVertical: 10},
  subTitle: {textAlign: 'center', lineHeight: 22},
  button: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    marginVertical: 20,
  },
});
