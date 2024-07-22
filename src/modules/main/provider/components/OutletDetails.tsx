import React, {useMemo} from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {Grayscale} from 'react-native-color-matrix-image-filters';

import BrandSkeleton from '../../../../components/skeleton/BrandSkeleton';
import {useAppTheme} from '../../../../utils/theme';
import useMinutesToString from '../../../../hooks/useMinutesToString';
import useFormatNumber from '../../../../hooks/useFormatNumber';

interface OutletDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
}

const Closed = require('../../../../assets/closed.png');
const Location = require('../../../../assets/location.png');
const Timer = require('../../../../assets/timer.png');
const Call = require('../../../../assets/call.png');
const Direction = require('../../../../assets/direction.png');

const OutletDetails: React.FC<OutletDetails> = ({
  provider,
  outlet,
  apiRequested,
}) => {
  const {t} = useTranslation();
  const {formatNumber} = useFormatNumber();
  const {convertMinutesToHumanReadable, translateMinutesToHumanReadable} =
    useMinutesToString();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const getDirection = async () => {
    const url =
      Platform.OS === 'android'
        ? `geo:0,0?q=${outlet?.gps[0]}+${outlet?.gps[1]}`
        : `maps:0,0?q=${outlet?.gps[0]}+${outlet?.gps[1]}`;
    await Linking.openURL(url);
  };

  const callProvider = () => Linking.openURL('tel:+91 92729282982');

  const timeToShip = useMemo(() => {
    if (outlet) {
      let travelTime = (Number(outlet.distance) * 60) / 15;
      const medianTimeToShipMinutes = (outlet?.median_time_to_ship ?? 0) / 60;
      return convertMinutesToHumanReadable(
        Number(medianTimeToShipMinutes) + travelTime,
      );
    } else {
      return {type: 'minutes', time: 0};
    }
  }, [outlet]);

  if (apiRequested) {
    return <BrandSkeleton />;
  }

  return (
    <View>
      {!provider?.isOpen && (
        <FastImage
          style={styles.brandImage}
          source={Closed}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View style={styles.brandDetails}>
        <View style={styles.row}>
          <View style={styles.providerDetails}>
            <View style={styles.providerLocalityView}>
              <Text variant={'headlineSmall'} style={styles.title}>
                {provider?.descriptor?.name}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={callProvider}
                  style={styles.actionButton}>
                  <Image source={Call} />
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={getDirection}>
                  <Image source={Direction} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.providerLocalityView}>
              <Image source={Location} style={styles.imageIcon} />
              <Text variant={'labelLarge'} style={styles.timing}>
                {t('Store.km', {distance: formatNumber(outlet?.distance)})}
              </Text>
              <View style={styles.dotView} />
              {!!outlet?.address && (
                <Text
                  variant={'labelLarge'}
                  style={styles.address}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}>
                  {outlet?.address?.locality || 'NA'}
                </Text>
              )}
            </View>
            <View style={styles.providerLocalityView}>
              <Image source={Timer} style={styles.imageIcon} />
              <Text variant={'labelLarge'} style={styles.address}>
                {translateMinutesToHumanReadable(
                  timeToShip.type,
                  timeToShip.time,
                )}
              </Text>
              {!provider?.isOpen && (
                <>
                  <View style={styles.dotView} />
                  <Text variant={'labelLarge'} style={styles.address}>
                    {t('Store.Opens at', {time: provider?.time_from})}
                  </Text>
                </>
              )}
            </View>
          </View>
          {!provider?.isOpen ? (
            <Grayscale>
              <FastImage
                style={styles.headerImage}
                source={{uri: outlet?.provider_descriptor.symbol}}
                resizeMode={FastImage.resizeMode.cover}
              />
            </Grayscale>
          ) : (
            <FastImage
              style={styles.headerImage}
              source={{uri: outlet?.provider_descriptor.symbol}}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        </View>
        <View style={styles.borderBottom} />
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    brandImage: {
      height: 268,
      backgroundColor: colors.black,
    },
    brandDetails: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    borderBottom: {
      backgroundColor: colors.neutral100,
      height: 1,
      marginTop: 24,
    },
    title: {
      flex: 1,
      color: colors.neutral400,
    },
    address: {
      color: colors.neutral300,
      flex: 1,
    },
    open: {
      color: colors.success600,
    },
    timing: {
      color: colors.neutral300,
    },
    providerLocalityView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    imageIcon: {marginRight: 5},
    dotView: {
      height: 4,
      width: 4,
      borderRadius: 4,
      backgroundColor: colors.neutral300,
      marginHorizontal: 5,
    },
    headerImage: {height: 80, width: 80, borderRadius: 15},
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 35,
    },
    separator: {
      width: 8,
    },
    actionButton: {
      height: 28,
      width: 28,
      borderRadius: 28,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colors.primary,
      backgroundColor: 'rgba(236, 243, 248, 1)',
    },
    getDirection: {
      borderColor: colors.error400,
    },
    buttonText: {
      color: colors.primary,
    },
    getDirectionText: {
      color: colors.error400,
    },
    row: {flexDirection: 'row'},
    providerDetails: {flex: 1},
  });

export default OutletDetails;
