import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Card, withTheme} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ClearButton from '../../components/button/ClearButton';
import {appStyles} from '../../styles/styles';

const image = require('../../assets/ondc.png');

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

  const {t} = useTranslation();

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.white}]}>
      <KeyboardAwareScrollView
        contentContainerStyle={[appStyles.container, styles.container]}>
        <TouchableOpacity onPress={onBackPress}>
          <Icon name="angle-left" size={30} color={colors.accentColor}/>
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image source={image} resizeMode={'contain'} style={styles.image}/>
        </View>

        <View style={[appStyles.container, styles.mainContainer]}>
          <Card containerStyle={styles.containerStyle}>
            {children}
            <View style={styles.footerContainer}>
              <Text>{t('global.user_agreement')}</Text>
              <ClearButton title={t('global.terms_of_services')}/>
              <Text> {t('global.and_label')} </Text>
              <ClearButton title={t('global.privacy_policy')}/>
            </View>
          </Card>
        </View>
      </KeyboardAwareScrollView>
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
