import {getData, clearMultiple, setData} from '../utils/storage';
import createDataContext from './createDataContext';

const defaultValue = {
  token: null,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'set_token':
      return Object.assign({}, state, {
        token: action.payload.token,
      });

    case 'save_token':
      return action.payload;

    case 'hide_loader':
      return {...state, isLoading: false};

    case 'logout_user':
      return Object.assign({}, state, {
        accessToken: null,
      });

    default:
      return state;
  }
};

const tryLocalSignIn = dispatch => {
  return async () => {
    const payload = {};

    try {
      const data = await getData('token');
      if (data !== null) {
        payload.token = data;
        payload.isLoading = false;
        dispatch({type: 'save_token', payload});
      } else {
        dispatch({type: 'hide_loader', payload});
      }
    } catch (error) {
      dispatch({type: 'hide_loader', payload});
    }
  };
};

const logoutUser = dispatch => {
  return () => {
    clearMultiple(['user', 'token']).then(() => {
      dispatch({
        type: 'logout_user',
        payload: {},
      });
    });
  };
};

const storeToken = dispatch => {
  return async data => {
    try {
      const {token} = data;

      await setData('token', token);
      const payload = {
        token: token,
      };
      dispatch({type: 'set_token', payload});
    } catch (error) {
      throw error;
    }
  };
};

export const {Provider, Context} = createDataContext(
  authReducer,
  {
    storeToken,
    tryLocalSignIn,
    logoutUser,
  },
  Object.assign(defaultValue),
);
