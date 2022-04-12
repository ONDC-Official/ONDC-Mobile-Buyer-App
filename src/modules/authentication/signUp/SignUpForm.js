import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {strings} from '../../../locales/i18n';
import ContainButton from '../../../components/button/ContainButton';
import InputField from '../../../components/input/InputField';
import {Context as AuthContext} from '../../../context/Auth';
import auth from '@react-native-firebase/auth';

const emailPlaceholder = strings('authentication.login.email_placeholder');
const passwordPlaceholder = strings(
  'authentication.login.password_placeholder',
);
const requiredField = strings('errors.required');
const shortPassword = strings('errors.short_password');
const invalidEmail = strings('errors.invalid_email');
const title = strings('authentication.signup.button_title');
//TODO: Typo: In word 'unmatch', unmatch is not a word
const unmatchPassowrd = strings('errors.unmatch_password');
const confirmPassword = strings(
  'authentication.signup.confirm_password_placeholder',
);

const validationSchema = Yup.object({
  email: Yup.string().email(invalidEmail).required(requiredField),
  password: Yup.string().trim().min(8, shortPassword).required(requiredField),
  confirmPassword: Yup.string()
    .required(requiredField)
    .equals([Yup.ref('password'), null], unmatchPassowrd),
});

/**
 * Component is used to render sign up form
 * @param theme
 * @param navigation: application navigation object
 */
const SignUpFrom = ({navigation}) => {
  const userInfo = {
    email: '',
    password: '',
    confirmPassword: '',
  };
  const {storeToken} = useContext(AuthContext);

  const createUser = async values => {
    try {
      const response = await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );
      console.log(response);

      const idTokenResult = await auth().currentUser.getIdTokenResult();
      await storeToken(idTokenResult);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={values => {
        createUser(values)
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
            <InputField
              value={values.password}
              onBlur={handleBlur('password')}
              placeholder={passwordPlaceholder}
              secureTextEntry
              errorMessage={touched.password ? errors.password : null}
              onChangeText={handleChange('password')}
            />
            <InputField
              value={values.confirmPassword}
              onBlur={handleBlur('confirmPassword')}
              placeholder={confirmPassword}
              secureTextEntry
              errorMessage={touched.password ? errors.confirmPassword : null}
              onChangeText={handleChange('confirmPassword')}
            />
            <View style={styles.buttonContainer}>
              <ContainButton title={title} onPress={handleSubmit} />
            </View>
          </>
        );
      }}
    </Formik>
  );
};

export default SignUpFrom;

const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    marginTop: 20,
  },
});
