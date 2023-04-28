import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {addressTags, validationSchema} from '../utils/addValidationSchema';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import InputField from '../../../../components/input/InputField';
import {Button, Chip, HelperText, Text, withTheme} from 'react-native-paper';
import {appStyles} from '../../../../styles/styles';
import React, {useState} from 'react';
import {
  BASE_URL,
  GET_GPS_CORDS,
  GET_LATLONG,
} from '../../../../utils/apiUtilities';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {getData} from '../../../../utils/api';
import {useSelector} from 'react-redux';
import {showToastWithGravity} from '../../../../utils/utils';

const AddressForm = ({
  theme,
  addressInfo,
  apiInProgress,
  saveAddress,
  setLatitude,
  setLongitude,
}) => {
  const {token} = useSelector(({authReducer}) => authReducer);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const {handleApiError} = useNetworkErrorHandling();

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
      setRequestInProgress(false);
    } catch (error) {
      setFieldValue('city', null);
      setFieldValue('state', null);
      showToastWithGravity('Pin code is invalid');
      console.log(error);
      handleApiError(error);
      setRequestInProgress(false);
    }
  };

  const renderLabel = label => {};

  return (
    <KeyboardAwareScrollView>
      <Formik
        initialValues={addressInfo}
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
                required={true}
                label={'Name'}
                placeholder={'Name'}
                errorMessage={touched.name ? errors.name : null}
                onChangeText={handleChange('name')}
              />
              <InputField
                value={values.email}
                onBlur={handleBlur('email')}
                required={true}
                label={'Email'}
                placeholder={'Email'}
                errorMessage={touched.email ? errors.email : null}
                onChangeText={handleChange('email')}
              />
              <InputField
                keyboardType={'numeric'}
                maxLength={10}
                value={values.number}
                required={true}
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
                    required={true}
                    placeholder={'Pin code'}
                    errorMessage={touched.pin ? errors.pin : null}
                    onChangeText={e => {
                      setFieldValue('pin', e);
                      console.log(e);
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
                required={true}
                label={'Full Address'}
                placeholder={'Full Address'}
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
                required={true}
                label={'City'}
                placeholder={'City'}
                errorMessage={touched.city ? errors.city : null}
                onChangeText={handleChange('city')}
              />
              <InputField
                value={values.state}
                onBlur={handleBlur('state')}
                required={true}
                label={'State'}
                placeholder={'State'}
                errorMessage={touched.state ? errors.state : null}
                onChangeText={handleChange('state')}
                editable={false}
              />

              <View style={styles.addressTagContainer}>
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
                <HelperText padding="none" type="error" visible={!!errors?.tag}>
                  {errors?.tag ? errors?.tag : ''}
                </HelperText>
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
    marginTop: 10,
    justifyContent: 'space-between',
  },
  addressTagContainer: {
    marginBottom: 20,
  },
});

export default withTheme(AddressForm);
