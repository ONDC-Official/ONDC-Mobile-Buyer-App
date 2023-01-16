import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef, useState} from 'react';

import {saveProducts} from '../../../../redux/product/actions';
import {
  clearFilters,
  saveFilters,
  saveIds,
} from '../../../../redux/filter/actions';
import {PRODUCT_SORTING, SEARCH_QUERY} from '../../../../utils/Constants';
import {getData, postData} from '../../../../utils/api';
import {
  GET_MESSAGE_ID,
  GET_PRODUCTS,
  SERVER_URL,
} from '../../../../utils/apiUtilities';
import {getStoredData} from '../../../../utils/storage';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import RNEventSource from 'react-native-event-source';
import {cleanFormData} from '../../../../utils/utils';

export default () => {
  const listCount = useRef(0);
  const pageNumber = useRef(1);
  const count = useRef(0);

  const dispatch = useDispatch();
  const {handleApiError} = useNetworkErrorHandling();

  const [currentAddress, setCurrentAddress] = useState(null);
  const [apiInProgress, setApiInProgress] = useState(false);
  const {token} = useSelector(({authReducer}) => authReducer);
  const {messageId, transactionId} = useSelector(
    ({filterReducer}) => filterReducer,
  );

  /**
   * function request products list with given message id and transaction id
   * @param id:message id of search result
   * @param transId:transaction id of search result
   * @param page
   * @param filters
   */
  const getProductsList = async (
    id,
    transId,
    page = pageNumber.current,
    filters,
  ) => {
    try {
      let url = null;

      if (filters) {
        const {sortMethod, providers, categories, range} = filters;
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

        let params = '';
        if (range) {
          const filterData = cleanFormData({
            priceMin: range.priceMin ? range.priceMin : null,
            priceMax: range.priceMax ? range.priceMax : null,
          });

          let filterParams = Object.keys(filterData).map(
            key => `&${key}=${filterData[key]}`,
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
      const {data} = await getData(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.message.catalogs.length > 0) {
        const productsList = data.message.catalogs.map(item => {
          return Object.assign({}, item, {
            quantity: 0,
            transaction_id: transId,
            city: currentAddress?.address?.city,
            state: currentAddress?.address?.state,
          });
        });

        listCount.current = productsList.length;
        count.current = data.message.count;

        dispatch(saveProducts(productsList));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    let eventSource = null;

    if (messageId) {
      eventSource = new RNEventSource(
        `${SERVER_URL}/clientApis/events?messageId=${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      eventSource.addEventListener('on_search', event => {
        const data = JSON.parse(event.data);

        if (data.hasOwnProperty('count')) {
          count.current = data.count;
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
          count.current = data.totalCount;
          if (listCount.current < data.totalCount && listCount.current < 10) {
            console.log('Get products');
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
        eventSource.removeAllListeners();
        eventSource.close();
        eventSource = null;
      }
    };
  }, [messageId]);

  /**
   * Function is used to handle onEndEditing event of searchbar
   * @param query:query entered by user
   * @param selectedSearchOption:search query selected by user
   * @returns {Promise<void>}
   **/
  const onSearch = async (query, selectedSearchOption) => {
    listCount.current = 0;
    const addressString = await getStoredData('address');
    const address = JSON.parse(addressString);

    setCurrentAddress(address);
    setApiInProgress(true);
    dispatch(saveProducts([]));
    dispatch(clearFilters());
    let requestParameters = {
      context: {},
      message: {
        criteria: {
          delivery_location: address?.gps,
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
  };

  return {
    onSearch,
    apiInProgress,
  };
};
