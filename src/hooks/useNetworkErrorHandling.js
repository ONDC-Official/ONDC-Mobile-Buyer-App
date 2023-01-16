import {useNavigation} from '@react-navigation/native';
import SlangRetailAssistant from '@slanglabs/slang-conva-react-native-retail-assistant';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {clearAllData} from '../redux/actions';
import {clearFilters} from '../redux/filter/actions';
import {alertWithOneButton} from '../utils/alerts';
import {showToastWithGravity} from '../utils/utils';
import {logoutUser} from '../redux/auth/actions';

let sessionExpiredMessageShown = false;

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();

  const clearDataAndLogout = () => {
    logoutUser(dispatch);
    dispatch(clearAllData());
    dispatch(clearFilters());

    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  const handleApiError = (error, setError = null) => {
    console.log(error.response);
    SlangRetailAssistant.cancelSession();
    if (error.response) {
      if (error.response.status === 401) {
        if (!sessionExpiredMessageShown) {
          sessionExpiredMessageShown = true;
          alertWithOneButton(
            t('network_error.session_expired_title'),
            t('network_error.session_expired_message'),
            t('network_error.session_expired_button_label'),
            () => {
              sessionExpiredMessageShown = false;
              clearDataAndLogout();
            },
          );
        }
      } else if (error.response.status === 426) {
        alertWithOneButton(
          t('network_error.version_mismatch_title'),
          t('network_error.version_mismatch_message'),
          t('global.ok_label'),
          () => {},
        );
      } else {
        if (setError !== null) {
          setError(error.response.data);
        } else {
          showToastWithGravity(error.response.data.error.message);
        }
      }
    } else if (error.request) {
      if (setError !== null) {
        setError(t('network_error.network_connection_error'));
      } else {
        showToastWithGravity(t('network_error.network_connection_error'));
      }
    } else {
      if (setError !== null) {
        setError(t('network_error.something_went_wrong'));
      } else {
        showToastWithGravity(t('network_error.something_went_wrong'));
      }
    }
  };

  return {handleApiError: handleApiError};
};
