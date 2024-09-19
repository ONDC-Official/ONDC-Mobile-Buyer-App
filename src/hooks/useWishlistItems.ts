import {API_BASE_URL, WISHLIST} from '../utils/apiActions';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef} from 'react';
import useNetworkHandling from './useNetworkHandling';
import useNetworkErrorHandling from './useNetworkErrorHandling';
import {updateWishlistItems} from '../toolkit/reducer/wishlist';

const CancelToken = axios.CancelToken;

export default () => {
  const {uid} = useSelector(({auth}) => auth);
  const dispatch = useDispatch();
  const source = useRef<any>(null);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getWishlistItems = async () => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${WISHLIST}/${uid}/all`,
        source.current.token,
      );
      dispatch(updateWishlistItems(data));
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

  return {getWishlistItems};
};
