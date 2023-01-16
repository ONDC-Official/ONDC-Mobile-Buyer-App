import {Formik} from 'formik';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';
import {Card, withTheme} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import ContainButton from '../../../../components/button/ContainButton';
import InputField from '../../../../components/input/InputField';

import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {getData, postData} from '../../../../utils/api';
import {
  ADD_ADDRESS,
  BASE_URL,
  BILLING_ADDRESS,
  GET_GPS_CORDS,
  GET_LATLONG,
  SERVER_URL,
  UPDATE_ADDRESS,
  UPDATE_BILLING_ADDRESS,
} from '../../../../utils/apiUtilities';
import Header from '../addressPicker/Header';
import {useSelector} from 'react-redux';

/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const AddAddress = ({navigation, theme, route: {params}}) => {
  const {colors} = theme;

  const {t} = useTranslation();

  const {token} = useSelector(({authReducer}) => authReducer);

  const {handleApiError} = useNetworkErrorHandling();

  const [apiInProgress, setApiInProgress] = useState(false);

  const [requestInProgress, setRequestInProgress] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const {selectedAddress, item} = params;

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

  let userInfo = {
    email: '',
    name: '',
    number: '',
    city: '',
    state: '',
    pin: '',
    landMark: '',
    street: '',
  };

  if (item) {
    if (selectedAddress === 'address') {
      userInfo = {
        email: item.descriptor.email,
        name: item.descriptor.name,
        number: item.descriptor.phone,
        city: item.address.city,
        state: item.address.state,
        pin: item.address.areaCode,
        landMark: item.address.locality
          ? item.address.locality
          : item.address.door,
        street: item.address.street,
      };
    } else {
      userInfo = {
        email: item.email,
        name: item.name,
        number: item.phone,
        city: item.address.city,
        state: item.address.state,
        pin: item.address.areaCode,
        landMark: item.address.locality
          ? item.address.locality
          : item.address.door,
        street: item.address.street,
      };
    }
  }

  const getState = async (e, setFieldValue, setFieldError) => {
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
    const payload =
      selectedAddress === 'address'
        ? {
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
          }
        : {
            address: {
              areaCode: values.pin,
              city: values.city,
              locality: values.landMark,
              state: values.state,
              street: values.street,
              country: 'IND',
            },
            name: values.name,
            email: values.email,
            phone: values.number,
          };

    try {
      setApiInProgress(true);
      let url;
      if (item) {
        url =
          selectedAddress === 'address'
            ? `${SERVER_URL}${UPDATE_ADDRESS}${item.id}`
            : `${SERVER_URL}${UPDATE_BILLING_ADDRESS}${item.id}`;
      } else {
        url =
          selectedAddress === 'address'
            ? `${SERVER_URL}${ADD_ADDRESS}`
            : `${SERVER_URL}${BILLING_ADDRESS}`;
      }

      await postData(url, payload, options);
      if (selectedAddress === 'address') {
        navigation.navigate('AddressPicker');
      } else {
        navigation.navigate('BillingAddressPicker', {
          selectedAddress: params.selectedAddress,
        });
      }
      setApiInProgress(false);
    } catch (error) {
      handleApiError(error);
      setApiInProgress(false);
    }
  };

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <View
        style={[
          appStyles.container,
          {backgroundColor: colors.backgroundColor},
        ]}>
        <Header
          title={
            item ? t('main.cart.update_address') : t('main.cart.add_address')
          }
          navigation={navigation}
        />
        <KeyboardAwareScrollView>
          <Card containerStyle={styles.containerStyle}>
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
                  <>
                    <InputField
                      value={values.name}
                      onBlur={handleBlur('name')}
                      placeholder={t('main.cart.name')}
                      errorMessage={touched.name ? errors.name : null}
                      onChangeText={handleChange('name')}
                    />
                    <InputField
                      value={values.email}
                      onBlur={handleBlur('email')}
                      placeholder={t('main.cart.email')}
                      errorMessage={touched.email ? errors.email : null}
                      onChangeText={handleChange('email')}
                    />
                    <InputField
                      keyboardType={'numeric'}
                      maxLength={10}
                      value={values.number}
                      onBlur={handleBlur('number')}
                      placeholder={t('main.cart.number')}
                      errorMessage={touched.number ? errors.number : null}
                      onChangeText={handleChange('number')}
                    />
                    <InputField
                      value={values.pin}
                      keyboardType={'numeric'}
                      maxLength={6}
                      onBlur={handleBlur('pin')}
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
                      rightIcon={
                        requestInProgress ? <ActivityIndicator /> : null
                      }
                    />
                    <InputField
                      value={values.street}
                      onBlur={handleBlur('street')}
                      placeholder={t('main.cart.street')}
                      errorMessage={touched.street ? errors.street : null}
                      onChangeText={handleChange('street')}
                    />
                    <InputField
                      value={values.landMark}
                      onBlur={handleBlur('landMark')}
                      placeholder={t('main.cart.landMark')}
                      errorMessage={touched.landMark ? errors.landMark : null}
                      onChangeText={handleChange('landMark')}
                    />
                    <InputField
                      value={values.city}
                      onBlur={handleBlur('city')}
                      placeholder={t('main.cart.city')}
                      errorMessage={touched.city ? errors.city : null}
                      onChangeText={handleChange('city')}
                    />
                    <InputField
                      value={values.state}
                      onBlur={handleBlur('state')}
                      placeholder={t('main.cart.state')}
                      errorMessage={touched.state ? errors.state : null}
                      onChangeText={handleChange('state')}
                      editable={false}
                    />

                    <View style={styles.buttonContainer}>
                      <ContainButton
                        title={
                          item ? t('main.cart.update') : t('main.cart.next')
                        }
                        onPress={handleSubmit}
                        loading={apiInProgress}
                        disabled={apiInProgress}
                      />
                    </View>
                  </>
                );
              }}
            </Formik>
          </Card>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default withTheme(AddAddress);

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    width: 300,
    marginVertical: 20,
  },
  containerStyle: {marginBottom: 20, elevation: 6, borderRadius: 8},
});
