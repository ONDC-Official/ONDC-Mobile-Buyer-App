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
import {useAppTheme} from '../../utils/theme';
import VegNonVegTag from '../products/VegNonVegTag';
import {
  CURRENCY_SYMBOLS,
  FB_DOMAIN,
  GROCERY_DOMAIN,
} from '../../utils/constants';
import moment from 'moment';
import 'moment-duration-format';
import {useSelector} from 'react-redux';
import {calculateDistanceBetweenPoints} from '../../utils/utils';

const Location = require('../../assets/location.png');
const Timer = require('../../assets/timer.png');

const Provider = ({provider}: {provider: any}) => {
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [minutes, setMinutes] = useState(0);
  const [distance, setDistance] = useState(0);
  const [addressres, setAddressRes] = useState(0);
  const {address} = useSelector(({address}) => address);

  const navigateToProviderDetails = () => {
    if (!!provider.items && provider.items.length > 0) {
      const latestItem = provider.items[0];
      const routeParams: any = {
        brandId: latestItem.provider_details.id,
        minutes: minutes,
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
    let highMin = 0;
    let latLong;
    let locality = '';
    provider?.items.forEach(item => {
      const isoDuration = item?.item_details?.['@ondc/org/time_to_ship'];
      const duration = moment.duration(isoDuration);
      let minutes = duration.format('m');
      minutes = minutes.replace(/\,/g, '');

      if (highMin < minutes) {
        highMin = minutes;
        latLong = item.location_details?.gps.split(/\s*,\s*/);
        locality = item.location_details?.address?.locality;
      }
    });

    const distance = calculateDistanceBetweenPoints(
      {
        latitude: address.address.lat,
        longitude: address.address.lng,
      },
      {
        latitude: latLong[0],
        longitude: latLong[1],
      },
    );
    setDistance(distance);

    let totalMinutes = highMin + (distance / 15) * 60;
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    let fixMinutes =
      days > 0
        ? days + ' days '
        : hours > 0
        ? hours + ' hours '
        : minutes.toFixed(0) + ' minutes ';
    setMinutes(fixMinutes);
    setAddressRes(locality);
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
              {addressres}
            </Text>
            <View style={styles.dotView} />
            <Image style={styles.imageIcon} source={Location} />
            <Text variant={'labelMedium'} style={styles.providerLocality}>
              {distance + ' Km'}
            </Text>
            <View style={styles.dotView} />
            <Image style={styles.imageIcon} source={Timer} />
            <Text variant={'labelMedium'} style={styles.providerLocality}>
              {minutes}
            </Text>
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
