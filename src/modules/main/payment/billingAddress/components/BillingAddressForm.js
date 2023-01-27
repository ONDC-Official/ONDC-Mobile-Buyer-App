import {ActivityIndicator, StyleSheet, View} from "react-native";
import {appStyles} from "../../../../../styles/styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Formik} from "formik";
import InputField from "../../../../../components/input/InputField";
import {Button, withTheme} from "react-native-paper";
import React, {useState} from "react";
import {getData} from "../../../../../utils/api";
import {BASE_URL, GET_GPS_CORDS} from "../../../../../utils/apiUtilities";
import {useSelector} from "react-redux";
import useNetworkErrorHandling from "../../../../../hooks/useNetworkErrorHandling";

const  BillingAddressForm = ({theme, addressInfo, validationSchema, apiInProgress, buttonLabel, saveAddress}) => {
  const [requestInProgress, setRequestInProgress] = useState(false);
  const {handleApiError} = useNetworkErrorHandling();

  const getState = async (e, setFieldValue) => {
    try {
      setRequestInProgress(true);
      const {data} = await getData(`${BASE_URL}${GET_GPS_CORDS}${e}`);
      setFieldValue('state', data.copResults.state);
      setFieldValue('city', data.copResults.city);
      setRequestInProgress(false);
    } catch (error) {
      handleApiError(error);
      setRequestInProgress(false);
    }
  };

  return (
    <View style={appStyles.container}>
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

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    labelStyle={appStyles.containedButtonLabel}
                    contentStyle={appStyles.containedButtonContainer}
                    onPress={handleSubmit}
                    loading={apiInProgress}
                    disabled={apiInProgress}>
                    {buttonLabel}
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
    marginVertical: 20,
  },
  formContainer: {
    marginTop: 8,
    paddingBottom: 20,
    width: 300,
    alignSelf: 'center',
  },
});

export default withTheme(BillingAddressForm);
