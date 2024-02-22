import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-paper';
import PageBackground from '../common/PageBackground';
import ForgotForm from './ForgotForm';
import {makeStyles} from '../common/pageStyling';
import { useAppTheme } from "../../../utils/theme";

/**
 * Component is used to render login form
 */
const ForgotPassword = () => {
  const theme = useAppTheme();
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
