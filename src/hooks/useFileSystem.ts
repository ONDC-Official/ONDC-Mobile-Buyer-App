import RNFS from 'react-native-fs';
import useNetworkErrorHandling from './useNetworkErrorHandling';

export default () => {
  const {handleApiError} = useNetworkErrorHandling();

  const fileConvertToBase64 = async (path: string) => {
    try {
      const file = await RNFS.exists(path);
      if (file) {
        const result = await RNFS.readFile(path, 'base64');
        return result;
      }
    } catch (e) {
      console.log('error from read', e);
      handleApiError(e);
    }
  };

  const deleteFile = async (path: string) => {
    try {
      const file = await RNFS.exists(path);

      if (file) {
        await RNFS.unlink(path);
      }
    } catch (error) {
      console.log('error delete file', error);
      handleApiError(error);
    }
  };

  return {fileConvertToBase64, deleteFile};
};
