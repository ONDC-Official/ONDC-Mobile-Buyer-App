import React, {useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector} from 'react-redux';

import BrandSkeleton from '../../../../components/skeleton/BrandSkeleton';
import {useAppTheme} from '../../../../utils/theme';
import useMinutesToString from '../../../../hooks/useMinutesToString';
import StoreIcon from '../../../../assets/no_store_icon.svg';
import {getFulfilmentContact} from '../../../../utils/utils';
import {useNavigation} from '@react-navigation/native';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';
import StarRating from 'react-native-star-rating-widget';

interface OutletDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
  locationData?: any;
}

const Closed = require('../../../../assets/closed.png');
const NoImageAvailable = require('../../../../assets/no_store.png');
const Mappls = require('../../../../assets/maps/mappls.png');
const Google = require('../../../../assets/maps/google_maps.png');

const getAddressString = (address: any) => {
  return [
    address?.name,
    address?.street,
    address?.locality,
    address?.city,
    address?.state && `${address?.state} - ${address?.area_code}`,
    address?.country,
  ]
    .filter(value => value) // Filters out null, undefined, or empty string values
    .join(', ');
};

const OutletImage = ({source, isOpen}: {source: any; isOpen: boolean}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [imageSource, setImageSource] = useState(source);
  const [imageLoadFailed, setImageLoadFailed] = useState<boolean>(false);

  const onError = () => {
    setImageLoadFailed(true);
    setImageSource(NoImageAvailable);
  };

  if (source) {
    if (isOpen) {
      return (
        <FastImage
          style={styles.headerImage}
          source={imageSource}
          resizeMode={
            imageLoadFailed
              ? FastImage.resizeMode.cover
              : FastImage.resizeMode.contain
          }
          onError={onError}
        />
      );
    } else {
      return (
        <Grayscale>
          <FastImage
            style={styles.headerImage}
            source={imageSource}
            resizeMode={
              imageLoadFailed
                ? FastImage.resizeMode.cover
                : FastImage.resizeMode.contain
            }
            onError={onError}
          />
        </Grayscale>
      );
    }
  } else {
    return (
      <View style={[styles.headerImage, styles.brandImageEmpty]}>
        <StoreIcon width={48} height={48} />
      </View>
    );
  }
};

