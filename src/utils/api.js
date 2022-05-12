import axios from 'axios';

/**
 * Function is used to make get request
 * @param url: server url that will be used for the request
 * @param options:custom headers to be sent
 */
export const getData = async (url, options) => {
  try {
    // console.log('Get request ------', url);
    const response = await axios.get(url, options);
    console.log('------Response-------');
    console.log(JSON.stringify(response.data, undefined, 4));
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Function is used to make post request
 * @param url: server url that will be used for the request
 * @param payload:data to be sent with request
 * @param options:custom headers to be sent
 */
export const postData = async (url, payload, options) => {
  try {
    // console.log('Post request ------', url);
    // console.log('------Payload-------');
    // console.log(JSON.stringify(payload, undefined, 4));
    const response = await axios.post(url, payload, options);
    // console.log('------Response-------');
    // console.log(JSON.stringify(response.data, undefined, 4));
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Function is used to make patch request
 * @param url: server url that will be used for the request
 * @param payload:data to be sent with request
 * @param options:custom headers to be sent
 */
export const patchData = async (url, payload, options) => {
  try {
    return await axios.patch(url, payload, options);
  } catch (error) {
    throw error;
  }
};

/**
 * Function is used to make delete request
 * @param url: server url that will be used for the request
 * @param payload:data to be sent with request
 */
export const deleteData = async (url, payload) => {
  try {
    const response = await axios.patch(url, {data: payload});
    return response.data;
  } catch (error) {
    return error;
  }
};
