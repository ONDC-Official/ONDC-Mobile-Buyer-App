import {Formik, FormikHelpers} from 'formik';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import InputField from '../../../../components/input/InputField';
import PasswordField from '../../../../components/input/PasswordField';
import OrContainer from '../../common/OrContainer';
import SocialMediaLogin from '../../common/GoogleLogin';
import {showToastWithGravity} from '../../../../utils/utils';
import useStoreUserAndNavigate from '../../../../hooks/useStoreUserAndNavigate';
import {useAppTheme} from '../../../../utils/theme';

interface FormData {
  email: string;
  password: string;
}

const userInfo: FormData = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Please enter valid email address')
    .required('Email cannot be empty.'),
  password: Yup.string().trim().required('Password cannot be empty'),
});

const LoginWithEmail = () => {
  const navigation = useNavigation<any>();
  const {storeDetails} = useStoreUserAndNavigate();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {isConnected, isInternetReachable} = useNetInfo();
  const [googleLoginRequested, setGoogleLoginRequested] =
    useState<boolean>(false);

  /**
   * function checks whether the email and password is valid if it is valid it creates and store token in context
   * @returns {Promise<void>}
   */
  const login = async (
    values: FormData,
    formikHelpers: FormikHelpers<FormData>,
  ) => {
    if (isConnected && isInternetReachable) {
      try {
        const response = await auth().signInWithEmailAndPassword(
          values.email,
          values.password,
        );

        const idTokenResult = await auth()?.currentUser?.getIdTokenResult();

        await storeDetails(idTokenResult, response.user);
      } catch (error: any) {
        if (
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found'
        ) {
          showToastWithGravity('Email Id or Password is Incorrect.');
        } else {
          if (error.hasOwnProperty('message')) {
            const message = error.message.replace(/\[.*\]/, '');
            if (message.length > 0) {
              showToastWithGravity(message);
            } else {
              showToastWithGravity('Something went wrong, please try again');
            }
          } else {
            showToastWithGravity('Something went wrong, please try again');
          }
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
      onSubmit={login}>
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
          <View style={styles.inputContainer}>
            <InputField
              inputMode={'email'}
              disabled={googleLoginRequested || isSubmitting}
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
          </View>
          <View style={styles.inputContainer}>
            <PasswordField
              disabled={googleLoginRequested || isSubmitting}
              value={values.password}
              required
              onBlur={handleBlur('password')}
              inputLabel="Password"
              placeholder="Password"
              secureTextEntry
              error={!!touched.password && !!errors.password}
              errorMessage={touched.password ? errors.password : null}
              onChangeText={handleChange('password')}
            />
          </View>
          <View style={styles.forgotPasswordContainer}>
            <Text
              variant={'bodyMedium'}
              onPress={() => navigation.navigate('ForgotPassword')}>
              Forgot Password
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              labelStyle={[theme.fonts.bodyLarge]}
              style={styles.containedButton}
              contentStyle={styles.button}
              mode="contained"
              onPress={() => handleSubmit()}
              loading={isSubmitting}
              disabled={googleLoginRequested || isSubmitting}>
              Sign In
            </Button>
          </View>

          <OrContainer />
          <SocialMediaLogin
            loginRequested={googleLoginRequested || isSubmitting}
            googleLoginRequested={googleLoginRequested}
            setGoogleLoginRequested={setGoogleLoginRequested}
          />

          <View style={styles.loginMessage}>
            <Text variant={'bodyMedium'} style={styles.dontHaveMessage}>
              Don't have an account?
            </Text>
            <TouchableOpacity
              disabled={googleLoginRequested || isSubmitting}
              onPress={() => navigation.navigate('SignUp')}>
              <Text variant={'bodyLarge'} style={styles.signUpText}>
                Sign up
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
    inputContainer: {
      marginTop: 20,
    },
    forgotPasswordContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
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

export default LoginWithEmail;
