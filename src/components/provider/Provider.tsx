import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import 'moment-duration-format';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../utils/theme';
import VegNonVegTag from '../products/VegNonVegTag';
import {
  CURRENCY_SYMBOLS,
  FB_DOMAIN,
  GROCERY_DOMAIN,
} from '../../utils/constants';
import {calculateDistanceBetweenPoints} from '../../utils/utils';
import useMinutesToString from '../../hooks/useMinutesToString';
import useFormatNumber from '../../hooks/useFormatNumber';

const Location = require('../../assets/location.png');
const Timer = require('../../assets/timer.png');

const Provider = ({provider}: {provider: any}) => {
  const {t} = useTranslation();
  const {formatNumber} = useFormatNumber();
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState({
    type: 'minutes',
    time: 0,
  });
  const [minDeliveryTime, setMinDeliveryTime] = useState({
    type: 'minutes',
    time: 0,
  });
  const [distance, setDistance] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
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
    return (
      <View style={styles.product}>
        <FastImage
          source={{uri: item?.item_details?.descriptor?.symbol}}
          style={styles.productImage}
        />
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

  useEffect(() => {
    if (provider) {
      let maxMinutes = 0;
      let minMinutes = 999999;
      let latLong: string = '';
      let itemsLocality = '';
      provider?.items.forEach((item: any) => {
        const duration = moment.duration(
          item?.item_details['@ondc/org/time_to_ship'],
        );
        let durationInMinutes = duration.format('m').replace(/\,/g, '');

        if (maxMinutes < durationInMinutes) {
          maxMinutes = durationInMinutes;
          latLong = item.location_details?.gps.split(/\s*,\s*/);
          itemsLocality = item.location_details?.address?.locality;
        }
        if (minMinutes > durationInMinutes) {
          minMinutes = durationInMinutes;
        }
      });

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
      setDistance(newDistance);
      let travelTime = (Number(newDistance) * 60) / 15;
      setMaxDeliveryTime(
        convertMinutesToHumanReadable(Number(maxMinutes) + travelTime),
      );
      setMinDeliveryTime(
        convertMinutesToHumanReadable(Number(minMinutes) + travelTime),
      );
      setLocality(itemsLocality);
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
          <Text variant={'titleLarge'} style={styles.providerName}>
            {provider?.descriptor?.name}
          </Text>
          <View style={styles.providerLocalityView}>
            <Text variant={'labelMedium'} style={styles.providerLocality}>
              {locality}
            </Text>
            <View style={styles.dotView} />
            <Image style={styles.imageIcon} source={Location} />
            <Text variant={'labelMedium'} style={styles.providerLocality}>
              {t('Store.km', {distance: formatNumber(distance)})}
            </Text>
            <View style={styles.providerLocalityView}>
              <View style={styles.dotView} />
              <Image style={styles.imageIcon} source={Timer} />
              <Text variant={'labelMedium'} style={styles.providerLocality}>
                {provider?.items.length === 1
                  ? translateMinutesToHumanReadable(
                      maxDeliveryTime.type,
                      maxDeliveryTime.time,
                    )
                  : maxDeliveryTime.type === minDeliveryTime.type
                  ? `${
                      minDeliveryTime.time
                    } - ${translateMinutesToHumanReadable(
                      maxDeliveryTime.type,
                      maxDeliveryTime.time,
                    )}`
                  : `${translateMinutesToHumanReadable(
                      minDeliveryTime.type,
                      minDeliveryTime.time,
                    )} - ${translateMinutesToHumanReadable(
                      maxDeliveryTime.type,
                      maxDeliveryTime.time,
                    )}`}
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
    imageIcon: {marginRight: 5},
    dotView: {
      height: 3,
      width: 3,
      borderRadius: 3,
      backgroundColor: colors.neutral300,
      marginHorizontal: 5,
    },
    providerLocality: {
      color: colors.neutral300,
    },
    providerMeta: {
      flex: 1,
    },
    productImage: {
      width: 116,
      height: 116,
      marginBottom: 16,
      borderRadius: 14,
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
