import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {setStoredData} from '../utils/storage';
import {setToken} from '../toolkit/reducer/auth';

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserToken = async () => {
      console.log('getUserToken');
      try {
        const idToken = await auth().currentUser?.getIdToken(true);
        console.log('idToken', idToken);
        if (idToken) {
          await setStoredData('token', idToken);
          dispatch(setToken(idToken));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserToken().then(() => {});
  }, []);

  return {};
};
