import {
  clearAll,
  getMultipleData,
  getStoredData,
  setStoredData,
} from '../../utils/storage';

export const tryLocalSignIn = (dispatch, navigation) => {
  const payload = {};

  getMultipleData(['token', 'uid', 'emailId', 'name', 'transaction_id'])
    .then(data => {
      if (data[0][1] !== null) {
        data.forEach(item => {
          try {
            payload[item[0]] = JSON.parse(item[1]);
          } catch (error) {
            payload[item[0]] = item[1];
          }
        });
        dispatch({type: 'save_user', payload});
        getStoredData('address').then(address => {
          if (address) {
            navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [
                {name: 'AddressList', params: {navigateToDashboard: true}},
              ],
            });
          }
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    })
    .catch(error => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    });
};

export const logoutUser = dispatch => {
  clearAll().then(() => {
    dispatch({
      type: 'logout_user',
    });
  });
};

export const updateToken = (dispatch, token) => {
  setStoredData('token', token).then(() => {
    dispatch({type: 'set_token', payload: token});
  });
};
