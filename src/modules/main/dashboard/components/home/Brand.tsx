import {StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {FB_DOMAIN} from '../../../../../utils/constants';
import {useAppTheme} from '../../../../../utils/theme';

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
  const theme = useAppTheme();
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
      <Text
        variant={'bodyLarge'}
        style={styles.name}
        ellipsizeMode={'tail'}
        numberOfLines={1}>
        {brand?.descriptor?.name}
      </Text>
      <Text
        variant={'labelSmall'}
        style={styles.name}
        ellipsizeMode={'tail'}
        numberOfLines={1}>
        Lorem Ipsum is simply dummy text
      </Text>
      <Text
        variant={'labelMedium'}
        style={styles.name}
        ellipsizeMode={'tail'}
        numberOfLines={1}>
        Lorem Ipsum is simply dummy text
      </Text>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    brand: {
      marginRight: 11,
      width: 113,
    },
    brandImage: {
      width: 113,
      height: 64,
      borderRadius: 8,
      marginBottom: 8,
    },
    name: {
      color: colors.neutral400,
      marginBottom: 4,
    },
  });

export default Brand;
