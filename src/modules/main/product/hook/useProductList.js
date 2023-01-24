import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef, useState} from 'react';

import {clearProducts, saveProducts} from '../../../../redux/product/actions';
import {
  clearFilters,
  saveFilters,
  saveIds,
} from '../../../../redux/filter/actions';
import {PRODUCT_SORTING, SEARCH_QUERY} from '../../../../utils/Constants';
import {getData, postData} from '../../../../utils/api';
import {
  BASE_URL,
  GET_MESSAGE_ID,
  GET_PRODUCTS,
} from '../../../../utils/apiUtilities';
import {getStoredData} from '../../../../utils/storage';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import RNEventSource from 'react-native-event-source';

export default (category = null) => {
  const listCount = useRef(0);
  const count = useRef(0);
  const currentPage = useRef(1);
  const filterCount = useRef(0);

  const dispatch = useDispatch();
  const {handleApiError} = useNetworkErrorHandling();

  const [currentAddress, setCurrentAddress] = useState(null);
  const [apiInProgress, setApiInProgress] = useState(false);
  const [productsRequested, setProductsRequested] = useState(false);
  const {token} = useSelector(({authReducer}) => authReducer);
  const {
    messageId,
    transactionId,
    selectedSortOption,
    selectedProviders,
    selectedCategories,
    maxPrice,
    minPrice,
  } = useSelector(({filterReducer}) => filterReducer);

  /**
   * function request products list with given message id and transaction id
   * @param id:message id of search result
   * @param transId:transaction id of search result
   * @param page
   */
  const getProductsList = async (id, transId, page = 1) => {
    if (id) {
      try {
        setProductsRequested(true);
        let url = `${BASE_URL}${GET_PRODUCTS}${id}&pageNumber=${page}&limit=10`;

        switch (selectedSortOption) {
          case PRODUCT_SORTING.RATINGS_HIGH_TO_LOW:
            url = `${url}&sortField=rating&sortOrder=desc`;
            break;

          case PRODUCT_SORTING.RATINGS_LOW_TO_HIGH:
            url = `${url}&sortField=rating&sortOrder=asc`;
            break;

          case PRODUCT_SORTING.PRICE_LOW_TO_HIGH:
            url = `${url}&sortField=price&sortOrder=asc`;
            break;

          case PRODUCT_SORTING.PRICE_HIGH_TO_LOW:
            url = `${url}&sortField=price&sortOrder=desc`;
            break;

          default:
            break;
        }

        if (selectedProviders.length > 0) {
          url = `${url}&providerIds=${selectedProviders.toString()}`;
        }

        if (selectedCategories.length > 0) {
          url = `${url}&categoryIds=${selectedCategories.toString()}`;
        }

        if (maxPrice !== 0) {
          url = `${url}&priceMin=${minPrice}&priceMax=${maxPrice}`;
        }

        const {data} = await getData(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.message.catalogs.length > 0) {
          let productsList = data.message.catalogs.map(item => {
            return Object.assign({}, item, {
              quantityMeta: item?.quantity,
              quantity: 0,
              transaction_id: transId,
              city: currentAddress?.address?.city,
              state: currentAddress?.address?.state,
            });
          });
          productsList = productsList.filter(
            (value, index, self) =>
              index === self.findIndex(one => one.id === value.id),
          );
          listCount.current = productsList.length;
          count.current = data.message.count;
          dispatch(saveProducts(productsList));
        }
        setProductsRequested(false);
      } catch (error) {
        handleApiError(error);
        setProductsRequested(false);
        throw error;
      }
    }
  };

  const loadMore = () => {
    if (
      listCount.current >= 10 &&
      listCount.current < count.current &&
      !productsRequested
    ) {
      currentPage.current = currentPage.current + 1;
      getProductsList(messageId, transactionId, currentPage.current)
        .then(r => {})
        .catch(() => {});
    }
  };

  /**
   * Function is used to handle onEndEditing event of searchbar
   * @param query:query entered by user
   * @param selectedSearchOption:search query selected by user
   * @returns {Promise<void>}
   **/
  const onSearch = async (query, selectedSearchOption) => {
    listCount.current = 0;
    currentPage.current = 1;
    const addressString = await getStoredData('address');
    const address = JSON.parse(addressString);

    dispatch(clearProducts());

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
      if (selectedSearchOption === SEARCH_QUERY.PRODUCT) {
        requestParameters.message.criteria.search_string = query;
      } else if (selectedSearchOption === SEARCH_QUERY.PROVIDER) {
        requestParameters.message.criteria.provider_id = query;
      }

      if (category) {
        requestParameters.message.criteria.category_id = category;
      }

      const response = await postData(
        `${BASE_URL}${GET_MESSAGE_ID}`,
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

  const updateFilterCount = () => {
    filterCount.current += 1;
  };

  useEffect(() => {
    let eventSource = null;

    if (messageId) {
      eventSource = new RNEventSource(
        `${BASE_URL}/clientApis/events?messageId=${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      eventSource.addEventListener('on_search', event => {
        const data = JSON.parse(event.data);

        if (data.hasOwnProperty('count')) {
          if (count.current < data.count) {
            count.current = data.count;
          }
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
          if (count.current < data.totalCount) {
            count.current = data.totalCount;
          }

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
        eventSource.removeAllListeners();
        eventSource.close();
        eventSource = null;
      }
    };
  }, [messageId]);

  useEffect(() => {
    if (filterCount.current > 0) {
      currentPage.current = 1;
      dispatch(clearProducts());
      getProductsList(messageId, transactionId)
        .then(() => {})
        .catch(() => {});
    }
  }, [filterCount.current]);

  return {
    apiInProgress,
    onSearch,
    getProductsList,
    loadMore,
    updateFilterCount,
  };
};
