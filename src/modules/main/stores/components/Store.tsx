import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useAppTheme} from '../../../../utils/theme';
import useMinutesToString from '../../../../hooks/useMinutesToString';
import useFormatNumber from '../../../../hooks/useFormatNumber';

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
  const {t} = useTranslation();
  const {formatNumber} = useFormatNumber();
  const {convertMinutesToHumanReadable, translateMinutesToHumanReadable} =
    useMinutesToString();
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

  const timeToShip = convertMinutesToHumanReadable(store?.timeToShip);

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
      <View style={styles.addressContainer}>
        <Text style={styles.details} variant={'labelSmall'}>
          {translateMinutesToHumanReadable(timeToShip.type, timeToShip.time)}
        </Text>
        <View style={styles.dot} />
        <Text
          style={styles.distance}
          variant={'labelSmall'}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {t('Store.km', {distance: formatNumber(store?.distance)})}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    brand: {
      marginBottom: 15,
      flex: 1 / 3,
      marginHorizontal: 5,
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
    },
    distance: {
      color: colors.neutral300,
      flexShrink: 1,
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.neutral300,
      marginHorizontal: 4,
    },
  });

export default Store;
