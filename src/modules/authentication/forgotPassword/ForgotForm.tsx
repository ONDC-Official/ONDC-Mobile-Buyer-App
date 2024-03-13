import {Formik, FormikHelpers} from 'formik';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import React from 'react';
import * as Yup from 'yup';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {showToastWithGravity} from '../../../utils/utils';
import InputField from '../../../components/input/InputField';
import {alertWithOneButton} from '../../../utils/alerts';
import {useAppTheme} from '../../../utils/theme';

interface FormData {
  email: string;
}

const userInfo: FormData = {
  email: '',
};

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Please enter valid email address')
    .required('Email cannot be empty.'),
});

const ForgotForm = () => {
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {isConnected, isInternetReachable} = useNetInfo();

  /**
   * function checks whether the email and password is valid if it is valid it creates and store token in context
   * @returns {Promise<void>}
   */
  const requestPassword = async (
    values: FormData,
    formikHelpers: FormikHelpers<FormData>,
  ) => {
    if (isConnected && isInternetReachable) {
      try {
        await auth().sendPasswordResetEmail(values.email);
        alertWithOneButton(
          'Forgot Password',
          'Password reset link has been send to your registered email address. Please click on the link and reset your password.',
          'Ok',
          () => {
            navigation.goBack();
          },
        );
      } catch (error: any) {
        console.log(error);
        if (error.code === 'auth/user-not-found') {
          showToastWithGravity(
            'There is no user record corresponding to this identifier.',
          );
        } else {
          showToastWithGravity('Something went wrong, please try again');
        }
      } finally {
        formikHelpers.setSubmitting(false);
      }
    } else {
      showToastWithGravity('Please check your internet connection.');
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={requestPassword}>
      {({
        isSubmitting,
        values,
        errors,
        handleChange,
        handleBlur,
        touched,
        handleSubmit,
      }) => (
        <>
          <InputField
            inputMode={'email'}
            disabled={isSubmitting}
            name="email"
            value={values.email}
            onBlur={handleBlur('email')}
            required
            inputLabel="Email Address"
            placeholder="Enter email address"
            error={!!touched.email && !!errors.email}
            errorMessage={touched.email ? errors.email : null}
            onChangeText={handleChange('email')}
          />
          <View style={styles.buttonContainer}>
            <Button
              labelStyle={[theme.fonts.bodyLarge]}
              style={styles.containedButton}
              contentStyle={styles.button}
              mode="contained"
              onPress={() => handleSubmit()}
              loading={isSubmitting}
              disabled={isSubmitting}>
              Send Email
            </Button>
          </View>

          <View style={styles.loginMessage}>
            <Text variant={'bodyMedium'} style={styles.dontHaveMessage}>
              Remember password?
            </Text>
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={() => navigation.goBack()}>
              <Text variant={'bodyLarge'} style={styles.signUpText}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Formik>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    buttonContainer: {
      marginTop: 28,
    },
    containedButton: {
      borderRadius: 12,
    },
    button: {
      height: 44,
    },
    loginMessage: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    dontHaveMessage: {
      color: colors.neutral300,
    },
    signUpText: {color: colors.primary, paddingLeft: 8},
  });

export default ForgotForm;
