import React, {useContext, useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {appStyles} from '../../../styles/styles';
import {Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';
import {Context as AuthContext} from '../../../context/Auth';

const image = require('../../../assets/logo.png');
const versionLabel = strings('global.version_label');

/**
 * Component to render splash screen
 * @param navigation: required: to navigate to the respective screen based on token availability
 * @constructor
 * @returns {JSX.Element}
 */
const Splash = ({navigation}) => {
  const {
    state: {isLoading, token},
    tryLocalSignIn,
  } = useContext(AuthContext);

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

  const checkUserStatus = () => {
    if (token) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'Landing'}],
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
    <View style={appStyles.container}>
      <View style={[appStyles.container, styles.container]}>
        <Image source={image} style={styles.image} />
      </View>
      <View style={styles.footer}>
        <Text>{versionLabel}</Text>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
  image: {height: 100, width: 200},
  footer: {alignItems: 'center', marginBottom: 20},
});
