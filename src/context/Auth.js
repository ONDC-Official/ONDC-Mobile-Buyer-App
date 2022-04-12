import {getData, setData} from '../utils/storage';
import createDataContext from './createDataContext';

const defaultValue = {
  user: null,
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
        payload.user = null;
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
  },
  Object.assign(defaultValue),
);
