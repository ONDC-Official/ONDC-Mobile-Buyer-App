import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
// @ts-ignore
import MapplsUIWidgets from 'mappls-search-widgets-react-native';
import MapplsGL from 'mappls-map-react-native';
import {Button, Chip, HelperText, Text, withTheme} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import axios from 'axios';
import {addressTags, validationSchema} from '../../utils/addValidationSchema';
import InputField from '../../../../../components/input/InputField';
import {appStyles} from '../../../../../styles/styles';
import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {API_BASE_URL, MAP_ACCESS_TOKEN} from '../../../../../utils/apiActions';

import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import Config from '../../../../../../config';

const defaultLocation = [77.057575, 28.6833740000001];

interface AddressForm {
  theme: any;
  addressInfo: any;
  apiInProgress: boolean;
  saveAddress: (formData: any) => void;
}

const CancelToken = axios.CancelToken;
const AddressForm: React.FC<AddressForm> = ({
  theme: theme,
  addressInfo,
  apiInProgress,
  saveAddress,
}) => {
  const source = useRef<any>(null);
  const [formValues, setFormValues] = useState<any>(addressInfo);
  const [mapAddress, setMapAddress] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getMapMeta = async () => {
    try {
      setLoading(true);
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${MAP_ACCESS_TOKEN}`,
        source.current.token,
      );
      MapplsGL.setMapSDKKey(data.access_token);
      MapplsGL.setRestAPIKey(data.access_token);
      MapplsGL.setAtlasClientId(data.client_id);
      MapplsGL.setAtlasClientSecret(Config.MMMI_CLIENT_SECRET);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMapMeta().then(() => {});
  }, []);

  useEffect(() => {
    if (addressInfo) {
      let values = addressInfo;
      if (mapAddress) {
        values.city = mapAddress.city;
        values.areaCode = mapAddress.pincode;
        values.state = mapAddress.state;
        values.street = mapAddress.street;
        values.lat = mapAddress.lat;
        values.lng = mapAddress.lng;
      }
      setFormValues(values);
    }
  }, [addressInfo, mapAddress]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={'large'} color={theme.colors.primary} />
      </View>
    );
  }

  if (mapAddress) {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <Formik
            enableReinitialize
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={values => saveAddress(values)}>
            {({
              values,
              errors,
              handleChange,
              handleBlur,
              touched,
              handleSubmit,
              setFieldValue,
            }) => {
              return (
                <View style={styles.formContainer}>
                  <InputField
                    value={values.name}
                    onBlur={handleBlur('name')}
                    required
                    label={'Name'}
                    placeholder={'Name'}
                    errorMessage={touched.name ? errors.name : null}
                    onChangeText={handleChange('name')}
                    disabled={apiInProgress}
                  />
                  <InputField
                    value={values.email}
                    onBlur={handleBlur('email')}
                    required
                    label={'Email'}
                    placeholder={'Email'}
                    errorMessage={touched.email ? errors.email : null}
                    onChangeText={handleChange('email')}
                    disabled={apiInProgress}
                  />
                  <InputField
                    keyboardType={'numeric'}
                    maxLength={10}
                    value={values.number}
                    required
                    onBlur={handleBlur('number')}
                    label={'Mobile Number'}
                    placeholder={'Mobile Number'}
                    errorMessage={touched.number ? errors.number : null}
                    onChangeText={handleChange('number')}
                    disabled={apiInProgress}
                  />
                  <InputField
                    value={values.building}
                    onBlur={handleBlur('building')}
                    label={'Building'}
                    placeholder={'Building'}
                    errorMessage={touched.building ? errors.building : null}
                    onChangeText={handleChange('building')}
                    required
                    disabled={apiInProgress}
                  />

                  <InputField
                    value={values.street}
                    onBlur={handleBlur('street')}
                    required
                    label={'Street'}
                    placeholder={'Street'}
                    errorMessage={touched.street ? errors.street : null}
                    onChangeText={handleChange('street')}
                    disabled
                  />
                  <View style={styles.row}>
                    <View style={appStyles.container}>
                      <InputField
                        value={values.areaCode}
                        keyboardType={'numeric'}
                        maxLength={6}
                        onBlur={handleBlur('areaCode')}
                        label={'Pin Code'}
                        required
                        placeholder={'Pin Code'}
                        errorMessage={touched.areaCode ? errors.areaCode : null}
                        disabled
                      />
                    </View>
                    <View style={styles.spacing} />
                    <View style={appStyles.container}>
                      <InputField
                        value={values.city}
                        onBlur={handleBlur('city')}
                        required
                        label={'City'}
                        placeholder={'City'}
                        errorMessage={touched.city ? errors.city : null}
                        onChangeText={handleChange('city')}
                        disabled
                      />
                    </View>
                  </View>
                  <InputField
                    value={values.state}
                    onBlur={handleBlur('state')}
                    required
                    label={'State'}
                    placeholder={'State'}
                    errorMessage={touched.state ? errors.state : null}
                    onChangeText={handleChange('state')}
                    disabled
                  />

                  <View style={styles.addressTagContainer}>
                    <Text>
                      Address Type
                      <Text style={{color: theme.colors.red}}> *</Text>
                    </Text>
                    <View style={styles.tagContainer}>
                      {addressTags.map(tag => (
                        <Chip
                          key={tag}
                          selectedColor={theme.colors.primary}
                          mode={values.tag === tag ? 'flat' : 'outlined'}
                          onPress={() => setFieldValue('tag', tag)}>
                          {tag}
                        </Chip>
                      ))}
                    </View>
                    <HelperText
                      padding="none"
                      type="error"
                      visible={!!errors?.tag}>
                      {errors.tag}
                    </HelperText>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      contentStyle={appStyles.containedButtonContainer}
                      labelStyle={appStyles.containedButtonLabel}
                      onPress={() => handleSubmit()}
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
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapplsUIWidgets.PlacePicker
        center={
          addressInfo && addressInfo.lng
            ? [Number(addressInfo.lng), Number(addressInfo.lat)]
            : defaultLocation
        }
        zoom={10}
        searchWidgetProps={{backgroundColor: '#F0FFF0'}}
        resultCallback={(res: any) => {
          setMapAddress(res);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {flex: 1},
  spacing: {
    width: 20,
  },
  row: {
    flexDirection: 'row',
  },
  buttonContainer: {
    alignSelf: 'center',
  },
  formContainer: {
    alignSelf: 'center',
    padding: 16,
    width: '100%',
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  addressTagContainer: {
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTheme(AddressForm);
