import {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {
  clearFilters,
  saveFilters,
  saveIds,
} from '../../../../redux/filter/actions';
import {saveProducts} from '../../../../redux/product/actions';
import {getData, postData} from '../../../../utils/api';
import {
  BASE_URL,
  FILTER,
  GET_MESSAGE_ID,
  GET_PRODUCTS,
} from '../../../../utils/apiUtilities';
import {PRODUCT_SORTING, SEARCH_QUERY} from '../../../../utils/Constants';
import {cleanFormData} from '../../../../utils/utils';

export default () => {
  const {handleApiError} = useNetworkErrorHandling();

  const dispatch = useDispatch();

  const {t} = useTranslation();

  const {products} = useSelector(({productReducer}) => productReducer);

  const {
    state: {token},
  } = useContext(AuthContext);

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /**
   * function request products list with given message id and transaction id
   * @param setCount:function to set count of products
   * @param messageId:message id of search result
   * @param transactionId:transactin id of search result
   * @param setSearchInProgress:function to set boolean indicating api request progress
   */
  const getProductsList = async (
    setCount,
    messageId,
    transactionId,
    pageNumber,
    appliedFilters,
    requestCount = 6,
    setSearchInProgress = null,
  ) => {
    try {
      let url = null;

      if (appliedFilters) {
        const {sortMethod, providers, categories, range} = appliedFilters;
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
          ? `${BASE_URL}${GET_PRODUCTS}${messageId}${params}&sortField=${sortField}&sortOrder=${sortOrder}&pageNumber=${pageNumber}&limit=10`
          : `${BASE_URL}${GET_PRODUCTS}${messageId}&sortField=${sortField}&sortOrder=${sortOrder}&pageNumber=${pageNumber}&limit=10`;
      } else {
        url = `${BASE_URL}${GET_PRODUCTS}${messageId}&sortField=price&sortOrder=asc&pageNumber=${pageNumber}&limit=10`;
      }
      const {data} = await getData(url, options);
      if (data.message.catalogs.length > 0 || requestCount === 6) {
        const productsList = data.message.catalogs.map(item => {
          return Object.assign({}, item, {
            quantity: 0,
            transaction_id: transactionId,
          });
        });
        const list =
          pageNumber === 1
            ? productsList
            : [...new Set([...products, ...productsList])];

        dispatch(saveProducts(list));
        setCount(data.message.count);
        if (setSearchInProgress) {
          setSearchInProgress(false);
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  /**
   * function to get list of products
   * @param setCount:function to set count of products
   * @param messageId:message id of search result
   * @param transactionId:transactin id of search result
   * @param setApiInProgress:function to set boolean indicating api request progress
   * @param setSearchInProgress:function to set boolean indicating api request progress
   */
  const getProducts = (
    setCount,
    setApiInProgress,
    messageId,
    transactionId,
    pageNumber,
    setSearchInProgress,
  ) => {
    let requestCount = 0;
    let getList = setInterval(async () => {
      try {
        requestCount++;
        await getProductsList(
          setCount,
          messageId,
          transactionId,
          pageNumber,
          null,
          requestCount,
          setSearchInProgress,
        );
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
      setApiInProgress(false);
      setSearchInProgress(false);
    }, 12000);
  };

  /**
   * Function used to get list of filters
   * @param id:message id of search result
   * @param transactionId:transactin id of search result
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
        dispatch(saveFilters(filterData));
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
    }, 8000);
  };

  /**
   * Function is used to handle onEndEditing event of searchbar
   * @param setCount:function to set count of products
   * @param query:search query entered by user
   * @param latitude:latitude of selected location
   * @param longitude:longitude of selected location
   * @param selectedSearchOption:search query selected by user
   * @param setApiInProgress:function to set boolean indicating api request progress
   * @param setSearchInProgress:function to set boolean indicating api request progress
   * @returns {Promise<void>}
   **/
  const search = async (
    setCount,
    query,
    latitude,
    longitude,
    selectedSearchOption,
    setApiInProgress,
    setSearchInProgress,
    pageNumber,
  ) => {
    if (longitude && latitude) {
      setApiInProgress(true);
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
          `${BASE_URL}${GET_MESSAGE_ID}`,
          requestParameters,
          options,
        );

        dispatch(
          saveIds(
            response.data.context.message_id,
            response.data.context.transaction_id,
          ),
        );
        getProducts(
          setCount,
          setApiInProgress,
          response.data.context.message_id,
          response.data.context.transaction_id,
          pageNumber,
          setSearchInProgress,
        );

        await getFilter(
          response.data.context.message_id,
          response.data.context.transaction_id,
        );
      } catch (error) {
        setApiInProgress(false);
        handleApiError(error);
      }
    } else {
      alert(t('main.product.please_select_location'));
    }
  };

  return {getProductsList, search};
};
