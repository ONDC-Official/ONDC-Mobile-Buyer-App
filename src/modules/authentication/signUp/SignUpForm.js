import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {strings} from '../../../locales/i18n';
import ContainButton from '../../../components/button/ContainButton';
import InputField from '../../../components/input/InputField';
import {appStyles} from '../../../styles/styles';

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

  return (
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={() => {
        navigation.navigate('Login');
      }}>
      {({values, errors, handleChange, handleBlur, touched, handleSubmit}) => {
        return (
          <View style={[appStyles.container, styles.container]}>
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
          </View>
        );
      }}
    </Formik>
  );
};

export default SignUpFrom;

const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignItems: 'center'},
  buttonContainer: {
    width: 300,
    marginVertical: 20,
  },
});
