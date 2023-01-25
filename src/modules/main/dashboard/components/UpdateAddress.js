import {Formik} from 'formik';
import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Button, Chip, Text, withTheme} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';

import useNetworkErrorHandling from "../../../../hooks/useNetworkErrorHandling";
import {addressTags, validationSchema} from "../utils/addValidationSchema";
import InputField from "../../../../components/input/InputField";
import {appStyles} from "../../../../styles/styles";
import {BASE_URL, UPDATE_DELIVERY_ADDRESS} from "../../../../utils/apiUtilities";
import {postData} from "../../../../utils/api";


/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const UpdateAddress = ({navigation, theme, route: {params}}) => {
  const {token, name, emailId} = useSelector(({authReducer}) => authReducer);

  const {handleApiError} = useNetworkErrorHandling();

  const [apiInProgress, setApiInProgress] = useState(false);

  const [requestInProgress, setRequestInProgress] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  let userInfo = {
    email: params.address.descriptor.email,
    name: params.address.descriptor.name,
    number: params.address.descriptor.phone,
    city: params.address.address.city,
    state: params.address.address.state,
    pin: params.address.address.areaCode,
    landMark: params.address.address.locality,
    street: params.address.address.street,
    tag: params.address.address.tag,
    defaultAddress: params.address.defaultAddress,
    gps: params.address.gps,
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
      gps: latitude === null ? values.gps : `${latitude},${longitude}`,
      defaultAddress: values.defaultAddress,
      address: {
        areaCode: values.pin,
        city: values.city,
        locality: values.landMark,
        state: values.state,
        street: values.street,
        country: 'IND',
        tag: values.tag,
      },
    };

    try {
      setApiInProgress(true);
      await postData(
        `${BASE_URL}${UPDATE_DELIVERY_ADDRESS}${params.address.id}`,
        payload,
        options,
      );
      setApiInProgress(false);
      navigation.goBack();
    } catch (error) {
      handleApiError(error);
      setApiInProgress(false);
    }
  };

  return (
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

              <View style={styles.row}>
                <View style={styles.inputContainer}>
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
                  />
                </View>
                {requestInProgress && (
                  <View style={styles.indicator}>
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.primary}
                    />
                  </View>
                )}
              </View>
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

              <Text>Select address type</Text>
              <View style={styles.tagContainer}>
                {addressTags.map(tag => (
                  <Chip
                    key={tag}
                    selectedColor={
                      values.tag === tag
                        ? theme.colors.opposite
                        : theme.colors.primary
                    }
                    mode="outlined"
                    onPress={() => setFieldValue('tag', tag)}>
                    {tag}
                  </Chip>
                ))}
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  contentStyle={appStyles.containedButtonContainer}
                  labelStyle={appStyles.containedButtonLabel}
                  onPress={handleSubmit}
                  loading={apiInProgress}
                  disabled={apiInProgress}>
                  Save
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

export default withTheme(UpdateAddress);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 30,
  },
  inputContainer: {
    flexGrow: 1,
  },
  buttonContainer: {
    alignSelf: 'center',
    width: 300,
  },
  formContainer: {
    marginTop: 8,
    paddingBottom: 20,
    width: 300,
    alignSelf: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
    justifyContent: 'space-between',
  },
});
