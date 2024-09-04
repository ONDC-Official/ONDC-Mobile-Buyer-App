import {TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WishListAction = ({color = '#fff'}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const showWishList = () => {
    navigation.navigate('List');
  };

  return (
    <TouchableOpacity onPress={showWishList}>
      <Icon name={'favorite-outline'} size={24} color={color} />
    </TouchableOpacity>
  );
};

export default WishListAction;
