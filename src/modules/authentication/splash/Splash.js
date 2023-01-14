import React, {useContext, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {Context as AuthContext} from '../../../context/Auth';
import {appStyles} from '../../../styles/styles';

import ONDCLogo from '../../../assets/ondc.svg';
import AppLogo from '../../../assets/app_logo.svg';

/**
 * Component to render splash screen
 * @param navigation: required: to navigate to the respective screen based on token availability
 * @constructor
 * @returns {JSX.Element}
 */
const Splash = ({navigation}) => {
  const {t} = useTranslation();

  const {
    state: {isLoading, token},
    tryLocalSignIn,
  } = useContext(AuthContext);

  /**
   * Function is used to check if the token is available
   * @returns {Promise<void>}
   */
  const checkIfUserIsLoggedIn = async () => {
    try {
      await tryLocalSignIn();
    } catch (error) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Landing'}],
      });
    }
  };

  /**
   * Function is used to show screen depending on availability of token
   * @returns {Promise<void>}
   */
  const checkUserStatus = () => {
    if (token) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'SignUp'}],
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      checkIfUserIsLoggedIn().then(() => {});
    } else {
      checkUserStatus();
    }
  }, [isLoading]);

  return (
    <View style={[appStyles.container, appStyles.backgroundWhite]}>
      <View style={[appStyles.container, styles.container]}>
        <AppLogo width={256} height={86} />
        <View style={styles.ondcContainer}>
          <ONDCLogo width={240} height={95} />
        </View>
      </View>
      <View style={styles.footer}>
        <Text>{t('global.version_label')}</Text>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  ondcContainer: {
    marginTop: 50,
  },
  container: {alignItems: 'center', justifyContent: 'center'},
  footer: {alignItems: 'center', marginBottom: 20},
});
