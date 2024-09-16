import React, {useEffect} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Text} from 'react-native-paper';
import DeviceInfo, {getVersion} from 'react-native-device-info';
import auth from '@react-native-firebase/auth';

import {appStyles} from '../../../styles/styles';
import {getMultipleData, getStoredData} from '../../../utils/storage';
import i18n from '../../../i18n';
import {alertWithOneButton} from '../../../utils/alerts';
import AppLogo from '../../../assets/app_logo.svg';
import {setAddress} from '../../../toolkit/reducer/address';
import {saveUser, setToken} from '../../../toolkit/reducer/auth';

interface Splash {
  navigation: any;
  route: any;
}

/**
 * Component to render splash screen
 * @param navigation: required: to navigate to the respective screen based on token availability
 * @constructor
 * @returns {JSX.Element}
 */
const Splash: React.FC<Splash> = ({navigation, route}) => {
  const {handleDeepLink} = route.params;
  const dispatch = useDispatch();
  const styles = makeStyles();

  const navigateToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  const checkLanguage = async (language: any, token: string) => {
    if (!language) {
      navigation.reset({
        index: 0,
        routes: [{name: 'ChooseLanguage'}],
      });
    } else {
      await i18n.changeLanguage(language);
      const addressString = await getStoredData('address');
      if (addressString) {
        const address = JSON.parse(addressString);
        dispatch(setAddress(address));
        const url = await Linking.getInitialURL();
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
        if (url) {
          handleDeepLink(url, token, address);
        }
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'AddressList', params: {navigateToDashboard: true}}],
        });
      }
    }
  };

  const getDataFromStorage = async () => {
    try {
      const payload: any = {};
      const data = await getMultipleData([
        'token',
        'uid',
        'emailId',
        'name',
        'transaction_id',
        'language',
      ]);
      if (data[0][1] !== null) {
        data.forEach((item: any) => {
          try {
            payload[item[0]] = JSON.parse(item[1]);
          } catch (error) {
            payload[item[0]] = item[1];
          }
        });
        dispatch(saveUser(payload));
        const idToken = await auth().currentUser?.getIdToken(true);
        dispatch(setToken(idToken));
        return payload;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  /**
   * Function is used to check if the token is available
   * @returns {Promise<void>}
   */
  const checkIfUserIsLoggedIn = async (): Promise<void> => {
    try {
      const payload: any = await getDataFromStorage();
      if (payload) {
        await checkLanguage(payload.language, payload.token);
      } else {
        navigateToLogin();
      }
    } catch (error) {
      navigateToLogin();
    }
  };

  useEffect(() => {
    DeviceInfo.isPinOrFingerprintSet().then(isPinOrFingerprintSet => {
      if (!isPinOrFingerprintSet) {
        alertWithOneButton(
          'Alert',
          'Please setup the device lock to access this application',
          'Ok',
          () => {
            checkIfUserIsLoggedIn().then(() => {});
          },
        );
      } else {
        checkIfUserIsLoggedIn().then(() => {});
      }
    });
  }, []);

  return (
    <View style={[appStyles.container, appStyles.backgroundWhite]}>
      <View style={[appStyles.container, styles.container]}>
        <AppLogo width={240} height={240} />
      </View>
      <View style={styles.footer}>
        <Text>Version: {getVersion()}</Text>
      </View>
    </View>
  );
};

export default Splash;

const makeStyles = () =>
  StyleSheet.create({
    container: {alignItems: 'center', justifyContent: 'center'},
    footer: {alignItems: 'center', marginBottom: 20},
  });
