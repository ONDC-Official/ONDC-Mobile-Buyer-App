import React, {useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import BrandSkeleton from '../../../../components/skeleton/BrandSkeleton';
import {useAppTheme} from '../../../../utils/theme';
import useMinutesToString from '../../../../hooks/useMinutesToString';
import StoreIcon from '../../../../assets/no_store_icon.svg';
import CloseSheetContainer from '../../../../components/bottomSheet/CloseSheetContainer';

interface OutletDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
}

const Closed = require('../../../../assets/closed.png');
const NoImageAvailable = require('../../../../assets/no_store.png');

const OutletImage = ({source, isOpen}: {source: any; isOpen: boolean}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [imageSource, setImageSource] = useState(source);

  const onError = () => {
    setImageSource(NoImageAvailable);
  };

  if (source) {
    if (isOpen) {
      return (
        <FastImage
          style={styles.headerImage}
          source={imageSource}
          resizeMode={FastImage.resizeMode.cover}
          onError={onError}
        />
      );
    } else {
      return (
        <Grayscale>
          <FastImage
            style={styles.headerImage}
            source={imageSource}
            resizeMode={FastImage.resizeMode.cover}
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
}) => {
  const refOutletsSheet = useRef<any>(null);
  const {t} = useTranslation();
  const {convertMinutesToHumanReadable, translateMinutesToHumanReadable} =
    useMinutesToString();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<any>();

  const showOutletsSheet = () => refOutletsSheet.current.open();

  const hideOutletsSheet = () => refOutletsSheet.current.close();

  const {timeToShip, imageSource} = useMemo(() => {
    let source = null;
    let time = {type: 'minutes', time: 0};

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
    }
    return {timeToShip: time, imageSource: source};
  }, [outlet]);

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
        </View>
        <MaterialCommunityIcon
          name={'chevron-right'}
          size={24}
          color={theme.colors.black}
        />
      </TouchableOpacity>
    );
  };

  if (apiRequested) {
    return <BrandSkeleton />;
  }

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
                  {outlet?.locations?.length > 1 && (
                    <TouchableOpacity onPress={showOutletsSheet}>
                      <MaterialCommunityIcon
                        name={'chevron-down'}
                        size={24}
                        color={theme.colors.neutral400}
                      />
                    </TouchableOpacity>
                  )}
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
          container: styles.outletSheet,
        }}>
        <CloseSheetContainer closeSheet={hideOutletsSheet}>
          <View style={styles.outletContainer}>
            <View style={styles.headerOutlet}>
              <Text variant="headlineSmall">{t('StoreOutlets')}</Text>
            </View>
            <FlatList
              data={outlet?.locations}
              renderItem={renderItem}
              contentContainerStyle={styles.outletDetails}
            />
          </View>
        </CloseSheetContainer>
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
      gap: 24,
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
    providerLocalityView: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dotView: {
      height: 4,
      width: 4,
      borderRadius: 4,
      backgroundColor: colors.neutral300,
      marginHorizontal: 5,
    },
    headerImage: {height: 80, width: 80, borderRadius: 15},
    providerDetails: {flex: 1, gap: 8},
    brandImageEmpty: {
      backgroundColor: colors.neutral200,
    },
    outletSheet: {
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
  });

export default OutletDetails;
