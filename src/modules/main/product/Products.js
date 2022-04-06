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
import Header from './Header';
import ProductCard from './ProductCard';
import RBSheet from 'react-native-raw-bottom-sheet';
import SetLocation from './SetLocation';
import {
  Dialog,
  Divider,
  Icon,
  SearchBar,
  withTheme,
} from 'react-native-elements';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Card from './Card';
import {strings} from '../../../locales/i18n';
import Config from 'react-native-config';

const product = strings('main.product.product_label');
const provider = strings('main.product.provider_label');
const category = strings('main.product.category_label');
const search = strings('main.product.search_label');

const list = [1, 2, 3, 4, 5, 8, 9, 0];

const Products = ({theme}) => {
  const {colors} = theme;
  const [location, setLocation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(provider);
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
      console.log(error.response);
    }
  };

  const requestPermission = async () => {
    try {
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
          Geolocation.getCurrentPosition(
            getLocation,
            error => {
              if (error.code === 2) {
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                  interval: 10000,
                  fastInterval: 5000,
                })
                  .then(data => {
                    Geolocation.getCurrentPosition(
                      getLocation,
                      err => console.log(err),
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
        } else {
          setIsVisible(!isVisible);
        }
      } else {
        Geolocation.getCurrentPosition(
          getLocation,
          error => {
            if (error.code === 2) {
              RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 10000,
                fastInterval: 5000,
              })
                .then(data => console.log(data))
                .catch(err => setLocation('Unknown'));
            } else {
              setLocation('Unknown');
            }
          },
          {enableHighAccuracy: true, timeout: 20000},
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCardSelect = item => setSelectedCard(item);

  useEffect(() => {
    if (location === null) {
      requestPermission()
        .then(() => {})
        .catch(() => {});
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header
        location={location}
        setLocation={setLocation}
        openSheet={openSheet}
      />
      <View style={styles.cardContainer}>
        <Card
          name={provider}
          onPress={() => {
            onCardSelect(provider);
          }}
          selectedCard={selectedCard}
        />
        <View style={styles.space} />
        <Card
          name={product}
          onPress={() => {
            onCardSelect(product);
          }}
          selectedCard={selectedCard}
        />
        <View style={styles.space} />
        <Card
          name={category}
          onPress={() => {
            onCardSelect(category);
          }}
          selectedCard={selectedCard}
        />
      </View>
      <SearchBar
        lightTheme={true}
        placeholder={`${search} ${selectedCard}`}
        containerStyle={styles.containerStyle}
      />
      <RBSheet ref={refRBSheet} height={Dimensions.get('window').height / 2}>
        <SetLocation
          closeSheet={closeSheet}
          location={location}
          setLocation={setLocation}
        />
      </RBSheet>
      <Dialog isVisible={isVisible}>
        <Icon
          name="location-off"
          type="material"
          size={30}
          color={colors.primary}
        />
        <Dialog.Title title="Location permission not enabled" />
        <Dialog.Button
          title="Enter location manually"
          onPress={() => {
            setIsVisible(!isVisible);
            openSheet();
          }}
        />
        <Divider />
      </Dialog>
      <FlatList data={list} renderItem={renderItem} />
    </View>
  );
};

export default withTheme(Products);

const styles = StyleSheet.create({
  container: {padding: 10},
  cardContainer: {flexDirection: 'row', marginBottom: 10},
  space: {marginHorizontal: 5},
  containerStyle: {padding: 0},
});
