import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useAppTheme} from '../../../../../utils/theme';
import FastImage from 'react-native-fast-image';

const WishList = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const showWishList = () => {
    navigation.navigate('List');
  };

  return (
    <TouchableOpacity onPress={showWishList}>
      <FastImage
        source={require('../../../../../assets/favorite.png')}
        tintColor={theme.colors.white}
        style={styles.WishListImage}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    WishListImage: {
      width: 24,
      height: 24,
      objectFit: 'contain',
    },
  });

export default WishList;
