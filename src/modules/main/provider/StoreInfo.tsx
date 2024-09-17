import React, {useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../../utils/theme';
import SafeAreaPage from '../../../components/header/SafeAreaPage';
import Header from '../cart/components/Header';
import {Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getAddressString, getFulfilmentContact} from '../../../utils/utils';
import useMinutesToString from '../../../hooks/useMinutesToString';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';

interface StoreInfo {
  route: any;
}

const Mappls = require('../../../assets/maps/mappls.png');
const Google = require('../../../assets/maps/google_maps.png');

const StoreInfo: React.FC<StoreInfo> = ({route: {params}}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {convertMinutesToHumanReadable} = useMinutesToString();
  const refDirectionSheet = useRef<any>(null);

  console.log('provider : ', JSON.stringify(params?.provider));
  console.log('outlet : ', JSON.stringify(params?.outlet));

  const navigateToMappls = () => {
    const destinationAddress = getAddressString(params?.outlet?.address);
    Linking.openURL(
      `https://www.mappls.com/direction?places=${address.address.lat},${address.address.lng};${outlet?.gps},${destinationAddress}`,
    );
  };

  const navigateToMaps = () => {
    const destinationAddress = getAddressString(params?.outlet?.address);
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&origin=${address.address.lat},${address.address.lng}&destination=${outlet?.gps}&destination_place_id=${destinationAddress}`,
    );
  };

  const {timeToShip, imageSource, outletPhone}: any = useMemo(() => {
    let source = null;
    let time = {type: 'minutes', time: 0};
    let phone = '';

    if (params?.outlet) {
      if (params?.outlet?.provider_descriptor?.symbol) {
        source = {uri: params?.outlet?.provider_descriptor?.symbol};
      } else if (params?.outlet?.provider_descriptor?.images?.length > 0) {
        source = {uri: params?.outlet?.provider_descriptor?.images[0]};
      }
      if (params?.outlet?.minDaysWithTTS) {
        time = convertMinutesToHumanReadable(
          Number(params?.outlet?.minDaysWithTTS / 60),
        );
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
    return {timeToShip: time, imageSource: source, outletPhone: phone};
  }, [params?.outlet]);

  const getDirection = async () => {
    refDirectionSheet.current.open();
  };

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
              onPress={getDirection}>
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
        <View style={styles.imgaeView}>
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
      <RBSheet
        ref={refDirectionSheet}
        height={200}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <Text variant={'titleMedium'} style={styles.sheetTitle}>
          {t('Global.Open with')}
        </Text>
        <Divider />
        <View style={styles.mapsContainer}>
          <TouchableOpacity style={styles.mapRow} onPress={navigateToMappls}>
            <FastImage
              style={styles.mapImage}
              source={Mappls}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text variant={'bodyMedium'} style={styles.mapName}>
              {t('Stores Info.Mappls')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapRow} onPress={navigateToMaps}>
            <FastImage
              style={styles.mapImage}
              source={Google}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text variant={'bodyMedium'} style={styles.mapName}>
            {t('Stores Info.Maps')}
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
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
    imgaeView: {gap: 12},
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
    rbSheet: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: 16,
    },
    sheetTitle: {
      color: colors.neutral400,
      paddingVertical: 16,
    },
    mapsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    mapRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
      flex: 1,
    },
    mapImage: {
      width: 36,
      height: 36,
      marginRight: 4,
      borderRadius: 8,
    },
    mapName: {
      color: colors.neutral400,
    },
  });

export default StoreInfo;
