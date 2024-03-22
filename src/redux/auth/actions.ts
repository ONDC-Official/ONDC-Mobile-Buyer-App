import {AnyAction, Dispatch} from 'redux';
import {
  clearAll,
  getMultipleData,
  getStoredData,
  setStoredData,
} from '../../utils/storage';
import i18n from '../../i18n';

export const tryLocalSignIn = (
  dispatch: Dispatch<AnyAction>,
  navigation: any,
) => {
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

        getStoredData('appLanguage').then(language => {
          if (!language) {
            navigation.reset({
              index: 0,
              routes: [{name: 'ChooseLanguage'}],
            });
          } else {
            i18n.changeLanguage(language);
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

export const logoutUser = (dispatch: Dispatch<AnyAction>) => {
  clearAll().then(() => {
    dispatch({
      type: 'logout_user',
    });
  });
};

export const updateToken = (dispatch: Dispatch<AnyAction>, token: string) => {
  setStoredData('token', token).then(() => {
    dispatch({type: 'set_token', payload: token});
  });
};

export const updateTransactionId = (transactionId: string) => {
  return {type: 'set_traction_id', payload: transactionId};
};
