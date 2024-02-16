import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import LoginWithEmail from './components/LoginWithEmail';
import LoginWithPhone from './components/LoginWithPhone';

/**
 * Component is used to render login form
 */
const Login = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [formType, setFormType] = useState<string>('email');

  return (
    <>
      <View style={styles.flexContainer}>
        <View style={styles.primaryBackground} />
        <View style={styles.whiteBackground} />
      </View>
      <View style={styles.pageContainer}>
        <ScrollView style={styles.flexContainer}>
          <View style={styles.container}>
            <Text variant={'headlineMedium'} style={styles.title}>
              Sign In
            </Text>
            <Text variant={'bodyMedium'} style={styles.signUpMessage}>
              Please enter details to sign in
            </Text>
            <View style={styles.formContainer}>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  onPress={() => setFormType('email')}
                  style={[
                    styles.segmentButton,
                    formType === 'email' ? styles.selectedSegment : {},
                  ]}>
                  <Text
                    variant={'bodyMedium'}
                    style={[
                      styles.segmentLabel,
                      formType === 'email' ? styles.selectedSegmentLabel : {},
                    ]}>
                    Email Address
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormType('phone')}
                  style={[
                    styles.segmentButton,
                    formType === 'phone' ? styles.selectedSegment : {},
                  ]}>
                  <Text
                    variant={'bodyMedium'}
                    style={[
                      styles.segmentLabel,
                      formType === 'phone' ? styles.selectedSegmentLabel : {},
                    ]}>
                    Phone No.
                  </Text>
                </TouchableOpacity>
              </View>
              {formType === 'email' ? <LoginWithEmail /> : <LoginWithPhone />}
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

export default Login;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    flexContainer: {
      flex: 1,
    },
    primaryBackground: {
      backgroundColor: colors.primary,
      flex: 1,
    },
    whiteBackground: {
      backgroundColor: '#fff',
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
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E8E8E8',
      borderRadius: 25,
      marginHorizontal: 16,
    },
    segmentButton: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      flex: 1,
      alignItems: 'center',
    },
    segmentLabel: {
      color: '#686868',
    },
    selectedSegmentLabel: {
      color: '#FFFFFF',
    },
    selectedSegment: {
      backgroundColor: colors.primary,
      borderRadius: 25,
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
