import {Formik} from 'formik';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import {useSelector} from 'react-redux';
import {Button, TextInput, withTheme} from 'react-native-paper';

import InputField from '../../../../components/input/InputField';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {getData, postData} from '../../../../utils/api';
import {
  BASE_URL,
  BILLING_ADDRESS,
  GET_GPS_CORDS,
} from '../../../../utils/apiUtilities';

/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const AddBillingAddress = ({navigation, theme}) => {
  const {handleApiError} = useNetworkErrorHandling();

  const {token, name, emailId} = useSelector(({authReducer}) => authReducer);

  const [apiInProgress, setApiInProgress] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().trim().required('This field is required'),
    email: Yup.string()
      .trim()
      .email('Please enter valid email address')
      .required('This field is required'),
    number: Yup.string()
      .trim()
      .matches(/^[6-9]{1}[0-9]{9}$/, 'Invalid number')
      .required('This field is required'),
    city: Yup.string().trim().required('This field is required'),
    state: Yup.string().trim().required('This field is required'),
    pin: Yup.string()
      .trim()
      .matches(/^[1-9]{1}[0-9]{5}$/, 'Invalid pin code')
      .required('This field is required'),
    landMark: Yup.string().trim().required('This field is required'),
    street: Yup.string().trim().required('This field is required'),
  });

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
      await postData(`${BASE_URL}${BILLING_ADDRESS}`, payload, options);
      navigation.goBack();
      setApiInProgress(false);
    } catch (error) {
      handleApiError(error);
      setApiInProgress(false);
    }
  };

  return (
    <View style={appStyles.container}>
      <KeyboardAwareScrollView>
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
                  label={'Name'}
                  placeholder={'Name'}
                  errorMessage={touched.name ? errors.name : null}
                  onChangeText={handleChange('name')}
                />
                <InputField
                  value={values.email}
                  onBlur={handleBlur('email')}
                  label={'Email'}
                  placeholder={'Email'}
                  errorMessage={touched.email ? errors.email : null}
                  onChangeText={handleChange('email')}
                />
                <InputField
                  keyboardType={'numeric'}
                  maxLength={10}
                  value={values.number}
                  onBlur={handleBlur('number')}
                  label={'Mobile number'}
                  placeholder={'Mobile number'}
                  errorMessage={touched.number ? errors.number : null}
                  onChangeText={handleChange('number')}
                />
                <InputField
                  value={values.pin}
                  keyboardType={'numeric'}
                  maxLength={6}
                  onBlur={handleBlur('pin')}
                  label={'Pin code'}
                  placeholder={'Pin code'}
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
                  right={
                    requestInProgress ? <TextInput.Icon icon="loading" /> : null
                  }
                />
                <InputField
                  value={values.street}
                  onBlur={handleBlur('street')}
                  label={'Street'}
                  placeholder={'Street'}
                  errorMessage={touched.street ? errors.street : null}
                  onChangeText={handleChange('street')}
                />
                <InputField
                  value={values.landMark}
                  onBlur={handleBlur('landMark')}
                  label={'Landmark'}
                  placeholder={'Landmark'}
                  errorMessage={touched.landMark ? errors.landMark : null}
                  onChangeText={handleChange('landMark')}
                />
                <InputField
                  value={values.city}
                  onBlur={handleBlur('city')}
                  label={'City'}
                  placeholder={'City'}
                  errorMessage={touched.city ? errors.city : null}
                  onChangeText={handleChange('city')}
                />
                <InputField
                  value={values.state}
                  onBlur={handleBlur('state')}
                  label={'State'}
                  placeholder={'State'}
                  errorMessage={touched.state ? errors.state : null}
                  onChangeText={handleChange('state')}
                  editable={false}
                />

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    labelStyle={appStyles.containedButtonLabel}
                    contentStyle={appStyles.containedButtonContainer}
                    onPress={handleSubmit}
                    loading={apiInProgress}
                    disabled={apiInProgress}>
                    Add Address
                  </Button>
                </View>
              </View>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default withTheme(AddBillingAddress);

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    width: 300,
    marginVertical: 20,
  },
  containerStyle: {marginBottom: 20, elevation: 6, borderRadius: 8},
  formContainer: {
    marginTop: 8,
    paddingBottom: 20,
    width: 300,
    alignSelf: 'center',
  },
});
