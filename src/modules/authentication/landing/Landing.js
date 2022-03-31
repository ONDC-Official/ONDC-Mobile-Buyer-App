import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import ContainButton from '../../../components/button/ContainButton';
import {appStyles} from '../../../styles/Styles';
import {Text, useTheme} from 'react-native-elements';
import {strings} from '../../../locales/i18n';

const logo = require('../../../assets/logo.png');

const login = strings('authentication.landing.login');
const signUp = strings('authentication.landing.sign_up');
const continueWithGoogle = strings(
  'authentication.landing.continue_with_google',
);
const continueWithApple = strings('authentication.landing.continue_with_apple');
const versionLabel = strings('global.version_label');

const Landing = ({navigation}) => {
  const {theme} = useTheme();

  return (
    <>
      <View style={[appStyles.container, styles.container]}>
        <Image source={logo} style={styles.image} />

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
          style={[styles.divider, {borderBottomColor: theme.colors.primary}]}
        />
        <View style={appStyles.container}>
          <View style={styles.buttonContainer}>
            <ContainButton
              title={continueWithGoogle}
              type="outline"
              icon={{
                name: 'google',
                type: 'font-awesome',
                size: 30,
                color: theme.colors.primary,
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <ContainButton
              title={continueWithApple}
              type="outline"
              icon={{
                name: 'apple',
                type: 'font-awesome',
                size: 30,
                color: theme.colors.primary,
              }}
            />
          </View>
        </View>
        <Text>{versionLabel}</Text>
      </View>
    </>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {alignItems: 'center', padding: 16},
  subContainer: {justifyContent: 'center'},
  image: {height: 100, width: 200, marginVertical: 50},
  buttonContainer: {width: 300, marginBottom: 36},
  divider: {borderBottomWidth: 1, width: '100%', marginBottom: 36},
});
