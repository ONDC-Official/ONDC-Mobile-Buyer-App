import {alertWithOneButton} from '../utils/alerts';
import {useContext} from 'react';
import {Context as AuthContext} from '../context/Auth';
import {useNavigation} from '@react-navigation/native';
import {strings} from '../locales/i18n';
import {showToastWithGravity} from '../utils/utils';
import {CartContext} from '../context/Cart';

let sessionExpiredMessageShown = false;

export default () => {
  const {logoutUser} = useContext(AuthContext);
  const {clearCart, storeList} = useContext(CartContext);
  const navigation = useNavigation();

  const clearDataAndLogout = () => {
    logoutUser();
    clearCart();
    storeList(null);
    navigation.reset({
      index: 0,
      routes: [{name: 'Landing'}],
    });
  };

  const handleApiError = (error, setError = null) => {
    console.log(JSON.stringify(error.response, undefined, 4));
    if (error.response) {
      if (error.response.status === 401) {
        if (!sessionExpiredMessageShown) {
          sessionExpiredMessageShown = true;
          alertWithOneButton(
            strings('network_error.session_expired_title'),
            strings('network_error.session_expired_message'),
            strings('network_error.session_expired_button_label'),
            () => {
              sessionExpiredMessageShown = false;
              clearDataAndLogout();
            },
          );
        }
      } else if (error.response.status === 426) {
        alertWithOneButton(
          strings('network_error.version_mismatch_title'),
          strings('network_error.version_mismatch_message'),
          strings('global.ok_label'),
          () => {},
        );
      } else {
        if (setError !== null) {
          setError(error.response.data);
        } else {
          showToastWithGravity(error.response.data[0].error.message);
        }
      }
    } else if (error.request) {
      if (setError !== null) {
        setError(strings('network_error.network_connection_error'));
      } else {
        showToastWithGravity(strings('network_error.network_connection_error'));
      }
    } else {
      if (setError !== null) {
        setError(strings('network_error.something_went_wrong'));
      } else {
        showToastWithGravity(strings('network_error.something_went_wrong'));
      }
    }
  };

  return {handleApiError: handleApiError};
};
