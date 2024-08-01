import React, {useCallback, useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import 'moment-duration-format';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAppTheme} from '../../utils/theme';
import VegNonVegTag from '../products/VegNonVegTag';
import {
  CURRENCY_SYMBOLS,
  FB_DOMAIN,
  GROCERY_DOMAIN,
} from '../../utils/constants';
import useMinutesToString from '../../hooks/useMinutesToString';
import useFormatNumber from '../../hooks/useFormatNumber';
import {calculateDistanceBetweenPoints} from '../../utils/utils';

const NoImageAvailable = require('../../assets/noImage.png');

const Provider = ({provider}: {provider: any}) => {
  const {t} = useTranslation();
  const {formatNumber, formatDistance} = useFormatNumber();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector((state: any) => state?.address);
  const {convertMinutesToHumanReadable, translateMinutesToHumanReadable} =
    useMinutesToString();

  const navigateToProviderDetails = () => {
    if (!!provider.items && provider.items.length > 0) {
      const latestItem = provider.items[0];
      const routeParams: any = {
        brandId: latestItem.provider_details.id,
      };

      if (latestItem.location_details) {
        routeParams.outletId = latestItem.location_details.id;
      }
      navigation.navigate('BrandDetails', routeParams);
    }
  };

  const renderItem = useCallback(({item}: {item: any}) => {
    let imageSource = NoImageAvailable;
    if (item?.item_details?.descriptor.symbol) {
      imageSource = {uri: item?.item_details?.descriptor.symbol};
    } else if (item?.item_details?.descriptor?.images?.length > 0) {
      imageSource = {uri: item?.item_details?.descriptor.images[0]};
    }

    return (
      <View style={styles.product}>
        <FastImage source={imageSource} style={styles.productImage} />
        <View style={styles.productNameContainer}>
          {(item?.context?.domain === GROCERY_DOMAIN ||
            item?.context.domain === FB_DOMAIN) && (
            <View style={styles.vegNonvegContainer}>
              <VegNonVegTag tags={item?.item_details?.tags} showLabel={false} />
            </View>
          )}
          <Text
            variant={'labelLarge'}
            style={styles.productName}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {item?.item_details?.descriptor?.name}
          </Text>
        </View>
        <Text variant={'bodyLarge'} style={styles.productAmount}>
          {CURRENCY_SYMBOLS[item?.item_details?.price?.currency]}
          {item?.item_details?.price?.value}
        </Text>
      </View>
    );
  }, []);

  const {timeToShip, locality, distance} = useMemo(() => {
    if (provider && provider?.items.length > 0) {
      const locationDetails = provider?.items[0].location_details;
      const latLong = locationDetails.gps.split(/\s*,\s*/);

      const newDistance = calculateDistanceBetweenPoints(
        {
          latitude: address.address.lat,
          longitude: address.address.lng,
        },
        {
          latitude: Number(latLong[0]),
          longitude: Number(latLong[1]),
        },
      );
      let travelTime = (Number(newDistance) * 60) / 15;
      const medianTimeToShipMinutes =
        (locationDetails.median_time_to_ship ?? 0) / 60;
      return {
        timeToShip: convertMinutesToHumanReadable(
          Number(medianTimeToShipMinutes) + travelTime,
        ),
        locality: locationDetails.address?.locality || 'NA',
        distance: newDistance,
      };
    } else {
      return {
        timeToShip: {type: 'minutes', time: 0},
        locality: '',
        distance: 0,
      };
    }
  }, [provider]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={navigateToProviderDetails}>
        <FastImage
          source={{uri: provider?.descriptor?.symbol}}
          style={styles.image}
        />
        <View style={styles.providerMeta}>
          <Text
            variant={'titleLarge'}
            style={styles.providerName}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {provider?.descriptor?.name}
          </Text>
          <View style={styles.providerLocalityView}>
            <Text
              variant={'labelMedium'}
              style={styles.providerLocality}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {locality}
            </Text>
            <View style={styles.dotView} />
            <Icon
              name={'location-pin'}
              size={16}
              color={theme.colors.neutral200}
            />
            <Text variant={'labelMedium'} style={styles.distance}>
              {t('Store.km', {
                distance: formatNumber(formatDistance(distance)),
              })}
            </Text>
            <View style={styles.providerLocalityView}>
              <View style={styles.dotView} />
              <MaterialCommunityIcon
                name={'clock'}
                size={16}
                color={theme.colors.neutral200}
              />
              <Text variant={'labelMedium'} style={styles.distance}>
                {translateMinutesToHumanReadable(
                  timeToShip.type,
                  timeToShip.time,
                )}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={provider?.items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 16,
      paddingVertical: 12,
      paddingLeft: 16,
      borderWidth: 0.5,
      borderColor: colors.neutral100,
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    image: {
      width: 48,
      height: 48,
      borderRadius: 8,
      marginRight: 12,
    },
    providerName: {
      marginBottom: 8,
      color: colors.neutral400,
    },
    providerLocalityView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dotView: {
      height: 3,
      width: 3,
      borderRadius: 3,
      backgroundColor: colors.neutral300,
      marginHorizontal: 5,
    },
    providerLocality: {
      color: colors.neutral300,
      flexShrink: 1,
    },
    distance: {
      color: colors.neutral300,
      marginLeft: 3,
    },
    providerMeta: {
      flex: 1,
      paddingRight: 12,
    },
    productImage: {
      width: 116,
      height: 116,
      marginBottom: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.neutral100,
    },
    productNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    vegNonvegContainer: {
      marginRight: 8,
    },
    productName: {
      color: colors.neutral400,
      flex: 1,
      paddingRight: 8,
    },
    productAmount: {
      color: colors.neutral400,
      marginTop: 8,
    },
    product: {
      marginRight: 24,
      width: 116,
    },
  });

export default Provider;
