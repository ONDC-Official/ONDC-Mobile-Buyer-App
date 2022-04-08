import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {appStyles} from '../../../styles/styles';
import {Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';

const image = require('../../../assets/logo.png');
const versionLabel = strings('global.version_label');

/**
 * Component to render splash screen
 * @param navigation: required: to navigate to the respective screen based on token availability
 * @constructor
 * @returns {JSX.Element}
 */
const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Landing');
    }, 3000);
  }, []);

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
