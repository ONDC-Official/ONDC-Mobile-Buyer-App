import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {updateToken} from '../redux/auth/actions';

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        updateToken(dispatch, idToken);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return {};
};
