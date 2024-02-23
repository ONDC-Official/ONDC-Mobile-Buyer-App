import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {useAppTheme} from '../../../../utils/theme';
import {FB_DOMAIN} from '../../../../utils/constants';

interface StoreImage {
  source: any;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const StoreImage: React.FC<StoreImage> = ({source}) => {
  const theme = useAppTheme();
  const [imageSource, setImageSource] = useState(source);
  const styles = makeStyles(theme.colors);

  return (
    <FastImage
      resizeMode={FastImage.resizeMode.contain}
      source={imageSource}
      style={styles.brandImage}
      onError={() => setImageSource(NoImageAvailable)}
    />
  );
};

const Store = ({store}: {store: any}) => {
  const navigation = useNavigation<any>();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);

  const navigateToDetails = (location: any) => {
    const routeParams: any = {
      brandId: location.provider,
    };

    if (location.domain === FB_DOMAIN) {
      routeParams.outletId = location.id;
    }
    navigation.navigate('BrandDetails', routeParams);
  };

  return (
    <TouchableOpacity
      style={styles.brand}
      onPress={() => navigateToDetails(store)}>
      <StoreImage
        source={
          store?.provider_descriptor?.images?.length > 0
            ? {uri: store?.provider_descriptor?.images[0]}
            : NoImageAvailable
        }
      />
      <Text
        variant={'bodyLarge'}
        style={styles.name}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        {store?.provider_descriptor?.name}
      </Text>
      <Text
        style={styles.details}
        variant={'labelSmall'}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        {store?.provider_descriptor?.name}
      </Text>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    brand: {
      width: 113,
      marginRight: 11,
      marginBottom: 15,
    },
    brandImage: {
      borderRadius: 8,
      width: 113,
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    name: {
      color: colors.neutral400,
      marginBottom: 4,
    },
    details: {
      color: colors.neutral300,
    },
  });

export default Store;
