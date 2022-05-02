import {isSearchBarAvailableForCurrentPlatform} from 'react-native-screens';
import {
  getData,
  clearMultiple,
  setData,
  removeData,
  saveMultipleData,
  getMultipleData,
} from '../utils/storage';
import createDataContext from './createDataContext';

const defaultValue = {
  token: null,
  uid: null,
  emailId: null,
  name: null,
  photoURL: null,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'set_login_details':
      return Object.assign({}, state, {
        token: action.payload.token,
        emailId: action.payload.emailId,
        uid: action.payload.uid,
        name: action.payload.name,
        photoURL: action.payload.photoURL,
      });

    case 'save_token':
      return action.payload;

    case 'hide_loader':
      return {...state, isLoading: false};

    case 'logout_user':
      return Object.assign({}, state, defaultValue);

    case 'save_user':
      return action.payload;

    default:
      return state;
  }
};

const tryLocalSignIn = dispatch => {
  return async () => {
    const payload = {};

    try {
      const data = await getMultipleData(['token', 'uid', 'emailId', 'name']);

      if (data[0][1] !== null) {
        data.forEach(item => {
          try {
            payload[item[0]] = JSON.parse(item[1]);
          } catch (error) {
            payload[item[0]] = item[1];
          }
        });
        payload.isLoading = false;
        dispatch({type: 'save_user', payload});
      } else {
        dispatch({type: 'hide_loader', payload});
      }
    } catch (error) {
      dispatch({type: 'hide_loader', payload});
    }
  };
};

const logoutUser = dispatch => {
  return async () => {
    clearMultiple(['uid', 'emailId', 'token', 'name']).then(() => {
      dispatch({
        type: 'logout_user',
      });
    });
  };
};

const storeLoginDetails = dispatch => {
  return async data => {
    try {
      const {token, emailId, uid, name, photoURL} = data;
      await saveMultipleData([
        ['token', token],
        ['emailId', emailId],
        ['uid', uid],
        ['name', name],
        ['photoURL', photoURL],
      ]);
      const payload = {
        token: token,
        emailId: emailId,
        uid: uid,
        name: name,
        photoURL: photoURL,
      };
      dispatch({type: 'set_login_details', payload});
    } catch (error) {
      throw error;
    }
  };
};

export const {Provider, Context} = createDataContext(
  authReducer,
  {
    storeLoginDetails,
    tryLocalSignIn,
    logoutUser,
  },
  Object.assign(defaultValue),
);
