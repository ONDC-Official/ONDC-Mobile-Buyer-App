import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-paper';
import SignUpWithEmail from './components/SignUpWithEmail';
import SignUpWithPhone from './components/SignUpWithPhone';
import FormSwitch from '../common/FormSwitch';
import PageBackground from '../common/PageBackground';
import {makeStyles} from '../common/pageStyling';
import {useAppTheme} from '../../../utils/theme';

/**
 * Component is used to render login form
 */
const SignUp = ({route}: any) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [formType, setFormType] = useState<string>('email');

  useEffect(() => {
    if (!route?.params?.tab) {
      setFormType('phone');
    }
  }, [route?.params?.tab]);

  return (
    <>
      <PageBackground />
      <View style={styles.pageContainer}>
        <ScrollView
          style={styles.flexContainer}
          keyboardShouldPersistTaps={'always'}>
          <View style={styles.container}>
            <Text variant={'headlineMedium'} style={styles.title}>
              Sign Up
            </Text>
            <Text variant={'bodyMedium'} style={styles.signUpMessage}>
              Please enter details to register
            </Text>
            <View style={styles.formContainer}>
              <FormSwitch formType={formType} setFormType={setFormType} />
              {formType === 'email' ? <SignUpWithEmail /> : <SignUpWithPhone />}
            </View>
          </View>
        </ScrollView>
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
      </View>
    </>
  );
};

export default SignUp;
