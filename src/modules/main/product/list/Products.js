import Geolocation from '@react-native-community/geolocation';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, PermissionsAndroid, StyleSheet, View} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {withTheme} from 'react-native-elements';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {
  clearFilters,
  saveFilters,
  saveIds,
} from '../../../../redux/filter/actions';
import {saveProducts} from '../../../../redux/product/actions';
import {appStyles} from '../../../../styles/styles';
import {getData} from '../../../../utils/api';
import {postData} from '../../../../utils/api';
import {
  BASE_URL,
  GET_LATLONG,
  GET_LOCATION_FROM_LAT_LONG,
  GET_MESSAGE_ID,
  GET_PRODUCTS,
  SERVER_URL,
} from '../../../../utils/apiUtilities';
import {cleanFormData, half, isIOS} from '../../../../utils/utils';
import {PRODUCT_SORTING, SEARCH_QUERY} from '../../../../utils/Constants';
import AddressPicker from './component/AddressPicker';
import EmptyComponent from './component/EmptyComponent';
import Header from './component/header/Header';
import ListPlaceholder from './component/placeholder/ListPlaceholder';
import LocationDeniedAlert from './component/LocationDeniedAlert';
import ProductCard from './component/ProductCard';
import ProductCardSkeleton from './component/ProductCardSkeleton';
import RNEventSource from 'react-native-event-source';
import {
  saveCityState,
  saveLatLong,
  savePincode,
} from '../../../../redux/location/action';
import Pagination from './Pagination';
import SlangRetailAssistant, {
  RetailUserJourney,
  SearchUserJourney,
} from '@slanglabs/slang-conva-react-native-retail-assistant';
import Config from 'react-native-config';

/**
 * Component to show list of requested products
 * @constructor
 * @returns {JSX.Element}
 */
