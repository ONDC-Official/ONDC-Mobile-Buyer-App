import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Yup from 'yup';

import SignUpIcon from '../../../assets/signup_icon.svg';
import ContainButton from '../../../components/button/ContainButton';
import InputField from '../../../components/input/InputField';
import PasswordField from '../../../components/input/PasswordField';
import {showToastWithGravity} from '../../../utils/utils';
import {appStyles} from '../../../styles/styles';
import {Text} from 'react-native-elements';
import SocialMediaLogin from '../common/SocialMediaLogin';
import {theme} from '../../../utils/theme';
import {useDispatch} from 'react-redux';
import {storeLoginDetails} from "../../../redux/auth/actions";

const userInfo = {
  email: '',
  password: '',
  name: '',
};

/**
 * Component is used to render sign up form
 * @param theme
 * @param navigation: application navigation object
 */
const SignUp = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email(t('errors.invalid_email'))
      .required(t('errors.required')),
    password: Yup.string()
      .trim()
      .min(8, t('errors.short_password'))
      .required(t('errors.required')),
    name: Yup.string().trim().required(t('errors.required')),
  });

  const [apiInProgress, setApiInProgress] = useState(false);

  /**
   * function create user with provided the email and password and create and store token in context
   * @param values:input values
   * @returns {Promise<void>}
   */
  const createUser = async values => {
    try {
      setApiInProgress(true);

      const response = await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );
      await auth().currentUser.updateProfile({displayName: values.name});

      const idTokenResult = await auth().currentUser.getIdTokenResult();

      await storeLoginDetails(dispatch, {
        token: idTokenResult.token,
        uid: response.user.uid,
        emailId: response.user.email,
        name: values.name,
        photoURL: '',
      });

      navigation.reset({
        index: 0,
        routes: [{name: 'AddDefaultAddress'}],
      });

      setApiInProgress(false);
    } catch (error) {
      showToastWithGravity(error.message);
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
          <Text style={styles.title}>Sign up</Text>
          <Text style={styles.signUpMessage}>
            Please enter details to register
          </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Formik
              initialValues={userInfo}
              validationSchema={validationSchema}
              onSubmit={createUser}>
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
                        value={values.name}
                        onBlur={handleBlur('name')}
                        placeholder={t(
                          'authentication.signup.name_placeholder',
                        )}
                        errorMessage={touched.name ? errors.name : null}
                        onChangeText={handleChange('name')}
                      />
                    </View>
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
                        title={t('authentication.signup.button_title')}
                        onPress={handleSubmit}
                        loading={apiInProgress}
                        disabled={apiInProgress}
                      />
                    </View>

                    <SocialMediaLogin />

                    <View style={styles.loginMessage}>
                      <Text>Already have an account?</Text>
                      <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.terms}>Login</Text>
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

export default SignUp;

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
