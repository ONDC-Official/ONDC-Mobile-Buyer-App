import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import {appStyles} from '../../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ClearButton from '../../components/button/ClearButton';
import {strings} from '../../locales/i18n';
import {Card, withTheme} from 'react-native-elements';

const userAgreement = strings('global.user_agreement');
const termsOfServices = strings('global.terms_of_services');
const andLabel = strings('global.and_label');
const privacyPolicy = strings('global.privacy_policy');
const image = require('../../assets/logo.png');

/**
 * Component is used to render common page for authentication forms
 * @param theme
 * @param onBackPress: function which handles click event of back button
 * @param children: form element to be rendered
 * @returns {JSX.Element}
 * @constructor
 */
const AuthContainer = ({theme, children, onBackPress}) => {
  const {colors} = theme;
  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.white}]}>
      <View style={[appStyles.container, styles.container]}>
        <TouchableOpacity onPress={onBackPress}>
          <Icon name="angle-left" size={30} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image source={image} resizeMode={'contain'} style={styles.image} />
        </View>

        <View style={[appStyles.container, styles.mainContainer]}>
          <Card containerStyle={styles.containerStyle}>{children}</Card>
        </View>

        <View style={styles.footerContainer}>
          <Text>{userAgreement}</Text>
          <ClearButton title={termsOfServices} />
          <Text> {andLabel} </Text>
          <ClearButton title={privacyPolicy} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withTheme(AuthContainer);

const styles = StyleSheet.create({
  container: {padding: 16},
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 20,
    alignItems: 'center',
  },
  mainContainer: {justifyContent: 'center', alignItems: 'center'},
  containerStyle: {elevation: 2, borderRadius: 4},
  image: {height: 100, width: 200, marginBottom: 20},
  imageContainer: {alignItems: 'center'},
});
