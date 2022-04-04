import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {appStyles} from '../../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Text} from 'react-native-elements';
import ClearButton from '../../components/button/ClearButton';
import {strings} from '../../locales/i18n';

const userAgreement = strings('global.user_agreement');
const termsOfServices = strings('global.terms_of_services');
const andLabel = strings('global.and_label');
const privacyPolicy = strings('global.privacy_policy');

/**
 * Component is used to render common page for authentication forms
 * @param onBackPress: function which handles click event of back button
 * @param children: form element to be rendered
 * @returns {JSX.Element}
 * @constructor
 */
const AuthContainer = ({children, onBackPress}) => {
  return (
    <View style={[appStyles.container, styles.container]}>
      <TouchableOpacity onPress={onBackPress}>
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
