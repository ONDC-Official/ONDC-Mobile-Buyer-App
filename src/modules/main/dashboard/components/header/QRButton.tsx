import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

const QRButton = ({color}: {color: string}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const showQRScanner = () => {
    navigation.navigate('SellerQRCode');
  };

  return (
    <TouchableOpacity onPress={showQRScanner}>
      <Icon name={'qr-code-scanner'} color={color} size={24} />
    </TouchableOpacity>
  );
};

export default QRButton;
