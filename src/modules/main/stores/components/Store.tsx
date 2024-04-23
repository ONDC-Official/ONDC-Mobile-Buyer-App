import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {useAppTheme} from '../../../../utils/theme';

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
    routeParams.outletId = location.id;
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
        {store?.address?.locality}
      </Text>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    brand: {
      marginBottom: 15,
      flex: 1,
      marginHorizontal: 8,
    },
    brandImage: {
      borderRadius: 8,
      width: '100%',
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    name: {
      color: colors.neutral400,
      marginBottom: 4,
      flex: 1,
    },
    details: {
      color: colors.neutral300,
      flex: 1,
    },
  });

export default Store;
