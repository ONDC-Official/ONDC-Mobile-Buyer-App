import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {Button, Text, withTheme} from 'react-native-paper';

import SignUpIcon from '../../../assets/signup_icon.svg';
import InputField from '../../../components/input/InputField';
import PasswordField from '../../../components/input/PasswordField';
import {showToastWithGravity} from '../../../utils/utils';
import {appStyles} from '../../../styles/styles';
import SocialMediaLogin from '../common/SocialMediaLogin';
import {getStoredData} from '../../../utils/storage';
import {storeLoginDetails} from '../../../redux/auth/actions';

const userInfo = {
  email: '',
  password: '',
};

/**
 * Component is used to render login form
 * @param theme
 * @param navigation: application navigation object
 */
const Login = ({navigation, theme}) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email('Please enter valid email address')
      .required('This field is required'),
    password: Yup.string()
      .trim()
      .min(8, 'Password is too short')
      .required('This field is required'),
  });

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

      await storeLoginDetails(dispatch, {
        token: idTokenResult.token,
        uid: response.user.uid,
        emailId: response.user.email,
        name: response.user.displayName ? response.user.displayName : 'Unknown',
        photoURL: response.user.photoURL ? response.user.photoURL : '',
      });

      const address = await getStoredData('address');
      if (address) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'AddressList', params: {navigateToDashboard: true}}],
        });
      }

      setApiInProgress(false);
    } catch (error) {
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
                        name="email"
                        value={values.email}
                        onBlur={handleBlur('email')}
                        label="Email"
                        placeholder="Email"
                        errorMessage={touched.email ? errors.email : null}
                        onChangeText={handleChange('email')}
                      />
                    </View>
                    <View style={appStyles.inputContainer}>
                      <PasswordField
                        value={values.password}
                        onBlur={handleBlur('password')}
                        label="Password"
                        placeholder="Password"
                        secureTextEntry
                        errorMessage={touched.password ? errors.password : null}
                        onChangeText={handleChange('password')}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Button
                        contentStyle={appStyles.containedButtonContainer}
                        labelStyle={appStyles.containedButtonLabel}
                        mode="contained"
                        onPress={handleSubmit}
                        loading={apiInProgress}
                        disabled={apiInProgress}>
                        Login
                      </Button>
                    </View>

                    <SocialMediaLogin />

                    <View style={styles.loginMessage}>
                      <Text>Don't have an account?</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}>
                        <Text
                          style={{color: theme.colors.primary, paddingLeft: 8}}>
                          Sign up
                        </Text>
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
        <Button mode="text">Terms and condition</Button>
      </View>
    </View>
  );
};

export default withTheme(Login);

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
    alignItems: 'center',
  },
  footerContainer: {
    paddingBottom: 20,
  },
  textCenter: {
    textAlign: 'center',
  },
});
