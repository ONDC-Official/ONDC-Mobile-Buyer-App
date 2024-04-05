import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useAppTheme} from '../../../../../utils/theme';

const QRButton = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const showQRScanner = () => {
    navigation.navigate('SellerQRCode');
  };

  return (
    <TouchableOpacity onPress={showQRScanner}>
      <Icon name={'qr-code-scanner'} color={theme.colors.white} size={24} />
    </TouchableOpacity>
  );
};

export default QRButton;
