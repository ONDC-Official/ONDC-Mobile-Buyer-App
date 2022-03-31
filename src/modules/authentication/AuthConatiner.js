import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {appStyles} from '../../styles/Styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Text} from 'react-native-elements';
import ClearButton from '../../components/button/ClearButton';
import {strings} from '../../locales/i18n';

const userAgreement = strings('global.user_agreement');
const termsOfServices = strings('global.terms_of_services');
const andLabel = strings('global.and_label');
const privacyPolicy = strings('global.privacy_policy');

const AuthContainer = ({children}) => {
  return (
    <View style={[appStyles.container, styles.container]}>
      <TouchableOpacity>
        <Icon name="angle-left" size={30} />
      </TouchableOpacity>
      <View style={appStyles.container}>{children}</View>
      <View style={styles.footerContainer}>
        <Text>{userAgreement}</Text>
        <ClearButton title={termsOfServices} />
        <Text> {andLabel} </Text>
        <ClearButton title={privacyPolicy} />
      </View>
    </View>
  );
};

export default AuthContainer;

const styles = StyleSheet.create({
  container: {padding: 16},
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
});
