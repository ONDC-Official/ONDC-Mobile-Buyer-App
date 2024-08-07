import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useMemo, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useAppTheme} from '../../../../utils/theme';
import useMinutesToString from '../../../../hooks/useMinutesToString';
import useFormatNumber from '../../../../hooks/useFormatNumber';
import StoreIcon from '../../../../assets/no_store_icon.svg';

interface StoreImage {
  source: any;
}

const NoImageAvailable = require('../../../../assets/no_store.png');

const StoreImage: React.FC<StoreImage> = ({source}) => {
  const theme = useAppTheme();
  const [imageSource, setImageSource] = useState(source);
  const [imageLoadFailed, setImageLoadFailed] = useState<boolean>(false);

  const styles = makeStyles(theme.colors);

  const onError = () => {
    setImageLoadFailed(true);
    setImageSource(NoImageAvailable);
  };

  if (source) {
    return (
      <FastImage
        resizeMode={
          imageLoadFailed
            ? FastImage.resizeMode.cover
            : FastImage.resizeMode.contain
        }
        source={imageSource}
        style={styles.brandImage}
        onError={onError}
      />
    );
  } else {
    return (
      <View style={[styles.brandImage, styles.brandImageEmpty]}>
        <StoreIcon width={48} height={48} />
      </View>
    );
  }
};

const Store = ({store}: {store: any}) => {
  const {t} = useTranslation();
  const {formatNumber, formatDistance} = useFormatNumber();
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

  const {timeToShip, imageSource} = useMemo(() => {
    let source = null;

    if (store?.provider_descriptor?.symbol) {
      source = {uri: store?.provider_descriptor?.symbol};
    } else if (store?.provider_descriptor?.images?.length > 0) {
      source = {uri: store?.provider_descriptor?.images[0]};
    }

    return {
      timeToShip: convertMinutesToHumanReadable(store?.timeToShip),
      imageSource: source,
    };
  }, [store]);

  return (
    <TouchableOpacity
      style={styles.brand}
      onPress={() => navigateToDetails(store)}>
      <StoreImage source={imageSource} />
      <Text
        variant={'bodyLarge'}
        style={styles.name}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        {store?.provider_descriptor?.name}
      </Text>
      <View style={styles.addressContainer}>
        {!!timeToShip && (
          <Text style={styles.details} variant={'labelSmall'}>
            {translateMinutesToHumanReadable(timeToShip.type, timeToShip.time)}
          </Text>
        )}
        <View style={styles.dot} />
        <Text
          style={styles.distance}
          variant={'labelSmall'}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {t('Store.km', {
            distance: formatNumber(formatDistance(store?.distance)),
          })}
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
    brandImageEmpty: {
      backgroundColor: colors.neutral200,
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
