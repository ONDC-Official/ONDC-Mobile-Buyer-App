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
 * Component is used to render sign up form
 * @param theme
 * @param navigation: application navigation object
 */
const SignUpFrom = ({navigation}) => {
  const {t} = useTranslation();

  const userInfo = {
    email: '',
    password: '',
    name: '',
  };

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

  const {storeLoginDetails} = useContext(AuthContext);

  const [apiInProgress, setApiInProgress] = useState(false);

  /**
   * function create user with provided the email and password and create and store token in context
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

      const loginDetails = {
        token: idTokenResult.token,
        uid: response.user.uid,
        emailId: response.user.email,
        name: values.name,
        photoURL: 'Unknown',
      };

      await storeLoginDetails(loginDetails);

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
        createUser(values)
          .then(() => {})
          .catch(() => {});
      }}>
      {({values, errors, handleChange, handleBlur, touched, handleSubmit}) => {
        return (
          <>
            <InputField
              value={values.name}
              onBlur={handleBlur('name')}
              placeholder={t('authentication.signup.name_placeholder')}
              errorMessage={touched.name ? errors.name : null}
              onChangeText={handleChange('name')}
            />
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
                title={t('authentication.signup.button_title')}
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

export default SignUpFrom;

const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    marginTop: 20,
  },
});
