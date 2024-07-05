import React from 'react';
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

import BrandSkeleton from '../../../../components/skeleton/BrandSkeleton';
import {useAppTheme} from '../../../../utils/theme';

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

  if (apiRequested) {
    return <BrandSkeleton />;
  }

  return (
    <View>
      {!outlet?.isOpen && (
        <FastImage
          style={styles.brandImage}
          source={Closed}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View style={styles.brandDetails}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <View style={styles.providerLocalityView}>
              <Text variant={'headlineSmall'} style={styles.title}>
                {provider?.descriptor?.name}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={callProvider}
                  style={styles.actionButton}>
                    <Image source={Call}/>
                  </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={getDirection}>
                    <Image source={Direction}/>
                  </TouchableOpacity>
              </View>
            </View>
            <View style={styles.providerLocalityView}>
              <Image source={Location} style={styles.imageIcon} />
              <Text variant={'labelLarge'} style={styles.timing}>
                {outlet?.distance}
              </Text>
              <View style={styles.dotView} />
              {!!outlet?.address && (
                <Text variant={'labelLarge'} style={styles.address}>
                  {outlet?.address?.locality || 'NA'}
                </Text>
              )}
            </View>
            <View style={styles.providerLocalityView}>
              <Image source={Timer} style={styles.imageIcon} />
              <Text variant={'labelLarge'} style={styles.address}>
                {outlet?.minutes}
              </Text>
            </View>
          </View>
          <FastImage
            style={{height: 80, width: 80, borderRadius: 15}}
            source={Closed}
            resizeMode={FastImage.resizeMode.cover}
          />
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
      justifyContent:'center',
      borderColor: colors.primary,
      backgroundColor:'rgba(236, 243, 248, 1)',
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
  });

export default OutletDetails;
