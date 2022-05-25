import {useContext, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {saveProducts} from '../../../../redux/product/actions';
import {getData} from '../../../../utils/api';
import {BASE_URL, GET_PRODUCTS} from '../../../../utils/apiUtilities';

export default () => {
  const dispatch = useDispatch();
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const [pageNumber, setPageNumber] = useState(1);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [count, setCount] = useState(null);
  const {products} = useSelector(({productReducer}) => productReducer);

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getProducts = (id, transactionId) => {
    let getList = setInterval(async () => {
      try {
        setRequestInProgress(true);

        const url = `${BASE_URL}${GET_PRODUCTS}${id}`;
        const {data} = await getData(
          `${url}&pageNumber=${pageNumber}&limit=10`,
          options,
        );
        setCount(data.message.count);

        const productsList = data.message.catalogs.map(item => {
          return Object.assign({}, item, {
            quantity: 0,
            transaction_id: transactionId,
          });
        });

        dispatch(saveProducts(productsList));
        setPageNumber(pageNumber + 1);
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
      setRequestInProgress(false);
    }, 10000);
  };

  return {getProducts, requestInProgress, setRequestInProgress, count};
};
