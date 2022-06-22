import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import * as Yup from 'yup';
import ContainButton from '../../../components/button/ContainButton';
import InputField from '../../../components/input/InputField';
import PasswordField from '../../../components/input/PasswordField';
import {Context as AuthContext} from '../../../context/Auth';
import {showToastWithGravity} from '../../../utils/utils';

/**
 * Component is used to render login form
 * @param navigation:application navigation object
 */
const LoginForm = ({navigation}) => {
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
        name: response.user.displayName ? response.user.displayName : 'Unknown',
        photoURL: response.user.photoURL ? response.user.photoURL : 'Unknown',
      });

      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });

      setApiInProgress(false);
    } catch (error) {
      const message = error.message.replace(/\[.*\]/, '');
      showToastWithGravity(message);
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
              placeholder={t('authentication.login.email_placeholder')}
              errorMessage={touched.email ? errors.email : null}
              onChangeText={handleChange('email')}
            />
            <PasswordField
              value={values.password}
              onBlur={handleBlur('password')}
              placeholder={t('authentication.login.password_placeholder')}
              secureTextEntry
              errorMessage={touched.password ? errors.password : null}
              onChangeText={handleChange('password')}
            />
            <View style={styles.buttonContainer}>
              <ContainButton
                title={t('authentication.login.button_title')}
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
    alignSelf: 'center',
  },
});
