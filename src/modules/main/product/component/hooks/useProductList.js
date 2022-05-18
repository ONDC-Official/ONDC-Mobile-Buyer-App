import {useContext, useState} from 'react';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {getData} from '../../../../../utils/api';
import {BASE_URL, GET_PRODUCTS} from '../../../../../utils/apiUtilities';
import {Context as AuthContext} from '../../../../../context/Auth';
import {useDispatch} from 'react-redux';
import {saveProducts} from '../../../../../redux/product/actions';

export default () => {
  const dispatch = useDispatch();
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getProducts = id => {
    let getList = setInterval(async () => {
      try {
        const {data} = await getData(
          `${BASE_URL}${GET_PRODUCTS}${id}`,
          options,
        );

        const productsList = data.message.catalogs.map(item => {
          return Object.assign({}, item, {quantity: 0});
        });

        dispatch(saveProducts(productsList));
      } catch (error) {
        handleApiError(error);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(getList);
    }, 10000);
  };

  return {getProducts};
};
