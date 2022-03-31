import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import InputField from '../../../components/input/InputField';
import ContainButton from '../../../components/button/ContainButton';
import {StyleSheet, View} from 'react-native';
import {appStyles} from '../../../styles/Styles';
import {strings} from '../../../locales/i18n';

const emailPlaceholder = strings('authentication.login.email_placeholder');
const passwordPlaceholder = strings(
  'authentication.login.password_placeholder',
);
const requiredField = strings('errors.required');
const shortPassword = strings('errors.short_password');
const invalidEmail = strings('errors.invalid_email');
const title = strings('authentication.login.button_title');

const validationSchema = Yup.object({
  email: Yup.string().email(invalidEmail).required(requiredField),
  password: Yup.string().trim().min(8, shortPassword).required(requiredField),
});

//TODO: Documentation missing
const LoginForm = () => {
  //TODO: If its a initial value then why we are declaring it in the component?
  const userInfo = {
    email: '',
    password: '',
  };

  return (
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={() => {
        console.log('button pressed');
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
            <View style={styles.buttonContainer}>
              <ContainButton title={title} onPress={handleSubmit} />
            </View>
          </View>
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
    marginVertical: 20,
  },
});
