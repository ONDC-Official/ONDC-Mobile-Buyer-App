import axios from 'axios';
import {useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import useNetworkHandling from './useNetworkHandling';
import {API_BASE_URL, CATEGORIES} from '../utils/apiActions';
import {updateCategories} from '../toolkit/reducer/categories';

export default () => {
  const dispatch = useDispatch();
  const source = useRef<any>(null);
  const {getDataWithAuth} = useNetworkHandling();

  const getCategoryDetails = async () => {
    const CancelToken = axios.CancelToken;

    source.current = CancelToken.source();
    try {
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CATEGORIES}`,
        source.current.token,
      );
      dispatch(updateCategories(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      source.current?.cancel();
    };
  }, []);

  return {getCategoryDetails};
};
