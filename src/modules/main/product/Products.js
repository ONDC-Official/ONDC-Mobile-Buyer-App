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
  GET_LOCATION_FROM_LAT_LONG,
  GET_MESSAGE_ID,
  GET_PRODUCTS,
} from '../../../utils/apiUtilities';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import ProductCardSkeleton from './ProductCardSkeleton';
import {SEARCH_QUERY} from '../../../utils/Constants';
import {strings} from '../../../locales/i18n';

const permissionNeededdMessage = strings(
  'main.product.permission_needed_message',
);
const unKnownLabel = strings('main.product.unknown');
const noResults = strings('main.product.no_results');
const searchItemMessage = strings('main.product.search_item_message');
const okLabel = strings('main.product.ok_label');
const cancelLabel = strings('main.product.cancel_label');
const selectLocation = strings('main.product.please_select_location');

/**
 * Component to show list of requested products
 * @constructor
 * @returns {JSX.Element}
 */
const Products = ({theme}) => {
  const [location, setLocation] = useState(unKnownLabel);
  const [isVisible, setIsVisible] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [eloc, setEloc] = useState(null);
  const [apiInProgress, setApiInProgress] = useState(false);
  const [locationInProgress, setLocationInProgress] = useState(false);

  const {storeItemInCart, cart, storeList, list, removeItemFromCart} =
    useContext(CartContext);
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();

  const refRBSheet = useRef();

  const openSheet = () => refRBSheet.current.open();
  const closeSheet = () => refRBSheet.current.close();

  /**
   * function  use to add item in cart
   */
  const addItem = addedItem => {
    const newArray = list.slice();
    let selectedItem = newArray.find(item => item.id === addedItem.id);
    selectedItem.quantity = selectedItem.quantity + 1;
    storeItemInCart(selectedItem);
    storeList(newArray);
  };

  /**
   * function  use to remove item from cart
   */
  const removeItem = cartItem => {
    const newArray = list.slice();
    let selectedItem = newArray.find(item => {
      return item.id === cartItem.id;
    });
    selectedItem.quantity = selectedItem.quantity - 1;
    removeItemFromCart(selectedItem);
    storeList(newArray);
  };

  /**
   * Function is used to render single product card in the list
   * @param item:single object from products list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ProductCardSkeleton item={item} />
    ) : (
      <ProductCard
        item={item}
        list={list}
        addItem={addItem}
        removeItem={removeItem}
        apiInProgress={apiInProgress}
      />
    );
  };

  /**
   * Function is used to get location of user
   * @param response:response get from getcurrent position which contains lattitude and longitude
   * @returns {Promise<void>}
   **/
  const getLocation = async response => {
    try {
      const {data} = await getData(
        `${BASE_URL}${GET_LOCATION_FROM_LAT_LONG}lat=${response.coords.latitude}&long=${response.coords.longitude}`,
      );

      setLatitude(response.coords.latitude);
      setLongitude(response.coords.longitude);
      setLocation(
        `${data.results[0].city} ${data.results[0].state} ${data.results[0].area}`,
      );
      setLocationInProgress(false);
    } catch (error) {
      setLocation(unKnownLabel);
      setLatitude(null);
      setLongitude(null);
      setLocationInProgress(false);
    }
  };

  /**
   * Function is used to get latitude and longitude of user current location

   **/
  const getLatLong = () => {
    setLocationInProgress(true);
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

                err => {
                  setLocation(unKnownLabel);
                  setLocationInProgress(false);
                },
                {timeout: 20000},
              );
            })

            .catch(res => {
              setLocation(unKnownLabel);
              setLocationInProgress(false);
            });
        } else {
          setLocation(unKnownLabel);
          setLocationInProgress(false);
        }
      },
      {enableHighAccuracy: true, timeout: 20000},
    );
  };

  /**
   * Function is used get permission for location
   * @returns {Promise<void>}
   **/
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
            setLocation(unKnownLabel);
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
              title: permissionNeededdMessage,
              buttonNegative: cancelLabel,
              buttonPositive: okLabel,
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

  /**
   * Function used to get list of requested products
   * @returns {Promise<void>}
   **/
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
                  const index = cart.findIndex(
                    cartItem => cartItem.id === element.id,
                  );
                  element.quantity = index > -1 ? cart[index].quantity : 0;
                  element.provider_id = item.id;
                  element.locations = item.locations;
                  element.provider = item.descriptor.name;
                  element.bpp_id = catalog.bpp_id;
                  element.transaction_id = data.context.transaction_id;

                  items.push(element);
                });
              });
            }
          }
        });

        storeList(items);
      } catch (error) {
        handleApiError(error);
        setApiInProgress(false);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
      setApiInProgress(false);
    }, 10000);
  };

  /**
   * Function is used to get latitude and longitude
   * @returns {Promise<void>}
   **/
  const getPosition = async () => {
    try {
      const {data} = await getData(`${BASE_URL}${GET_LATLONG}${eloc}`);

      setLatitude(data.latitude);
      setLongitude(data.longitude);
    } catch (error) {
      handleApiError(error);
    }
  };

  /**
   * Function is used to handle onEndEditing event of searchbar
   * @returns {Promise<void>}
   **/
  const onSearch = async (searchQuery, selectedCard) => {
    if (longitude && latitude) {
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
      alert(selectLocation);
    }
  };

  useEffect(() => {
    if (location === unKnownLabel) {
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
          locationInProgress={locationInProgress}
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
          <EmptyComponent message={searchItemMessage} />
        ) : (
          <FlatList
            data={listData}
            renderItem={renderItem}
            ListEmptyComponent={() => {
              return <EmptyComponent message={noResults} />;
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
