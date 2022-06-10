import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, PermissionsAndroid, StyleSheet, View} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {colors, withTheme} from 'react-native-elements';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../../locales/i18n';
import {appStyles} from '../../../../styles/styles';
import {getData} from '../../../../utils/api';
import {BASE_URL, GET_LATLONG, GET_LOCATION_FROM_LAT_LONG,} from '../../../../utils/apiUtilities';
import {half, isIOS, skeletonList} from '../../../../utils/utils';
import useProductList from '../hook/useProductList';
import AddressPicker from './component/AddressPicker';
import EmptyComponent from './component/EmptyComponent';
import Header from './component/Header';
import ListFooter from './component/ListFooter';
import LocationDeniedAlert from './component/LocationDeniedAlert';
import ProductCard from './component/ProductCard';
import ProductCardSkeleton from './component/ProductCardSkeleton';

const permissionNeededMessage = strings(
  'main.product.permission_needed_message',
);
const unKnownLabel = strings('main.product.unknown');
const noResults = strings('main.product.no_results');
const searchItemMessage = strings('main.product.search_item_message');
const okLabel = strings('main.product.ok_label');
const cancelLabel = strings('main.product.cancel_label');

/**
 * Component to show list of requested products
 * @constructor
 * @returns {JSX.Element}
 */
const Products = ({navigation}) => {
  const [location, setLocation] = useState(unKnownLabel);
  const [isVisible, setIsVisible] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [eloc, setEloc] = useState(null);
  const [count, setCount] = useState(null);
  const [locationInProgress, setLocationInProgress] = useState(false);
  const [apiInProgress, setApiInProgress] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const {products} = useSelector(({productReducer}) => productReducer);
  const {getProductsList} = useProductList(setCount);
  const [pageNumber, setPageNumber] = useState(1);
  const [moreListRequested, setMoreListRequested] = useState(false);
  const {messageId, transactionId} = useSelector(
    ({filterReducer}) => filterReducer,
  );

  const {handleApiError} = useNetworkErrorHandling();
  const refRBSheet = useRef();

  const {search} = useProductList();

  const openSheet = () => refRBSheet.current.open();
  const closeSheet = () => refRBSheet.current.close();

  /**
   * Function is used to render single product card in the list
   * @param item:single object from products list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ProductCardSkeleton item={item}/>
    ) : (
      <ProductCard
        item={item}
        apiInProgress={apiInProgress}
        navigation={navigation}
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
        let isPermitted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (!isPermitted) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: permissionNeededMessage,
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
   * Function is used to get latitude and longitude
   * @returns {Promise<void>}
   **/
  const getPosition = async () => {
    try {
      const {data} = await getData(`${BASE_URL}${GET_LATLONG}${eloc}`);

      setLatitude(data.latitude);
      setLongitude(data.longitude);
    } catch (error) {
      setLocation(unKnownLabel);
      handleApiError(error);
    }
  };

  /**
   * Function is used to handle onEndEditing event of searchbar
   * @returns {Promise<void>}
   **/
  const onSearch = async (query, selectedSearchOption) => {
    setAppliedFilters(null);
    setPageNumber(1);
    setApiInProgress(true);
    search(
      setCount,
      query,
      latitude,
      longitude,
      selectedSearchOption,
      setApiInProgress,
      1,
    )
      .then(() => {
        setPageNumber(prev => prev + 1);
      })
      .catch(() => {});
  };

  const loadMoreList = () => {
    if (count && count > products.length && !apiInProgress) {
      setMoreListRequested(true);
      getProductsList(
        setCount,
        messageId,
        transactionId,
        pageNumber,
        appliedFilters,
      )
        .then(() => {
          setPageNumber(prev => prev + 1);
          setMoreListRequested(false);
        })
        .catch(() => {
          setMoreListRequested(false);
        });
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
    if (eloc) {
      getPosition()
        .then(() => {})
        .catch(() => {});
    }
  }, [eloc]);

  const listData = products === null ? skeletonList : products;

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
          setCount={setCount}
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
          setPageNumber={setPageNumber}
        />
        <RBSheet
          ref={refRBSheet}
          height={half}
          customStyles={{
            container: styles.container,
          }}>
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
        <FlatList
          data={listData}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return (
              <EmptyComponent
                message={!apiInProgress ? searchItemMessage : noResults}
              />
            );
          }}
          onEndReachedThreshold={0.2}
          onEndReached={loadMoreList}
          contentContainerStyle={
            listData.length > 0
              ? styles.contentContainerStyle
              : appStyles.container
          }
          ListFooterComponent={<ListFooter moreRequested={moreListRequested}/>}
        />
      </View>
    </SafeAreaView>
  );
};

export default withTheme(Products);

const styles = StyleSheet.create({
  contentContainerStyle: {paddingBottom: 10},
  container: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
});
