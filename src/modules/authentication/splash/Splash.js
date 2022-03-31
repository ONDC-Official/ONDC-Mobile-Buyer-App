import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {appStyles} from '../../../styles/Styles';
import {Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';

const image = require('../../../assets/logo.png');
const versionLabel = strings('global.version_label');

//TODO: Documentation is missing
//TODO: Version no should come from the config
const Splash = () => {
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
