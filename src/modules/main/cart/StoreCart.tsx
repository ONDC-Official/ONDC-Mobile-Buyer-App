import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import 'moment-duration-format';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAppTheme} from '../../../utils/theme';
import {
  calculateDistanceBetweenPoints,
  getPriceWithCustomisations,
} from '../../../utils/utils';
import useMinutesToString from '../../../hooks/useMinutesToString';
import useFormatNumber from '../../../hooks/useFormatNumber';

interface StoreCart {
  item: any;
  index: number;
  deleteStore: (values: any) => void;
  goToViewCart: (values: any) => void;
}

const NoImageAvailable = require('../../../assets/noImage.png');

const StoreCart: React.FC<StoreCart> = ({
  item,
  index,
  deleteStore,
  goToViewCart,
}) => {
  const {t} = useTranslation();
  const {formatNumber} = useFormatNumber();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const [cartTotal, setCartTotal] = useState<number>(0);
  const [minutes, setMinutes] = useState({type: 'minutes', time: 0});
  const [distance, setDistance] = useState<string>('');
  const [locality, setLocality] = useState<string>('');

  const {convertMinutesToHumanReadable, translateMinutesToHumanReadable} =
    useMinutesToString();
  const {address} = useSelector((state: any) => state?.address);

  useEffect(() => {
    if (item) {
      let highMin = 0;
      let latLong: any[] = [];
      let itemsLocality = '';
      let total = 0;
      item?.items.forEach((one: any) => {
        const duration = moment.duration(
          one?.item?.product['@ondc/org/time_to_ship'],
        );

        if (one.item.hasCustomisations) {
          total += getPriceWithCustomisations(one) * one?.item?.quantity?.count;
        } else {
          total += one?.item?.product?.subtotal * one?.item?.quantity?.count;
        }

        let durationInMinutes = duration.format('m').replace(/\,/g, '');
        if (highMin < durationInMinutes) {
          highMin = durationInMinutes;
          latLong = one.item.location_details?.gps
            ? one.item.location_details?.gps.split(/\s*,\s*/)
            : [];
          itemsLocality = one.item.location_details?.address?.locality;
        }
      });
      const newDistance =
        latLong.length > 0
          ? calculateDistanceBetweenPoints(
              {
                latitude: address.address.lat,
                longitude: address.address.lng,
              },
              {
                latitude: Number(latLong[0]),
                longitude: Number(latLong[1]),
              },
            )
          : '1.0';
      setDistance(newDistance);
      setCartTotal(total);
      let totalMinutes = Number(highMin) + (Number(newDistance) * 60) / 15;
      setMinutes(convertMinutesToHumanReadable(totalMinutes));
      setLocality(itemsLocality);
    }
  }, [item]);

  return (
    <View>
      <View style={styles.mainItemView}>
        {/* header */}
        <View style={styles.itemHeader}>
          <FastImage
            source={{
              uri: item?.items[0]?.item?.provider?.descriptor?.symbol,
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <View style={styles.titleView}>
              <Text variant="titleLarge" style={styles.title}>
                {item?.location?.provider_descriptor?.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => deleteStore(item?._id)}>
                <Icon
                  name={'close'}
                  size={18}
                  color={theme.colors.neutral400}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.providerLocalityView}>
              <Text
                variant={'labelMedium'}
                style={styles.providerLocality}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {locality}
              </Text>
              <View style={styles.dotView} />
              <Text variant={'labelMedium'} style={styles.distance}>
                {t('Store.km', {distance: formatNumber(distance)})}
              </Text>
              <View style={styles.providerLocalityView}>
                <View style={styles.dotView} />
                <Text variant={'labelMedium'} style={styles.distance}>
                  {translateMinutesToHumanReadable(minutes.type, minutes.time)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* line */}
        <View style={styles.line} />

        {/* items */}
        <Text variant="labelMedium" style={styles.itemCart}>
          {t('Cart.Items in cart', {count: item?.items.length})}
        </Text>

        <ScrollView
          contentContainerStyle={styles.itemMainView}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {item?.items.map((one: any) => {
            let imageSource = NoImageAvailable;
            if (one?.item?.product?.descriptor?.symbol) {
              imageSource = {uri: one?.item?.product?.descriptor?.symbol};
            } else if (one?.item?.product?.descriptor?.images?.length > 0) {
              imageSource = {uri: one?.item?.product?.descriptor?.images[0]};
            }

            return (
              <View key={one._id} style={styles.cartItem}>
                <FastImage source={imageSource} style={styles.headerImage} />
                <Text
                  variant="labelMedium"
                  style={styles.description}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}>
                  {one?.item?.product?.descriptor?.name}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* bottomView */}
        <View style={styles.bottomView}>
          <Text variant="bodyLarge">
            {t('Cart.Total')}: ₹{formatNumber(Number(cartTotal.toFixed(2)))}
          </Text>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => goToViewCart(index)}>
            <Text variant="labelLarge" style={styles.buttonText}>
              {t('Cart.View Cart')}
            </Text>
            <Icon
              name={'keyboard-arrow-right'}
              size={24}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    mainItemView: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.neutral100,
      padding: 12,
    },
    itemHeader: {
      flexDirection: 'row',
    },
    cartItem: {
      width: 40,
    },
    headerImage: {
      height: 40,
      width: 40,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.neutral100,
    },
    headerText: {
      flex: 1,
      marginLeft: 16,
      justifyContent: 'space-between',
    },
    line: {height: 1, backgroundColor: colors.neutral100, marginVertical: 12},
    titleView: {
      flexDirection: 'row',
    },
    title: {
      flex: 1,
      color: colors.neutral400,
    },
    description: {
      color: colors.neutral300,
      paddingTop: 8,
    },
    itemCart: {
      color: colors.neutral400,
    },
    itemMainView: {
      flexDirection: 'row',
      paddingVertical: 8,
      gap: 8,
      overflow: 'hidden',
    },
    bottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8,
    },
    viewCartButton: {
      flexDirection: 'row',
      height: 32,
      borderRadius: 21,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 8,
    },
    buttonText: {
      color: colors.white,
    },
    providerLocalityView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    providerLocality: {
      color: colors.neutral300,
      flexShrink: 1,
    },
    closeButton: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.neutral300,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    distance: {
      color: colors.neutral300,
    },
    imageIcon: {marginRight: 5},
    dotView: {
      height: 3,
      width: 3,
      borderRadius: 3,
      backgroundColor: colors.neutral300,
      marginHorizontal: 5,
    },
  });

export default StoreCart;
