import {API_BASE_URL} from '../utils/apiActions';
import axios from 'axios/index';
import {useSelector} from 'react-redux';
import {useEffect, useRef} from 'react';
import useNetworkHandling from './useNetworkHandling';
import useNetworkErrorHandling from './useNetworkErrorHandling';

const CancelToken = axios.CancelToken;

export default () => {
  const {uid} = useSelector(({authReducer}) => authReducer);
  const source = useRef<any>(null);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getCartItems = async () => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}/clientApis/v2/cart/${uid}`,
        source.current.token,
      );
      return data;
    } catch (error) {
      handleApiError(error);
      return [];
    }
  };

  useEffect(() => {
    return () => {
      if (source.current) {
        source?.current?.cancel();
      }
    };
  }, []);
  return {getCartItems};
};
