import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {Button, Text, withTheme} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';

import SignUpIcon from '../../../assets/signup_icon.svg';
import InputField from '../../../components/input/InputField';
import PasswordField from '../../../components/input/PasswordField';
import {showToastWithGravity} from '../../../utils/utils';
import {appStyles} from '../../../styles/styles';
import SocialMediaLogin from '../common/SocialMediaLogin';
import {storeLoginDetails} from '../../../redux/auth/actions';

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
const SignUp = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const {isConnected, isInternetReachable} = useNetInfo();

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email('Please enter valid email address')
      .required('Email cannot be empty'),
    password: Yup.string()
      .trim()
      .min(8, 'Password is too short')
      .required('Password cannot be empty'),
    name: Yup.string().trim().required('Full Name cannot be empty'),
  });

  const [apiInProgress, setApiInProgress] = useState(false);

  /**
   * function create user with provided the email and password and create and store token in context
   * @param values:input values
   * @returns {Promise<void>}
   */
  const createUser = async values => {
    if (isConnected && isInternetReachable) {
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
        setApiInProgress(false);
        if (error?.code === 'auth/email-already-in-use') {
          showToastWithGravity('Account already exist on this email-id');
        } else {
          showToastWithGravity(error.message);
        }
      }
    } else {
      showToastWithGravity('Please check your internet connection.');
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
                        name="name"
                        value={values.name}
                        onBlur={handleBlur('name')}
                        label="Full Name"
                        required={true}
                        placeholder={'Full Name'}
                        errorMessage={touched.name ? errors.name : null}
                        onChangeText={handleChange('name')}
                      />
                    </View>
                    <View style={appStyles.inputContainer}>
                      <InputField
                        name="email"
                        value={values.email}
                        required={true}
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
                        required={true}
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
                        Sign up
                      </Button>
                    </View>

                    <SocialMediaLogin />

                    <View style={styles.loginMessage}>
                      <Text>Already have an account?</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}>
                        <Text
                          style={{color: theme.colors.primary, paddingLeft: 8}}>
                          Login
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

export default withTheme(SignUp);

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
