import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  PermissionsAndroid,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import {getData} from '../../../utils/api';
import Geolocation from '@react-native-community/geolocation';
import ProductCard from './ProductListCard';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors, withTheme} from 'react-native-elements';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {strings} from '../../../locales/i18n';
import Config from 'react-native-config';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {isIOS} from '../../../utils/utils';
import AddressPicker from './AddressPicker';
import Header from './Header';
import LocationDeniedAlert from './LocationDeniedAlert';

const list = [1, 2, 3, 4, 5, 8, 9, 0];

const Products = ({theme}) => {
  const [location, setLocation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const refRBSheet = useRef();

  const openSheet = () => refRBSheet.current.open();
  const closeSheet = () => refRBSheet.current.close();

  const renderItem = () => {
    return <ProductCard />;
  };

  const getLocation = async response => {
    try {
      const {data} = await getData(
        `${Config.GET_ADDRESS}lng=${response.coords.longitude}&lat=${response.coords.latitude}`,
      );

      setLocation(
        `${data.results[0].city} ${data.results[0].state} ${data.results[0].area}`,
      );
    } catch (error) {
      console.log(error);
      setLocation('Unknown');
    }
  };

  const getLatLong = () => {
    Geolocation.getCurrentPosition(
      res => {
        getLocation(res)
          .then(() => {})
          .catch(() => {});
      },
      error => {
        if (error.code === 2) {
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
          })
            .then(() => {
              Geolocation.getCurrentPosition(
                res => {
                  getLocation(res)
                    .then(() => {})
                    .catch(() => {});
                },
                err => setLocation('Unknown'),
                {timeout: 20000},
              );
            })
            .catch(res => setLocation('Unknown'));
        } else {
          setLocation('Unknown');
        }
      },
      {enableHighAccuracy: true, timeout: 20000},
    );
  };

  const requestPermission = async () => {
    try {
      if (isIOS) {
        const result = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if (result === RESULTS.GRANTED) {
          getLatLong();
        } else {
          const granted = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
          if (granted === RESULTS.GRANTED) {
            getLatLong();
          } else {
            setLocation('Unknown');
            setIsVisible(!isVisible);
          }
        }
      } else {
        let isPermited = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (!isPermited) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Storage permission needed',
              buttonNegative: 'cancel',
              buttonPositive: 'ok',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getLatLong();
          } else {
            setIsVisible(!isVisible);
          }
        } else {
          getLatLong();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSearch = (item, selectedCard) => {
    console.log(item, selectedCard);
  };

  useEffect(() => {
    if (location === null) {
      requestPermission()
        .then(() => {})
        .catch(() => {});
    }
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: colors.white}}>
      <View style={[styles.container, {backgroundColor: colors.white}]}>
        <Header
          location={location}
          setLocation={setLocation}
          openSheet={openSheet}
          onSearch={onSearch}
        />
        <RBSheet ref={refRBSheet} height={Dimensions.get('window').height / 2}>
          <AddressPicker
            closeSheet={closeSheet}
            location={location}
            setLocation={setLocation}
          />
        </RBSheet>
        <LocationDeniedAlert
          openSheet={openSheet}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
        <FlatList data={list} renderItem={renderItem} />
      </View>
    </SafeAreaView>
  );
};

export default withTheme(Products);

const styles = StyleSheet.create({
  cardContainer: {flexDirection: 'row', marginBottom: 10},
  space: {marginHorizontal: 5},
  containerStyle: {padding: 0},
});