const OutletDetails: React.FC<OutletDetails> = ({
  provider,
  outlet,
  apiRequested,
  locationData,
}) => {
  const {address} = useSelector((state: any) => state.address);
  const refDirectionSheet = useRef<any>(null);
  const refOutletsSheet = useRef<any>(null);
  const {t} = useTranslation();
  const {convertMinutesToHumanReadable, translateMinutesToHumanReadable} =
    useMinutesToString();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<any>();
  const [rating, setRating] = useState(3);

  const showOutletsSheet = () => refOutletsSheet.current.open();

  const hideOutletsSheet = () => refOutletsSheet.current.close();

  const getDirection = async () => {
    refDirectionSheet.current.open();
  };

  const {timeToShip, imageSource, outletPhone} = useMemo(() => {
    let source = null;
    let time = {type: 'minutes', time: 0};
    let phone = '';

    if (outlet) {
      if (outlet?.provider_descriptor?.symbol) {
        source = {uri: outlet?.provider_descriptor?.symbol};
      } else if (outlet?.provider_descriptor?.images?.length > 0) {
        source = {uri: outlet?.provider_descriptor?.images[0]};
      }
      if (outlet?.minDaysWithTTS) {
        time = convertMinutesToHumanReadable(
          Number(outlet?.minDaysWithTTS / 60),
        );
      }
      if (outlet?.fulfillment) {
        phone = getFulfilmentContact(outlet?.fulfillment, 'Delivery');
        if (!phone) {
          phone = getFulfilmentContact(outlet?.fulfillment, 'Self-Pickup');
          if (!phone) {
            phone = getFulfilmentContact(
              outlet?.fulfillment,
              'Delivery and Self-Pickup',
            );
          }
        }
      }
    }
    return {timeToShip: time, imageSource: source, outletPhone: phone};
  }, [outlet]);

  const navigateToMappls = () => {
    const destinationAddress = getAddressString(outlet?.address);
    Linking.openURL(
      `https://www.mappls.com/direction?places=${address.address.lat},${address.address.lng};${outlet?.gps},${destinationAddress}`,
    );
  };

  const navigateToMaps = () => {
    const destinationAddress = getAddressString(outlet?.address);
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&origin=${address.address.lat},${address.address.lng}&destination=${outlet?.gps}&destination_place_id=${destinationAddress}`,
    );
  };

  if (apiRequested) {
    return <BrandSkeleton />;
  }

  const moveOnStoreInfo = () => {
    navigation.navigate('StoreInfo', {provider, outlet});
  };

  const navigateToProvider = (item: any) => {
    const routeParams: any = {
      brandId: item?.provider,
      outletId: item?.id,
    };
    navigation.replace('BrandDetails', routeParams);
  };

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.outletItem}
        onPress={() => navigateToProvider(item)}>
        <View style={styles.outletTitleView}>
          <Text variant="bodyLarge">{item?.address?.locality}</Text>
          <View style={styles.ratingRow}>
            <StarRating
              rating={rating}
              onChange={setRating}
              enableSwiping={false}
              starSize={16}
              animationConfig={{scale: 1}}
              color={theme.colors.warning600}
              emptyColor={theme.colors.neutral200}
              enableHalfStar={true}
              starStyle={{marginLeft: 0, marginRight: 4}}
            />
            <Text variant="labelMedium" style={styles.ratingText}>
              {rating}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcon
          name={'chevron-right'}
          size={24}
          color={theme.colors.black}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View>
        {!outlet?.isOpen && (
          <FastImage
            style={styles.brandImage}
            source={Closed}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
        <View style={styles.brandDetails}>
          <View style={styles.providerDetails}>
            <View style={styles.providerLocalityView}>
              <View style={styles.titleView}>
                <Text
                  variant={'headlineSmall'}
                  style={styles.title}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}>
                  {provider?.descriptor?.name}
                </Text>
                <TouchableOpacity onPress={moveOnStoreInfo}>
                  <MaterialCommunityIcon
                    name={'information-outline'}
                    size={24}
                    color={theme.colors.neutral400}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                {outletPhone && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel: ${outletPhone}`)}
                    style={styles.actionButton}>
                    <Icon
                      name={'phone'}
                      color={theme.colors.primary}
                      size={18}
                    />
                  </TouchableOpacity>
                )}
                <View style={styles.separator} />
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={getDirection}>
                  <Icon
                    name={'directions'}
                    color={theme.colors.primary}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.providerLocalityView}>
              {!!outlet?.address && (
                <View style={styles.localityView}>
                  <Text
                    variant={'labelLarge'}
                    style={styles.address}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}>
                    {outlet?.address?.locality
                      ? `${outlet?.address?.locality},`
                      : ''}{' '}
                    {outlet?.address?.city}
                  </Text>
                  <TouchableOpacity onPress={showOutletsSheet}>
                    <MaterialCommunityIcon
                      name={'chevron-down'}
                      size={24}
                      color={theme.colors.neutral400}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.providerLocalityView}>
              <MaterialCommunityIcon
                name={'clock'}
                size={16}
                color={theme.colors.neutral200}
              />
              <Text variant={'labelLarge'} style={styles.address}>
                {translateMinutesToHumanReadable(
                  timeToShip.type,
                  timeToShip.time,
                )}
              </Text>
              {!outlet?.isOpen && (
                <>
                  <View style={styles.dotView} />
                  <Text variant={'labelLarge'} style={styles.address}>
                    {t('Store.Opens at', {time: outlet?.time_from})}
                  </Text>
                </>
              )}
            </View>
          </View>
          <OutletImage source={imageSource} isOpen={outlet?.isOpen} />
        </View>
        <View style={styles.borderBottom} />
      </View>
      <RBSheet
        ref={refOutletsSheet}
        height={480}
        customStyles={{
          container: styles.outletrbSheet,
        }}>
        <CloseSheetContainer closeSheet={hideOutletsSheet}>
          <View style={styles.outletContainer}>
            <View style={styles.headerOutlet}>
              <Text variant="headlineSmall">Outlets</Text>
            </View>
            <FlatList
              data={locationData}
              renderItem={renderItem}
              contentContainerStyle={styles.outletDetails}
            />
          </View>
        </CloseSheetContainer>
      </RBSheet>
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
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    brandImage: {
      height: 220,
      backgroundColor: colors.black,
    },
    brandDetails: {
      paddingHorizontal: 16,
      paddingTop: 20,
      flexDirection: 'row',
    },
    borderBottom: {
      backgroundColor: colors.neutral100,
      height: 1,
      marginVertical: 20,
    },
    titleView: {
      flex: 1,
      flexDirection: 'row',
      marginRight: 24,
      gap: 8,
      alignItems: 'center',
    },
    title: {
      color: colors.neutral400,
    },
    ratingText: {color: colors.warning600},
    localityView: {
      flex: 1,
      height: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    address: {
      color: colors.neutral300,
      marginLeft: 3,
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
      marginBottom: 6,
    },
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
    providerDetails: {flex: 1, paddingRight: 24},
    brandImageEmpty: {
      backgroundColor: colors.neutral200,
    },
    rbSheet: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: 16,
    },
    outletrbSheet: {
      backgroundColor: 'transparent',
    },
    outletContainer: {
      flex: 1,
      backgroundColor: colors.neutral50,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    headerOutlet: {
      height: 52,
      backgroundColor: colors.white,
      justifyContent: 'center',
      paddingHorizontal: 16,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    outletDetails: {
      flex: 1,
      padding: 16,
      gap: 12,
    },
    outletItem: {
      padding: 12,
      backgroundColor: colors.white,
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 12,
      borderColor: colors.neutral100,
      alignItems: 'center',
    },
    outletTitleView: {
      flex: 1,
      gap: 4,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
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

export default OutletDetails;
