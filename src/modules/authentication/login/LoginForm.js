import React, {useContext, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import InputField from '../../../components/input/InputField';
import ContainButton from '../../../components/button/ContainButton';
import {StyleSheet, View} from 'react-native';
import {Context as AuthContext} from '../../../context/Auth';
import {strings} from '../../../locales/i18n';
import auth from '@react-native-firebase/auth';
import {showToastWithGravity} from '../../../utils/utils';
import PasswordField from '../../../components/input/PasswordField';

const emailPlaceholder = strings('authentication.login.email_placeholder');
const passwordPlaceholder = strings(
  'authentication.login.password_placeholder',
);
const requiredField = strings('errors.required');
const shortPassword = strings('errors.short_password');
const invalidEmail = strings('errors.invalid_email');
const title = strings('authentication.login.button_title');

const validationSchema = Yup.object({
  email: Yup.string().trim().email(invalidEmail).required(requiredField),
  password: Yup.string().trim().min(8, shortPassword).required(requiredField),
});

/**
 * Component is used to render login form
 */
const LoginForm = ({navigation}) => {
  const userInfo = {
    email: '',
    password: '',
  };
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
      });

      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
      setApiInProgress(false);
    } catch (error) {
      showToastWithGravity(error.message);
      setApiInProgress(false);
    }
  };

  return (
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={values => {
        login(values)
          .then(() => {})
          .catch(() => {});
      }}>
      {({values, errors, handleChange, handleBlur, touched, handleSubmit}) => {
        return (
          <>
            <InputField
              value={values.email}
              onBlur={handleBlur('email')}
              placeholder={emailPlaceholder}
              errorMessage={touched.email ? errors.email : null}
              onChangeText={handleChange('email')}
            />
            <PasswordField
              value={values.password}
              onBlur={handleBlur('password')}
              placeholder={passwordPlaceholder}
              secureTextEntry
              errorMessage={touched.password ? errors.password : null}
              onChangeText={handleChange('password')}
            />
            <View style={styles.buttonContainer}>
              <ContainButton
                title={title}
                onPress={handleSubmit}
                loading={apiInProgress}
                disabled={apiInProgress}
              />
            </View>
          </>
        );
      }}
    </Formik>
  );
};
export default LoginForm;

const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignItems: 'center'},
  buttonContainer: {
    width: 300,
    marginTop: 20,
  },
});
