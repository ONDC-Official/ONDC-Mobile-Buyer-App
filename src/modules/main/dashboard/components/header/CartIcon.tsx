import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useAppTheme} from '../../../../../utils/theme';
import FastImage from 'react-native-fast-image';

const CartIcon = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const showCart = () => {
    navigation.navigate('DashboardCart');
  };

  return (
    <TouchableOpacity onPress={showCart}>
      <FastImage
        source={require('../../../../../assets/shopping_cart.png')}
        style={styles.WishListImage}
        tintColor={theme.colors.white}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    WishListImage: {
      width: 20,
      height: 20,
      objectFit: 'contain',
    },
  });

export default CartIcon;
