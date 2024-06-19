import axios from 'axios';
import {useSelector} from 'react-redux';
import {getVersion} from 'react-native-device-info';

export default () => {
  const {token, language} = useSelector(({auth}) => auth);

  const getAuthConfig = (cancelToken = null) => {
    const config: any = {
      headers: {
        Authorization: `Bearer ${token}`,
        targetlanguage: language,
        appVersion: getVersion(),
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
      return await axios.post(encodeURI(url), params, config);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const putDataWithAuth = async (
    url: string,
    params: any,
    cancelToken: any,
  ) => {
    try {
      const config = getAuthConfig(cancelToken);
      return await axios.put(encodeURI(url), params, config);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const getDataWithAuth = async (url: string, cancelToken: any) => {
    try {
      const config = getAuthConfig(cancelToken);
      return await axios.get(encodeURI(url), config);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const deleteDataWithAuth = async (url: string, cancelToken: any) => {
    try {
      const config = getAuthConfig(cancelToken);
      return await axios.delete(encodeURI(url), config);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  return {
    getDataWithAuth,
    postDataWithAuth,
    putDataWithAuth,
    deleteDataWithAuth,
  };
};
