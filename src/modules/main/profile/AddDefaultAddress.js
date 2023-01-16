import {Formik} from 'formik';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Avatar, withTheme} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {getData, postData} from '../../../utils/api';
import {ADD_ADDRESS, BASE_URL, GET_GPS_CORDS, GET_LATLONG, SERVER_URL,} from '../../../utils/apiUtilities';
import InputField from '../../../components/input/InputField';
import ContainButton from '../../../components/button/ContainButton';
import {appStyles} from '../../../styles/styles';
import {getUserInitials} from '../../../utils/utils';
import {setStoredData} from "../../../utils/storage";
import {useSelector} from "react-redux";

/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const AddDefaultAddress = ({navigation, theme, route: {params}}) => {
  const {t} = useTranslation();
  const validationSchema = Yup.object({
    name: Yup.string().trim().required(t('errors.required')),
    email: Yup.string()
      .trim()
      .email(t('errors.invalid_email'))
      .required(t('errors.required')),
    number: Yup.string()
      .trim()
      .matches(/^[6-9]{1}[0-9]{9}$/, t('errors.invalid_number'))
      .required(t('errors.required')),
    city: Yup.string().trim().required(t('errors.required')),
    state: Yup.string().trim().required(t('errors.required')),
    pin: Yup.string()
      .trim()
      .matches(/^[1-9]{1}[0-9]{5}$/, t('errors.invalid_pin'))
      .required(t('errors.required')),
    landMark: Yup.string().trim().required(t('errors.required')),
    street: Yup.string().trim().required(t('errors.required')),
  });

  const {token, name, emailId, photoURL} = useSelector(({authReducer}) => authReducer);

  const {handleApiError} = useNetworkErrorHandling();

  const [apiInProgress, setApiInProgress] = useState(false);

  const [requestInProgress, setRequestInProgress] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  let userInfo = {
    email: emailId,
    name: name,
    number: '',
    city: '',
    state: '',
    pin: '',
    landMark: '',
    street: '',
  };

  const getState = async (e, setFieldValue) => {
    try {
      setRequestInProgress(true);
      const {data} = await getData(`${BASE_URL}${GET_GPS_CORDS}${e}`);
      const response = await getData(
        `${BASE_URL}${GET_LATLONG}${data.copResults.eLoc}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.latitude && response.data.longitude) {
        setLatitude(response.data.latitude);
        setLongitude(response.data.longitude);
      }
      setFieldValue('state', data.copResults.state);
      setFieldValue('city', data.copResults.city);
      setApiInProgress(false);
    } catch (error) {
      handleApiError(error);
      setApiInProgress(false);
    }
  };

  /**
   * Function is used to save new address
   * @param values:object containing user inputs
   * @returns {Promise<void>}
   **/
  const saveAddress = async values => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const payload = {
      descriptor: {
        name: values.name,
        email: values.email,
        phone: values.number,
      },
      gps: `${latitude},${longitude}`,
      defaultAddress: true,
      address: {
        areaCode: values.pin,
        city: values.city,
        locality: values.landMark,
        state: values.state,
        street: values.street,
        country: 'IND',
      },
    };

    try {
      setApiInProgress(true);
      let url = `${SERVER_URL}${ADD_ADDRESS}`;

      const {data} = await postData(url, payload, options);
      if (!params) {
        await setStoredData('address', JSON.stringify(data));
      }
      setApiInProgress(false);

      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
    } catch (error) {
      handleApiError(error);
      setApiInProgress(false);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={appStyles.backgroundWhite}>
      <View style={styles.imageContainer}>
        {photoURL ? (
          <Avatar size={64} rounded source={{uri: photoURL}} />
        ) : (
          <Avatar
            size={64}
            rounded
            title={getUserInitials(name ?? '')}
            containerStyle={{backgroundColor: theme.colors.accentColor}}
          />
        )}
      </View>
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={values => {
          saveAddress(values)
            .then(() => {})
            .catch(err => {
              console.log(err);
            });
        }}>
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          touched,
          handleSubmit,
          setFieldValue,
          setFieldError,
        }) => {
          return (
            <View style={styles.formContainer}>
              <InputField
                value={values.name}
                onBlur={handleBlur('name')}
                label={t('main.cart.name')}
                placeholder={t('main.cart.name')}
                errorMessage={touched.name ? errors.name : null}
                onChangeText={handleChange('name')}
              />
              <InputField
                value={values.email}
                onBlur={handleBlur('email')}
                label={t('main.cart.email')}
                placeholder={t('main.cart.email')}
                errorMessage={touched.email ? errors.email : null}
                onChangeText={handleChange('email')}
              />
              <InputField
                keyboardType={'numeric'}
                maxLength={10}
                value={values.number}
                onBlur={handleBlur('number')}
                label={t('main.cart.number')}
                placeholder={t('main.cart.number')}
                errorMessage={touched.number ? errors.number : null}
                onChangeText={handleChange('number')}
              />
              <InputField
                value={values.pin}
                keyboardType={'numeric'}
                maxLength={6}
                onBlur={handleBlur('pin')}
                label={t('main.cart.pin')}
                placeholder={t('main.cart.pin')}
                errorMessage={touched.pin ? errors.pin : null}
                onChangeText={e => {
                  setFieldValue('pin', e);
                  if (e.length === 6 && e.match(/^[1-9]{1}[0-9]{5}$/)) {
                    setRequestInProgress(true);
                    getState(e, setFieldValue, setFieldError)
                      .then(() => {
                        setRequestInProgress(false);
                      })
                      .catch(() => {
                        setRequestInProgress(false);
                      });
                  }
                }}
                rightIcon={requestInProgress ? <ActivityIndicator /> : null}
              />
              <InputField
                value={values.street}
                onBlur={handleBlur('street')}
                label={t('main.cart.street')}
                placeholder={t('main.cart.street')}
                errorMessage={touched.street ? errors.street : null}
                onChangeText={handleChange('street')}
              />
              <InputField
                value={values.landMark}
                onBlur={handleBlur('landMark')}
                label={t('main.cart.landMark')}
                placeholder={t('main.cart.landMark')}
                errorMessage={touched.landMark ? errors.landMark : null}
                onChangeText={handleChange('landMark')}
              />
              <InputField
                value={values.city}
                onBlur={handleBlur('city')}
                label={t('main.cart.city')}
                placeholder={t('main.cart.city')}
                errorMessage={touched.city ? errors.city : null}
                onChangeText={handleChange('city')}
              />
              <InputField
                value={values.state}
                onBlur={handleBlur('state')}
                label={t('main.cart.state')}
                placeholder={t('main.cart.state')}
                errorMessage={touched.state ? errors.state : null}
                onChangeText={handleChange('state')}
                editable={false}
              />

              <View style={styles.buttonContainer}>
                <ContainButton
                  title={t('main.cart.save')}
                  onPress={handleSubmit}
                  loading={apiInProgress}
                  disabled={apiInProgress}
                />
              </View>
            </View>
          );
        }}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

export default withTheme(AddDefaultAddress);

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    width: 300,
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  containerStyle: {marginBottom: 20, elevation: 6, borderRadius: 8},
  formContainer: {
    marginTop: 16,
    width: 300,
    alignSelf: 'center',
  },
});
