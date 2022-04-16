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
import Config from 'react-native-config';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {isIOS, skeletonList} from '../../../utils/utils';
import AddressPicker from './AddressPicker';
import Header from './Header';
import LocationDeniedAlert from './LocationDeniedAlert';
import {appStyles} from '../../../styles/styles';
import {CartContext} from '../../../context/Cart';
import {Context as AuthContext} from '../../../context/Auth';
import EmptyComponent from '../cart/EmptyComponent';
import {
  BASE_URL,
  GET_LATLONG,
  GET_MESSAGE_ID,
  GET_PRODUCTS,
} from '../../../utils/apiUtilities';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import ProductCardSkeleton from './ProductCardSkeleton';
import {SEARCH_QUERY} from '../../../utils/Constants';

const Products = ({theme}) => {
  const [location, setLocation] = useState('Unknown');
  const [isVisible, setIsVisible] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [eloc, setEloc] = useState(null);
  const [apiInProgress, setApiInProgress] = useState(false);

  const {storeItemInCart, storeList, list, removeItemFromCart} =
    useContext(CartContext);
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();

  const refRBSheet = useRef();

  const openSheet = () => refRBSheet.current.open();
  const closeSheet = () => refRBSheet.current.close();

  const addItem = addedItem => {
    const newArray = list.slice();
    let selectedItem = newArray.find(item => item.id === addedItem.id);
    selectedItem.quantity = selectedItem.quantity + 1;
    console.log(selectedItem);
    storeItemInCart(selectedItem);
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
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ProductCardSkeleton item={item} />
    ) : (
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
        handleApiError(error);
        setApiInProgress(false);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
    }, 10000);
  };

  const getPosition = async () => {
    try {
      const {data} = await getData(`${BASE_URL}${GET_LATLONG}${eloc}`);

      setLatitude(data.latitude);
      setLongitude(data.longitude);
    } catch (error) {
      handleApiError(error);
    }
  };

  const onSearch = async (searchQuery, selectedCard) => {
    if (longitude !== null && latitude !== null) {
      setApiInProgress(true);
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let requestParameters;
      try {
        if (selectedCard === SEARCH_QUERY.PRODUCT) {
          requestParameters = {
            context: {},
            message: {
              criteria: {
                delivery_location: `${latitude},${longitude}`,
                search_string: searchQuery,
              },
            },
          };
        } else if (selectedCard === SEARCH_QUERY.PROVIDER) {
          requestParameters = {
            context: {},
            message: {
              criteria: {
                delivery_location: `${latitude},${longitude}`,
                provider_id: searchQuery,
              },
            },
          };
        } else {
          requestParameters = {
            context: {},
            message: {
              criteria: {
                delivery_location: `${latitude},${longitude}`,
                category_id: searchQuery,
              },
            },
          };
        }
        const response = await postData(
          `${BASE_URL}${GET_MESSAGE_ID}`,
          requestParameters,
          options,
        );
        getProducts(response.data.context.message_id);
      } catch (error) {
        handleApiError(error);
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
  }, []);

  useEffect(() => {
    getPosition()
      .then(() => {})
      .catch(() => {});
  }, [eloc]);

  const listData = list === null ? skeletonList : list;

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
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
            setEloc={setEloc}
          />
        </RBSheet>
        <LocationDeniedAlert
          openSheet={openSheet}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
        {list === null && !apiInProgress ? (
          <EmptyComponent message={'Please search an item'} />
        ) : (
          <FlatList
            data={listData}
            renderItem={renderItem}
            ListEmptyComponent={() => {
              return <EmptyComponent message={'No results'} />;
            }}
            contentContainerStyle={
              listData.length > 0
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
