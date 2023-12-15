import {StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, {useState} from 'react';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {FB_DOMAIN} from '../../../../../utils/constants';

interface Brand {
  brand: any;
}

const NoImageAvailable = require('../../../../../assets/noImage.png');

const Brand: React.FC<Brand> = ({brand}) => {
  const [imageSource, setImageSource] = useState(
    brand?.descriptor?.symbol
      ? {uri: brand?.descriptor?.symbol}
      : NoImageAvailable,
  );
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const navigateToBrandDetails = (provider: any) => {
    if (provider.domain === FB_DOMAIN) {
      navigation.navigate('Outlets', {brandId: provider.id});
    } else {
      navigation.navigate('BrandDetails', {brandId: provider.id});
    }
  };

  return (
    <TouchableOpacity
      style={styles.brand}
      onPress={() => navigateToBrandDetails(brand)}>
      <FastImage
        source={imageSource}
        style={styles.brandImage}
        onError={() => setImageSource(NoImageAvailable)}
      />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    brand: {
      width: 109,
      height: 109,
      marginRight: 15,
      borderRadius: 12,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandImage: {
      width: 100,
      height: 100,
    },
  });

export default Brand;
