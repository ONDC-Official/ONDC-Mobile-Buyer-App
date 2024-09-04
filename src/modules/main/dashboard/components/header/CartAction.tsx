import {TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CartAction = ({color = '#fff'}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const showCart = () => {
    navigation.navigate('DashboardCart');
  };

  return (
    <TouchableOpacity onPress={showCart}>
      <Icon name={'cart-outline'} size={24} color={color} />
    </TouchableOpacity>
  );
};

export default CartAction;
