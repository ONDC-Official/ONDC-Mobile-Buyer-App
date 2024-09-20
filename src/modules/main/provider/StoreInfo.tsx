import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';

import {useAppTheme} from '../../../utils/theme';
import SafeAreaPage from '../../../components/page/SafeAreaPage';
import Header from '../cart/provider/components/Header';
import {getAddressString, getFulfilmentContact} from '../../../utils/utils';

interface StoreInfo {
  route: any;
}

const StoreInfo: React.FC<StoreInfo> = ({route: {params}}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector((state: any) => state.address);

  const navigateToMappls = useCallback(() => {
    const destinationAddress = getAddressString(params?.outlet?.address);
    Linking.openURL(
      `https://www.mappls.com/direction?places=${address.address.lat},${address.address.lng};${params?.outlet?.gps},${destinationAddress}`,
    );
  }, [params]);

  const {imageSource, outletPhone}: any = useMemo(() => {
    let source = null;
    let phone = '';

    if (params?.outlet) {
      if (params?.outlet?.provider_descriptor?.symbol) {
        source = {uri: params?.outlet?.provider_descriptor?.symbol};
      } else if (params?.outlet?.provider_descriptor?.images?.length > 0) {
        source = {uri: params?.outlet?.provider_descriptor?.images[0]};
      }
      if (params?.outlet?.fulfillment) {
        phone = getFulfilmentContact(params?.outlet?.fulfillment, 'Delivery');
        if (!phone) {
          phone = getFulfilmentContact(
            params?.outlet?.fulfillment,
            'Self-Pickup',
          );
          if (!phone) {
            phone = getFulfilmentContact(
              params?.outlet?.fulfillment,
              'Delivery and Self-Pickup',
            );
          }
        }
      }
    }
    return {imageSource: source, outletPhone: phone};
  }, [params?.outlet]);

  return (
    <SafeAreaPage>
      <Header />
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.textView}>
            <Text variant="headlineSmall" style={styles.colorNeutral400}>
              {params?.provider?.descriptor?.name}
            </Text>
            <Text variant="labelLarge" style={styles.colorNeutral300}>
              {params?.outlet?.address?.locality
                ? `${params?.outlet?.address?.locality},`
                : ''}{' '}
              {params?.outlet?.address?.city}
            </Text>
            <Text variant="labelMedium" style={styles.colorNeutral300}>
              {params?.outlet?.time_from} To {params?.outlet?.time_to}
            </Text>
          </View>
          <View style={styles.icons}>
            {outletPhone && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel: ${outletPhone}`)}
                style={styles.actionButton}>
                <Icon name={'phone'} color={theme.colors.primary} size={20} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToMappls}>
              <Icon
                name={'directions'}
                color={theme.colors.primary}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line} />
        {/* Imgae View */}
        <View style={styles.imageView}>
          <Text variant="titleLarge" style={styles.colorNeutral400}>
            Photo
          </Text>
          <FastImage source={imageSource} style={styles.image} />
        </View>
        <View style={styles.line} />
        {/* Details View */}
        <View style={styles.detailView}>
          <View style={styles.rowView}>
            <Text variant="bodyLarge" style={styles.colorNeutral300}>
              {t('Stores Info.Legal Name')}
            </Text>
            <Text variant="labelSmall" style={[styles.colorNeutral300]}>
              --
            </Text>
          </View>
          <View style={styles.rowView}>
            <Text variant="bodyLarge" style={styles.colorNeutral300}>
              {t('Stores Info.Seller Network Partner')}
            </Text>
            <Text variant="labelSmall" style={styles.colorNeutral300}>
              --
            </Text>
          </View>
          <View style={styles.rowView}>
            <Text variant="bodyLarge" style={styles.colorNeutral300}>
              {t('Stores Info.GST Number')}
            </Text>
            <Text variant="labelSmall" style={styles.colorNeutral300}>
              --
            </Text>
          </View>
          <View style={styles.rowView}>
            <Text variant="bodyLarge" style={styles.colorNeutral300}>
              {t('Stores Info.FSSAI Lic No')}
            </Text>
            <Text variant="labelSmall" style={styles.colorNeutral300}>
              --
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaPage>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 24,
    },
    textView: {
      gap: 8,
    },
    colorNeutral400: {
      color: colors.neutral400,
    },
    colorNeutral300: {
      color: colors.neutral300,
    },
    topHeader: {gap: 16},
    icons: {flexDirection: 'row', gap: 12},
    imageView: {gap: 12},
    image: {height: 120, width: 120, borderRadius: 16},
    detailView: {
      gap: 16,
    },
    rowView: {gap: 4},
    line: {height: 1, backgroundColor: colors.neutral100},
    actionButton: {
      height: 30,
      width: 30,
      borderRadius: 28,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colors.primary,
      backgroundColor: 'rgba(236, 243, 248, 1)',
    },
  });

export default StoreInfo;
