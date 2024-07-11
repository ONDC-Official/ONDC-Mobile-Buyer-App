import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../../utils/theme';
import FastImage from 'react-native-fast-image';
import {calculateDistanceBetweenPoints} from '../../../utils/utils';
import moment from 'moment';
import 'moment-duration-format';
import {useSelector} from 'react-redux';
import useMinutesToString from '../../../hooks/useMinutesToString';
import {Text} from 'react-native-paper';
import useFormatNumber from '../../../hooks/useFormatNumber';

const Close = require('../../../assets/dashboard/close.png');
const RightArrow = require('../../../assets/rightArrow.png');
const Location = require('../../../assets/location.png');
const Timer = require('../../../assets/timer.png');

interface StoreCart {
  item: any;
  index: number;
  deleteStore: (values: any) => void;
  goToViewCart: (values: any) => void;
}

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

  const [minutes, setMinutes] = useState({type: 'minutes', time: 0});
  const [distance, setDistance] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [locality, setLocality] = useState<string>('');

  const {convertMinutesToHumanReadable, translateMinutesToHumanReadable} =
    useMinutesToString();
  const {address} = useSelector((state: any) => state?.address);

  useEffect(() => {
    console.log(JSON.stringify(item?.items[0]?.item?.provider?.descriptor?.symbol))
    if (item) {
      let highMin = 0;
      let latLong: string = '';
      let itemsLocality = '';
      item?.items.forEach((item: any) => {
        console.log('item : ', item?.item?.product['@ondc/org/time_to_ship']);
        const duration = moment.duration(
          item?.item?.product['@ondc/org/time_to_ship'],
        );
        let durationInMinutes = duration.format('m').replace(/\,/g, '');
        if (highMin < durationInMinutes) {
          highMin = durationInMinutes;
          latLong = item.item.location_details?.gps.split(/\s*,\s*/);
          itemsLocality = item.item.location_details?.address?.locality;
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
          <View />
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
              <TouchableOpacity onPress={() => deleteStore(item?._id)}>
                <Image source={Close} />
              </TouchableOpacity>
            </View>
            <View style={styles.providerLocalityView}>
              <Text variant={'labelMedium'} style={styles.providerLocality}>
                {locality.length < 30
                  ? `${locality}`
                  : `${locality.substring(0, 20)}...`}
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
          Items in cart {item?.items.length}
        </Text>

        <ScrollView
          contentContainerStyle={styles.itemMainView}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {item?.items.map((item: any) => {
            return (
              <View style={{}}>
                <FastImage
                  source={{
                    uri: item?.item?.product?.descriptor?.images[0],
                  }}
                  style={styles.headerImage}
                />
                <Text variant="labelMedium" style={styles.description}>
                  {item?.item?.product?.descriptor?.name.length < 4
                    ? item?.item?.product?.descriptor?.name.length
                    : `${item?.item?.product?.descriptor?.name.substring(
                        0,
                        4,
                      )}...`}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* bottomView */}
        <View style={styles.bottomView}>
          <Text variant="bodyLarge">Total: ₹400.00</Text>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => goToViewCart(index)}>
            <Text variant="labelLarge" style={styles.buttonText}>
              View Cart
            </Text>
            <Image source={RightArrow} />
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
      width: 97,
      height: 32,
      borderRadius: 21,
      padding: 8,
      backgroundColor: colors.primary,
      justifyContent: 'space-between',
      alignItems: 'center',
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
