import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-paper';
import LoginWithEmail from './components/LoginWithEmail';
import LoginWithPhone from './components/LoginWithPhone';
import FormSwitch from '../common/FormSwitch';
import PageBackground from '../common/PageBackground';
import {makeStyles} from '../common/pageStyling';
import {useAppTheme} from '../../../utils/theme';
import useKeyboardHelper from '../../../hooks/useKeyboardHelper';

/**
 * Component is used to render login form
 */
const Login = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [formType, setFormType] = useState<string>('email');
  const {isKeyboardVisible} = useKeyboardHelper();

  return (
    <>
      <PageBackground />
      <View style={styles.pageContainer}>
        <ScrollView
          style={styles.flexContainer}
          keyboardShouldPersistTaps={'always'}>
          <View style={styles.container}>
            <Text variant={'headlineMedium'} style={styles.title}>
              Sign In
            </Text>
            <Text variant={'bodyMedium'} style={styles.signUpMessage}>
              Please enter details to sign in
            </Text>
            <View style={styles.formContainer}>
              <FormSwitch formType={formType} setFormType={setFormType} />
              {formType === 'email' ? <LoginWithEmail /> : <LoginWithPhone />}
            </View>
          </View>
        </ScrollView>
        {!isKeyboardVisible && (
          <View style={styles.footerContainer}>
            <Text variant={'labelSmall'} style={styles.textCenter}>
              By Signing to mobile app. I accept all the
            </Text>
            <Text
              variant={'labelLarge'}
              style={[styles.textCenter, styles.terms]}>
              Terms and Conditions
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default Login;