const Products = ({navigation, theme}) => {
  const {t} = useTranslation();

  const {colors} = theme;

  const unKnownLabel = t('main.product.please_select_location');

  const [location, setLocation] = useState(unKnownLabel);

  const [isVisible, setIsVisible] = useState(false);

  const [eloc, setEloc] = useState(null);

  const [item, setItem] = useState(null);

  const [count, setCount] = useState(null);

  const [locationInProgress, setLocationInProgress] = useState(false);

  const [apiInProgress, setApiInProgress] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState(null);

  const {products} = useSelector(({productReducer}) => productReducer);

  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const [latLongInProgress, setLatLongInProgress] = useState(false);

  const [searchInProgress, setSearchInProgress] = useState(false);

  const [moreListRequested, setMoreListRequested] = useState(false);

  const [previousRequested, setPreviousRequested] = useState(false);

  const [searchRequested, setSearchRequested] = useState(false);

  const listCount = useRef(0);

  const pageNumber = useRef(1);

  const {messageId, transactionId} = useSelector(
    ({filterReducer}) => filterReducer,
  );

  const {latitude, longitude, city, state} = useSelector(
    ({locationReducer}) => locationReducer,
  );

  const [locationMessage, setLocationMessage] = useState('');

  const {
    state: {token},
  } = useContext(AuthContext);

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const dispatch = useDispatch();

  const {handleApiError} = useNetworkErrorHandling();

  const refRBSheet = useRef();

  const openSheet = () => refRBSheet.current.open();

  const closeSheet = () => refRBSheet.current.close();

  const flatListRef = useRef();

  /**
   * Function is used to render single product card in the list
   * @param item:single object from products list
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => {
    const element = cartItems.find(one => one.id === item.id);
    item.quantity = element ? element.quantity : 0;
    return item.hasOwnProperty('isSkeleton') && item.isSkeleton ? (
      <ProductCardSkeleton item={item} />
    ) : (
      <ProductCard
        item={item}
        apiInProgress={apiInProgress}
        navigation={navigation}
        confirmed={true}
      />
    );
  };

  /**
   * Function is used to get location of user
   * @param response:response get from recurrent position which contains latitude and longitude
   * @returns {Promise<void>}
   **/
  const getLocation = async response => {
    try {
      setLocationMessage('Requesting address');

      const {data} = await getData(
        `${BASE_URL}${GET_LOCATION_FROM_LAT_LONG}lat=${response.coords.latitude}&long=${response.coords.longitude}`,
      );
      dispatch(
        saveLatLong(response.coords.latitude, response.coords.longitude),
      );

      setLocation(
        `${data.results[0].city} ${data.results[0].state} ${data.results[0].area}`,
      );
      dispatch(saveCityState(data.results[0].city, data.results[0].state));
      dispatch(saveProducts([]));
      dispatch(clearFilters());

      setLocationInProgress(false);
    } catch (error) {
      setLocation(unKnownLabel);
      dispatch(saveLatLong(null, null));
      setLocationInProgress(false);
    }
  };

  /**
   * Function is used to get latitude and longitude of user current location
   **/
  const getLatLong = () => {
    setLocationInProgress(true);
    setLocationMessage(t('main.product.detecting_location'));
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
      {timeout: 20000},
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
              title: t('main.product.permission_needed_message'),
              buttonNegative: t('main.product.cancel_label'),
              buttonPositive: t('main.product.ok_label'),
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
   * function request products list with given message id and transaction id
   * @param id:message id of search result
   * @param transId:transaction id of search result
   */
  const getProductsList = async (
    id,
    transId,
    page = pageNumber.current,
    fltrs,
  ) => {
    try {
      let url = null;

      if (fltrs) {
        const {sortMethod, providers, categories, range} = fltrs;
        let sortField = 'price';
        let sortOrder = 'desc';

        switch (sortMethod) {
          case PRODUCT_SORTING.RATINGS_HIGH_TO_LOW:
            sortOrder = 'desc';
            sortField = 'rating';
            break;

          case PRODUCT_SORTING.RATINGS_LOW_TO_HIGH:
            sortOrder = 'asc';
            sortField = 'rating';
            break;

          case PRODUCT_SORTING.PRICE_LOW_TO_HIGH:
            sortOrder = 'asc';
            sortField = 'price';
            break;
        }

        let params;
        if (range) {
          const filterData = cleanFormData({
            priceMin: range.priceMin ? range.priceMin : null,
            priceMax: range.priceMax ? range.priceMax : null,
          });

          let filterParams = [];
          Object.keys(filterData).forEach(key =>
            filterParams.push(`&${key}=${filterData[key]}`),
          );
          params = filterParams.toString().replace(/,/g, '');
        }

        if (providers && providers.length > 0) {
          params = params + `&providerIds=${providers.toString()}`;
        }

        if (categories && categories.length > 0) {
          params = params + `&categoryIds=${categories.toString()}`;
        }

        url = params
          ? `${SERVER_URL}${GET_PRODUCTS}${id}${params}&sortField=${sortField}&sortOrder=${sortOrder}&pageNumber=${page}&limit=10`
          : `${SERVER_URL}${GET_PRODUCTS}${id}&sortField=${sortField}&sortOrder=${sortOrder}&pageNumber=${page}&limit=10`;
      } else {
        url = `${SERVER_URL}${GET_PRODUCTS}${id}&pageNumber=${page}&limit=10`;
      }
      const {data} = await getData(url, options);

      if (data.message.catalogs.length > 0) {
        const productsList = data.message.catalogs.map(item => {
          return Object.assign({}, item, {
            quantity: 0,
            transaction_id: transId,
            city: city,
            state: state,
          });
        });

        listCount.current = productsList.length;
        setCount(data.message.count);

        dispatch(saveProducts(productsList));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  /**
   * Function is used to get latitude and longitude
   * @returns {Promise<void>}
   **/
  const getPosition = async () => {
    try {
      setLatLongInProgress(true);
      const {data} = await getData(`${BASE_URL}${GET_LATLONG}${eloc}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await getData(
        `${BASE_URL}${GET_LOCATION_FROM_LAT_LONG}lat=${data.latitude}&long=${data.longitude}`,
      );
      dispatch(savePincode(res.data.results[0].pincode));
      dispatch(
        saveCityState(res.data.results[0].city, res.data.results[0].state),
      );

      if (data.latitude && data.longitude) {
        dispatch(saveLatLong(data.latitude, data.longitude));
        dispatch(saveProducts([]));
        dispatch(clearFilters());
      } else {
        setLocation(t('main.product.please_select_location'));
      }
      setLatLongInProgress(false);
    } catch (error) {
      setLocation(t('main.product.please_select_location'));
      handleApiError(error);
      setLatLongInProgress(false);
    }
  };

  /**
   * Function is used to handle onEndEditing event of searchbar
   * @param query:query entered by user
   * @param selectedSearchOption:search query selected by user
   * @returns {Promise<void>}
   **/
  const onSearch = async (query, selectedSearchOption) => {
    setAppliedFilters(null);
    pageNumber.current = 1;
    listCount.current = 0;
    setApiInProgress(true);
    if (longitude && latitude && city && state) {
      dispatch(saveProducts([]));
      dispatch(clearFilters());
      let requestParameters = {
        context: {},
        message: {
          criteria: {
            delivery_location: `${latitude},${longitude}`,
          },
        },
      };
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
          `${SERVER_URL}${GET_MESSAGE_ID}`,
          requestParameters,
          options,
        );
        dispatch(
          saveIds(
            response.data.context.message_id,
            response.data.context.transaction_id,
          ),
        );
      } catch (error) {
        setApiInProgress(false);

        handleApiError(error);
      }
    } else {
      SlangRetailAssistant.cancelSession();
      alert(t('main.product.please_select_location'));
    }
  };

  const retailAssistantListener = {
    //Callback handler that gets called when the user triggers a search user journey
    onSearch: (searchInfo, searchUserJourney) => {
      console.log('item', searchInfo.item);
      setItem(null);
      setItem(
        searchInfo?.item?.completeDescription
          ? searchInfo?.item?.completeDescription
          : searchInfo.item.description,
      );

      onSearch(
        searchInfo?.item?.completeDescription
          ? searchInfo?.item?.completeDescription
          : searchInfo.item.description,
        SEARCH_QUERY.PRODUCT,
      );
      searchUserJourney.setSuccess();

      return SearchUserJourney.AppState.SEARCH_RESULTS;
    },
    onAssistantError: errorCode => {
      switch (errorCode) {
        case SlangRetailAssistant.ErrorCode.FATAL_ERROR:
          console.log('Slang Fatal Error!');
          break;
        case SlangRetailAssistant.ErrorCode.SYSTEM_ERROR:
          console.log('Slang System Error!');
          break;
        case SlangRetailAssistant.ErrorCode.ASSISTANT_DISABLED:
          console.log('Slang Assistant Disabled!');
          break;
        case SlangRetailAssistant.ErrorCode.MISSING_CREDENTIALS:
          console.log('Slang Missing Credentials!');
          break;
        case SlangRetailAssistant.ErrorCode.INVALID_CREDENTIALS:
          console.log('Slang Invalid Credentials!');
          break;
      }
    },
  };

  const initializeSlang = async () => {
    try {
      await SlangRetailAssistant.initialize({
        requestedLocales: ['en-IN', 'hi-IN', 'kn-IN', 'ml-IN', 'ta-IN'], // The languages to enable
        assistantId: Config.ASSISTANT_ID, // The Assistant ID from the console
        apiKey: Config.API_KEY, // The API key from the console
        enableCustomTrigger: true,
      });

      SlangRetailAssistant.setAction(retailAssistantListener);
    } catch (error) {
      console.error(error);
    }
  };

  const onPress = () => {
    setItem(null);
    SlangRetailAssistant.startConversation(RetailUserJourney.SEARCH);
  };

  useEffect(() => {
    if (city && state && longitude && latitude) {
      initializeSlang()
        .then(() => {})
        .catch(() => {});
    }
  }, [state, latitude, city, state]);

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

  useEffect(() => {
    let eventSource = null;

    if (messageId) {
      eventSource = new RNEventSource(
        `${SERVER_URL}/clientApis/events?messageId=${messageId}`,
        options,
      );
      SlangRetailAssistant.cancelSession();

      eventSource.addEventListener('on_search', event => {
        const data = JSON.parse(event.data);

        if (data.hasOwnProperty('count')) {
          setCount(data.count);
          const filterData = Object.assign({}, data.filters, {
            message_id: data.messageId,
          });

          dispatch(saveFilters(filterData));

          if (listCount.current < data.count && listCount.current < 10) {
            getProductsList(messageId, transactionId)
              .then(() => {})
              .catch(() => {});
          } else {
            setApiInProgress(false);
          }
        } else {
          setCount(data.totalCount);
          if (listCount.current < data.totalCount && listCount.current < 10) {
            getProductsList(messageId, transactionId)
              .then(() => {})
              .catch(() => {});
          } else {
            setApiInProgress(false);
          }
        }
      });
    }

    return () => {
      if (eventSource) {
        eventSource.removeAllListeners(); //whenever the component removes it will execute
        eventSource.close();
        eventSource = null;
      }
    };
  }, [messageId]);

  const listData = products;

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}
      edges={['top', 'left', 'right']}>
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
          getProductsList={getProductsList}
          latLongInProgress={latLongInProgress}
          locationMessage={locationMessage}
          pageNumber={pageNumber}
          onPress={onPress}
          item={item}
          setItem={setItem}
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
          ref={flatListRef}
          renderItem={renderItem}
          keyExtractor={(items, index) => {
            return index.toString();
          }}
          ListEmptyComponent={() => {
            if (searchRequested) {
              return (
                <EmptyComponent
                  message={
                    !apiInProgress
                      ? t('main.product.search_item_message')
                      : t('main.product.no_results')
                  }
                />
              );
            } else {
              return <ListPlaceholder />;
            }
          }}
          contentContainerStyle={
            listData.length > 0
              ? styles.contentContainerStyle
              : appStyles.container
          }
          ListFooterComponent={
            products.length > 0 &&
            !apiInProgress &&
            count > 10 && (
              <Pagination
                pageNumber={pageNumber}
                count={count}
                appliedFilters={appliedFilters}
                setCount={setCount}
                moreListRequested={moreListRequested}
                setMoreListRequested={setMoreListRequested}
                previousRequested={previousRequested}
                setPreviousRequested={setPreviousRequested}
                flatListRef={flatListRef}
                getProductsList={getProductsList}
              />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default withTheme(Products);

const styles = StyleSheet.create({
  container: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
});
