import React, {useEffect} from 'react';
import {Linking, NativeModules, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Text} from 'react-native-paper';
import DeviceInfo, {getVersion} from 'react-native-device-info';
import auth from '@react-native-firebase/auth';
import JailMonkey from 'jail-monkey';
import {useTranslation} from 'react-i18next';
import {isDeviceRooted} from 'react-native-detect-frida';

import {appStyles} from '../../../styles/styles';
import {getMultipleData, getStoredData} from '../../../utils/storage';
import i18n from '../../../i18n';
import {saveAddress} from '../../../redux/address/actions';
import {getUrlParams} from '../../../utils/utils';
import {alertWithOneButton} from '../../../utils/alerts';
import AppLogo from '../../../assets/app_logo.svg';
const {RootCheck} = NativeModules;

interface Splash {
  navigation: any;
}

/**
 * Component to render splash screen
 * @param navigation: required: to navigate to the respective screen based on token availability
 * @constructor
 * @returns {JSX.Element}
 */
const Splash: React.FC<Splash> = ({navigation}) => {
  const dispatch = useDispatch();
  const styles = makeStyles();

  const {t} = useTranslation();

  const checkMagisk = async () => {
    return await RootCheck.isMagiskPresent();
  };

  const checkLanguage = async (language: any, pageParams: any) => {
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
        dispatch(saveAddress(address));
        if (pageParams) {
          navigation.reset({
            index: 0,
            routes: [{name: 'BrandDetails', params: pageParams}],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'Dashboard'}],
          });
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
        dispatch({type: 'save_user', payload});
        const idToken = await auth().currentUser?.getIdToken(true);
        dispatch({type: 'set_token', payload: idToken});
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
  const checkIfUserIsLoggedIn = async () => {
    try {
      const payload: any = await getDataFromStorage();
      if (payload) {
        await checkLanguage(payload.language, null);
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    } catch (error) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  const processUrl = async (url: string) => {
    try {
      const payload: any = await getDataFromStorage();
      const urlParams = getUrlParams(url);
      if (
        urlParams.hasOwnProperty('context.action') &&
        urlParams['context.action'] === 'search'
      ) {
        const brandId = `${urlParams['context.bpp_id']}_${urlParams['context.domain']}_${urlParams['message.intent.provider.id']}`;
        const pageParams: any = {brandId};
        if (
          urlParams.hasOwnProperty('message.intent.provider.locations.0.id')
        ) {
          pageParams.outletId = `${brandId}_${urlParams['message.intent.provider.locations.0.id']}`;
        }
        await checkLanguage(payload.language, pageParams);
      } else {
        await checkLanguage(payload.language, null);
      }
    } catch (error) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  const processLink = () => {
    Linking.getInitialURL().then(url => {
      if (url) {
        processUrl(url).then(() => {});
      } else {
        checkIfUserIsLoggedIn().then(() => {});
      }
    });
  };

  useEffect(() => {
    DeviceInfo.isPinOrFingerprintSet().then(isPinOrFingerprintSet => {
      if (!isPinOrFingerprintSet) {
        alertWithOneButton(
          'Alert',
          'Please setup the device lock to access this application',
          'Ok',
          () => {},
        );
      } else {
        if (JailMonkey.isJailBroken()) {
          alertWithOneButton(
            'Alert',
            'This application can not be used on the rooted device',
            'Ok',
            () => {},
          );
        } else {
          isDeviceRooted().then(result => {
            if (result.isRooted) {
              alertWithOneButton(
                'Alert',
                'This application can not be used on the rooted device',
                'Ok',
                () => {},
              );
            } else {
              checkMagisk().then(isPresent => {
                if (isPresent) {
                  alertWithOneButton(
                    'Alert',
                    'This application can not be used on the rooted device',
                    'Ok',
                    () => {},
                  );
                } else {
                  processLink();
                }
              });
            }
          });
        }
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
