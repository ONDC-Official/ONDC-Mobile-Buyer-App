import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {useDispatch} from 'react-redux';

import {appStyles} from '../../../styles/styles';
import ONDCLogo from '../../../assets/ondc.svg';
import AppLogo from '../../../assets/app_logo.svg';
import {tryLocalSignIn} from '../../../redux/auth/actions';

/**
 * Component to render splash screen
 * @param navigation: required: to navigate to the respective screen based on token availability
 * @constructor
 * @returns {JSX.Element}
 */
const Splash = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  /**
   * Function is used to check if the token is available
   * @returns {Promise<void>}
   */
  const checkIfUserIsLoggedIn = async () => {
    try {
      await tryLocalSignIn(dispatch, navigation);
    } catch (error) {
      navigation.reset({
        index: 0,
        routes: [{name: 'SignUp'}],
      });
    }
  };

  useEffect(() => {
    checkIfUserIsLoggedIn().then(() => {});
  }, []);

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
