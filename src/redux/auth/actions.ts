import {AnyAction, Dispatch} from 'redux';
import {clearAll, getStoredData, setStoredData} from '../../utils/storage';
import i18n from '../../i18n';

export const checkLanguageAndLogin = (navigation: any) => {
  getStoredData('language').then(language => {
    if (!language) {
      navigation.reset({
        index: 0,
        routes: [{name: 'ChooseLanguage'}],
      });
    } else {
      i18n.changeLanguage(language).then(() => {
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
      });
    }
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

export const updateLanguage = (language: string) => {
  return {type: 'set_language', payload: language};
};
