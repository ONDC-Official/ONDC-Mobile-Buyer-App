import React from 'react';
import {
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

const NoImageAvailable = require('../../../../assets/noImage.png');

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
      <FastImage
        style={styles.brandImage}
        source={
          provider?.descriptor?.symbol
            ? {uri: provider?.descriptor?.symbol}
            : NoImageAvailable
        }
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.brandDetails}>
        <Text variant={'headlineSmall'} style={styles.title}>
          {provider?.descriptor?.name}
        </Text>
        {!!outlet?.address && (
          <Text variant={'bodyLarge'} style={styles.address}>
            {outlet?.address?.street || '-'}, {outlet?.address?.city || '-'}
          </Text>
        )}
        <Text variant={'bodyMedium'} style={styles.timing}>
          {outlet?.isOpen && (
            <>
              <Text variant={'bodyLarge'} style={styles.open}>
                {t('Cart.Outlet Details.Open now')}
              </Text>
              &nbsp;-&nbsp;
            </>
          )}
          {outlet?.timings}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={getDirection}
            style={[styles.actionButton, styles.getDirection]}>
            <Text variant={'bodyMedium'} style={styles.getDirectionText}>
              {t('Cart.Outlet Details.Get Direction')}
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.actionButton} onPress={callProvider}>
            <Text variant={'bodyMedium'} style={styles.buttonText}>
              {t('Cart.Outlet Details.Call Now')}
            </Text>
          </TouchableOpacity>
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
      marginBottom: 12,
      color: colors.neutral400,
    },
    address: {
      color: colors.neutral300,
      marginBottom: 12,
    },
    open: {
      color: colors.success600,
    },
    timing: {
      color: colors.neutral300,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 28,
    },
    separator: {
      width: 16,
    },
    actionButton: {
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderColor: colors.primary,
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
