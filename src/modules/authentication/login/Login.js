import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Yup from 'yup';

import SignUpIcon from '../../../assets/signup_icon.svg';
import ContainButton from '../../../components/button/ContainButton';
import InputField from '../../../components/input/InputField';
import PasswordField from '../../../components/input/PasswordField';
import {Context as AuthContext} from '../../../context/Auth';
import {showToastWithGravity} from '../../../utils/utils';
import {appStyles} from '../../../styles/styles';
import {Text} from 'react-native-elements';
import SocialMediaLogin from '../common/SocialMediaLogin';
import {theme} from '../../../utils/theme';

const userInfo = {
  email: '',
  password: '',
};

/**
 * Component is used to render login form
 * @param theme
 * @param navigation: application navigation object
 */
const Login = ({navigation}) => {
  const {t} = useTranslation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email(t('errors.invalid_email'))
      .required(t('errors.required')),
    password: Yup.string()
      .trim()
      .min(8, t('errors.short_password'))
      .required(t('errors.required')),
  });

  const {storeLoginDetails} = useContext(AuthContext);

  const [apiInProgress, setApiInProgress] = useState(false);

  /**
   * function checks whether the email and password is valid if it is valid it creates and store token in context
   * @returns {Promise<void>}
   */
  const login = async values => {
    try {
      setApiInProgress(true);

      const response = await auth().signInWithEmailAndPassword(
        values.email,
        values.password,
      );

      const idTokenResult = await auth().currentUser.getIdTokenResult();

      await storeLoginDetails({
        token: idTokenResult.token,
        uid: response.user.uid,
        emailId: response.user.email,
        name: response.user.displayName ? response.user.displayName : 'Unknown',
        photoURL: response.user.photoURL ? response.user.photoURL : 'Unknown',
      });

      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });

      setApiInProgress(false);
    } catch (error) {
      console.log(error);
      const message = error.message.replace(/\[.*\]/, '');
      showToastWithGravity(message);
      setApiInProgress(false);
    }
  };

  return (
    <View style={[appStyles.container, appStyles.backgroundWhite]}>
      <ScrollView style={appStyles.container}>
        <View style={styles.imageContainer}>
          <SignUpIcon />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.signUpMessage}>
            Please enter details to login
          </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Formik
              initialValues={userInfo}
              validationSchema={validationSchema}
              onSubmit={login}>
              {({
                values,
                errors,
                handleChange,
                handleBlur,
                touched,
                handleSubmit,
              }) => {
                return (
                  <>
                    <View style={appStyles.inputContainer}>
                      <InputField
                        value={values.email}
                        onBlur={handleBlur('email')}
                        placeholder={t(
                          'authentication.login.email_placeholder',
                        )}
                        errorMessage={touched.email ? errors.email : null}
                        onChangeText={handleChange('email')}
                      />
                    </View>
                    <View style={appStyles.inputContainer}>
                      <PasswordField
                        value={values.password}
                        onBlur={handleBlur('password')}
                        placeholder={t(
                          'authentication.login.password_placeholder',
                        )}
                        secureTextEntry
                        errorMessage={touched.password ? errors.password : null}
                        onChangeText={handleChange('password')}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <ContainButton
                        title={t('authentication.login.button_title')}
                        onPress={handleSubmit}
                        loading={apiInProgress}
                        disabled={apiInProgress}
                      />
                    </View>

                    <SocialMediaLogin />

                    <View style={styles.loginMessage}>
                      <Text>Dont have an account?</Text>
                      <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.terms}>Sign up</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              }}
            </Formik>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <Text style={styles.textCenter}>
          By Log In to Mobile App. I accept all the applicable
        </Text>
        <TouchableOpacity>
          <Text style={{color: theme.colors.accentColor, textAlign: 'center'}}>
            Terms and Conditions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  imageContainer: {
    paddingTop: 24,
    alignSelf: 'center',
  },
  container: {
    alignSelf: 'center',
  },
  title: {
    paddingTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpMessage: {
    paddingTop: 12,
    color: '#959595',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 16,
    width: 300,
  },
  loginMessage: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButton: {
    paddingHorizontal: 8,
  },
  footerContainer: {
    paddingBottom: 20,
  },
  textCenter: {
    textAlign: 'center',
  },
  terms: {color: theme.colors.accentColor, textAlign: 'center'},
});
