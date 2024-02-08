import {useSelector} from 'react-redux';

export default () => {
  const {token} = useSelector(({authReducer}) => authReducer);

  /**
   * Function is used to upload the file to s3
   * @param url: url to upload file
   * @param path: path of the file
   * @returns {Promise<Response>}
   */
  const uploadFile = async (url: string, path: any) => {
    try {
      const response = await fetch(path);
      const imageBody = await response.blob();
      return fetch(url, {
        method: 'PUT',
        body: imageBody,
        headers: {
          'access-token': `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {uploadFile};
};
