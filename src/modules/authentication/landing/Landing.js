import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-elements';
import ContainButton from '../../../components/button/ContainButton';
import OutlineButton from '../../../components/button/OutlineButton';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';
import {isIOS} from '../../../utils/utils';
import useLoginWithGoogle from './hooks/useLoginWithGoogle';

const logo = require('../../../assets/ondc.png');

const login = strings('authentication.landing.login');
const signUp = strings('authentication.landing.sign_up');
const continueWithGoogle = strings(
  'authentication.landing.continue_with_google',
);
const continueWithApple = strings('authentication.landing.continue_with_apple');
const versionLabel = strings('global.version_label');

/**
 * Component is used to render landing screen
 * @param theme
 * @param navigation: application navigation object
 */
const Landing = ({navigation}) => {
  const {theme} = useTheme();
  const {loginWithGoogle} = useLoginWithGoogle(navigation);

  return (
    <View style={appStyles.container}>
      <View style={[appStyles.container, styles.container]}>
        <Image source={logo} style={styles.image}/>

        <View style={styles.buttonContainer}>
          <ContainButton
            title={login}
            onPress={() => navigation.navigate('Login')}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ContainButton
            title={signUp}
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
        <View
          style={[
            styles.divider,
            {borderBottomColor: theme.colors.accentColor},
          ]}
        />

        <View style={styles.buttonContainer}>
          <OutlineButton
            title={continueWithGoogle}
            onPress={loginWithGoogle}
            icon={{
              name: 'google',
              type: 'font-awesome',
              size: 30,
              color: theme.colors.accentColor,
            }}
            color={theme.colors.accentColor}
          />
        </View>
        {isIOS && (
          <View style={styles.buttonContainer}>
            <OutlineButton
              title={continueWithApple}
              icon={{
                name: 'apple',
                type: 'font-awesome',
                size: 30,
                color: theme.colors.accentColor,
              }}
              color={theme.colors.accentColor}
            />
          </View>
        )}

        <Text>{versionLabel}</Text>
      </View>
    </View>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {alignItems: 'center', padding: 16, justifyContent: 'center'},
  image: {height: 100, width: 200, marginVertical: 50},
  buttonContainer: {width: 300, marginBottom: 36},
  divider: {borderBottomWidth: 1, width: '100%', marginBottom: 36},
  versionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});
