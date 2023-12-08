import axios from 'axios';
import {useSelector} from 'react-redux';

export default () => {
  const {token} = useSelector(({authReducer}) => authReducer);

  const getAuthConfig = (cancelToken = null) => {
    const config: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (cancelToken) {
      config.cancelToken = cancelToken;
    }
    return config;
  };

  const postDataWithAuth = async (
    url: string,
    params: any,
    cancelToken: any,
  ) => {
    try {
      const config = getAuthConfig(cancelToken);
      console.log(url);
      return await axios.post(encodeURI(url), params, config);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const getDataWithAuth = async (url: string, cancelToken: any) => {
    try {
      const config = getAuthConfig(cancelToken);
      console.log(url);
      return await axios.get(encodeURI(url), config);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return {
    getDataWithAuth,
    postDataWithAuth,
  };
};
