import Geolocation from '@react-native-community/geolocation';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  PermissionsAndroid,
  StyleSheet,
  View,
} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {colors, withTheme} from 'react-native-elements';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../../locales/i18n';
import {saveProducts} from '../../../../redux/product/actions';
import {appStyles} from '../../../../styles/styles';
import {getData, postData} from '../../../../utils/api';
import {
  BASE_URL,
  FILTER,
  GET_LATLONG,
  GET_LOCATION_FROM_LAT_LONG,
  GET_MESSAGE_ID,
  GET_PRODUCTS,
} from '../../../../utils/apiUtilities';
import {SEARCH_QUERY} from '../../../../utils/Constants';
import {isIOS, skeletonList} from '../../../../utils/utils';
import EmptyComponent from '../../cart/EmptyComponent';
import AddressPicker from './component/AddressPicker';
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
const selectLocation = strings('main.product.please_select_location');

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
  const [locationInProgress, setLocationInProgress] = useState(false);
  const [filters, setFilters] = useState(null);

  const [requestInProgress, setRequestInProgress] = useState(false);
  const [count, setCount] = useState(null);
  const [moreListRequested, setMoreListRequested] = useState(false);

  const {products} = useSelector(({productReducer}) => productReducer);
  const dispatch = useDispatch();

  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();

  const refRBSheet = useRef();
  const refPageNumber = useRef();
  const refmessageId = useRef();
  const refTransactionId = useRef();

  const openSheet = () => refRBSheet.current.open();
  const closeSheet = () => refRBSheet.current.close();

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
        apiInProgress={requestInProgress}
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

  const getProducts = setApiInProgress => {
    let getList = setInterval(async () => {
      try {
        setApiInProgress(true);

        const url = `${BASE_URL}${GET_PRODUCTS}${refmessageId.current}`;
        const {data} = await getData(`${url}`, options);
        setCount(data.message.count);

        const productsList = data.message.catalogs.map(item => {
          return Object.assign({}, item, {
            quantity: 0,
            transaction_id: refTransactionId.current,
          });
        });

        dispatch(saveProducts(productsList));
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
      setApiInProgress(false);
    }, 10000);
  };

  /**
   * Function used to get list of requested products
   * @returns {Promise<void>}
   **/
  const getFilter = (id, transactionId) => {
    let getList = setInterval(async () => {
      try {
        const {data} = await getData(`${BASE_URL}${FILTER}${id}`, options);
        const filterData = Object.assign({}, data, {
          message_id: id,
          transaction_id: transactionId,
        });
        setFilters(filterData);
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
      setRequestInProgress(false);
    }, 8000);
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
  const onSearch = async (query, selectedSearchOption) => {
    if (longitude && latitude) {
      setRequestInProgress(true);
      setFilters(null);
      dispatch(saveProducts([]));

      let requestParameters = {
        context: {},
        message: {
          criteria: {
            delivery_location: `${latitude},${longitude}`,
          },
        },
      };
      refPageNumber.current = 1;

      try {
        switch (selectedSearchOption) {
          case SEARCH_QUERY.PRODUCT:
            requestParameters.message.criteria.search_string = query;
            break;

          case SEARCH_QUERY.PROVIDER:
            requestParameters.message.criteria.provider_id = query;
            break;

          default:
            requestParameters.message.criteria.category_id = query;
            break;
        }

        const response = await postData(
          `${BASE_URL}${GET_MESSAGE_ID}`,
          requestParameters,
          options,
        );

        refmessageId.current = response.data.context.message_id;
        refTransactionId.current = response.data.context.transaction_id;
        getProducts(setRequestInProgress);

        await getFilter(
          response.data.context.message_id,
          response.data.context.transaction_id,
        );
      } catch (error) {
        console.log(error);
        handleApiError(error);
        setRequestInProgress(false);
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
          apiInProgress={requestInProgress}
          filters={filters}
          setCount={setCount}
        />
        <RBSheet
          ref={refRBSheet}
          height={Dimensions.get('window').height / 2}
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
                message={!requestInProgress ? searchItemMessage : noResults}
              />
            );
          }}
          onEndReachedThreshold={0.2}
          // onEndReached={loadMoreList}
          contentContainerStyle={
            listData.length > 0
              ? styles.contentContainerStyle
              : appStyles.container
          }
          ListFooterComponent={<ListFooter moreRequested={moreListRequested} />}
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
