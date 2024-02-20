import React from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import PageBackground from '../common/PageBackground';
import ForgotForm from './ForgotForm';

/**
 * Component is used to render login form
 */
const ForgotPassword = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <>
      <PageBackground />
      <View style={styles.pageContainer}>
        <ScrollView style={styles.flexContainer}>
          <View style={styles.container}>
            <Text variant={'headlineMedium'} style={styles.title}>
              Forgot Password
            </Text>
            <Text variant={'bodyMedium'} style={styles.signUpMessage}>
              Enter email Address or phone no. you used to register
            </Text>
            <View style={styles.formContainer}>
              <ForgotForm />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ForgotPassword;

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
  });
