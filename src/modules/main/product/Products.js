import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  PermissionsAndroid,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import {getData, postData} from '../../../utils/api';
import Geolocation from '@react-native-community/geolocation';
import ProductCard from './ProductCard';
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
import {appStyles} from '../../../styles/styles';
import {CartContext} from '../../../context/Cart';
import {Context as AuthContext} from '../../../context/Auth';
import EmptyComponent from '../cart/EmptyComponent';
import {
  BASE_URL,
  GET_MESSAGE_ID,
  GET_PRODUCTS,
} from '../../../utils/apiUtilities';

const product = strings('main.product.product_label');
const provider = strings('main.product.provider_label');
const category = strings('main.product.category_label');

const Products = ({theme}) => {
  const [location, setLocation] = useState('Unknown');
  const [isVisible, setIsVisible] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [apiInProgress, setApiInProgress] = useState(false);

  const {storeItemInCart, storeList, list, removeItemFromCart} =
    useContext(CartContext);
  const {
    state: {token},
  } = useContext(AuthContext);

  const refRBSheet = useRef();

  const openSheet = () => refRBSheet.current.open();
  const closeSheet = () => refRBSheet.current.close();

  const addItem = addedItem => {
    const newArray = list.slice();
    let selectedItem = newArray.find(item => item.id === addedItem.id);
    selectedItem.quantity = selectedItem.quantity + 1;
    storeItemInCart(addedItem);
    storeList(newArray);
  };

  const removeItem = id => {
    const newArray = list.slice();
    let selectedItem = newArray.find(item => {
      return item.id === id;
    });
    selectedItem.quantity = selectedItem.quantity - 1;
    removeItemFromCart();
    storeList(newArray);
  };

  const renderItem = ({item}) => {
    return (
      <ProductCard
        item={item}
        list={list}
        addItem={addItem}
        removeItem={removeItem}
      />
    );
  };

  const getLocation = async response => {
    try {
      const {data} = await getData(
        `${Config.GET_ADDRESS}lng=${response.coords.longitude}&lat=${response.coords.latitude}`,
      );
      setLatitude(response.coords.latitude);
      setLongitude(response.coords.longitude);
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

  const getProducts = id => {
    let getList = setInterval(async () => {
      try {
        const {data} = await getData(`${BASE_URL}${GET_PRODUCTS}${id}`);
        let items = [];
        data.message.catalogs.forEach(catalog => {
          if (catalog.bpp_id) {
            if (catalog.bpp_providers && catalog.bpp_providers.length > 0) {
              catalog.bpp_providers.forEach(item => {
                item.items.forEach(element => {
                  element.quantity = 0;
                  element.provider = item.descriptor.name;
                  items.push(element);
                });
              });
            }
          }
        });

        storeList(items);
        setApiInProgress(false);
      } catch (error) {
        console.log(error);
        setApiInProgress(false);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
    }, 10000);
  };

  const onSearch = async (searchQuery, selectedCard) => {
    if (longitude !== null && latitude !== null) {
      console.log(latitude, longitude);
      setApiInProgress(true);
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        if (selectedCard === product) {
          const response = await postData(`${BASE_URL}${GET_MESSAGE_ID}`, {
            context: {},
            message: {
              criteria: {
                delivery_location: '12.9063433,77.5856825',
                search_string: searchQuery,
              },
            },
            options,
          });
          getProducts(response.data.context.message_id);
        } else if (selectedCard === provider) {
          const {data} = await postData(
            `${BASE_URL}${GET_MESSAGE_ID}`,
            {
              context: {},
              message: {
                criteria: {
                  delivery_location: `${latitude},${longitude}`,
                  provider_id: searchQuery,
                },
              },
            },
            options,
          );
          getProducts(data.context.message_id);
        } else {
          const {data} = await postData(
            `${BASE_URL}${GET_MESSAGE_ID}`,
            {
              context: {},
              message: {
                criteria: {
                  delivery_location: `${latitude},${longitude}`,
                  category_id: searchQuery,
                },
              },
            },
            options,
          );
          getProducts(data.context.message_id);
        }
      } catch (error) {
        console.log(error);
        setApiInProgress(false);
      }
    } else {
      alert('Please select location');
    }
  };

  useEffect(() => {
    if (location === 'Unknown') {
      requestPermission()
        .then(() => {})
        .catch(() => {});
    }
  }, [list]);

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.white}]}>
      <View
        style={[
          appStyles.container,
          {backgroundColor: colors.backgroundColor},
        ]}>
        <Header
          location={location}
          setLocation={setLocation}
          openSheet={openSheet}
          onSearch={onSearch}
          apiInProgress={apiInProgress}
        />
        <RBSheet ref={refRBSheet} height={Dimensions.get('window').height / 2}>
          <AddressPicker
            closeSheet={closeSheet}
            location={location}
            setLocation={setLocation}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />
        </RBSheet>
        <LocationDeniedAlert
          openSheet={openSheet}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
        {list === null ? (
          <EmptyComponent message={'Please search an item'} />
        ) : (
          <FlatList
            data={list}
            renderItem={renderItem}
            ListEmptyComponent={() => {
              return <EmptyComponent message={'No results'} />;
            }}
            contentContainerStyle={
              list.length > 0
                ? styles.contentContainerStyle
                : appStyles.container
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default withTheme(Products);

const styles = StyleSheet.create({
  contentContainerStyle: {paddingBottom: 10},
});
