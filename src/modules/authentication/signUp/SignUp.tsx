import React, {useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import SignUpWithEmail from './components/SignUpWithEmail';
import SignUpWithPhone from './components/SignUpWithPhone';
import FormSwitch from '../common/FormSwitch';
import PageBackground from '../common/PageBackground';

/**
 * Component is used to render login form
 */
const SignUp = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [formType, setFormType] = useState<string>('email');

  return (
    <>
      <PageBackground />
      <View style={styles.pageContainer}>
        <ScrollView style={styles.flexContainer}>
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

const makeStyles = (colors: any) =>
  StyleSheet.create({
    flexContainer: {
      flex: 1,
    },
    pageContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
    },
    container: {
      paddingHorizontal: 16,
    },
    title: {
      paddingTop: 12,
      color: '#fff',
    },
    signUpMessage: {
      paddingTop: 8,
      color: '#FAFAFA',
    },
    formContainer: {
      marginVertical: 32,
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#fff',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 24,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    footerContainer: {
      paddingBottom: 20,
    },
    textCenter: {
      textAlign: 'center',
      color: '#686868',
    },
    terms: {
      paddingVertical: 8,
      color: colors.primary,
    },
  });
