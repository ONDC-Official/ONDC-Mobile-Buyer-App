import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
// @ts-ignore
import MapplsUIWidgets from 'mappls-search-widgets-react-native';
import MapplsGL from 'mappls-map-react-native';
import {Button} from 'react-native-paper';
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
import {useAppTheme} from '../../../../../utils/theme';
import DropdownField from '../../../../../components/input/DropdownField';
import {useTranslation} from 'react-i18next';

const defaultLocation = [77.057575, 28.683374];

interface AddressForm {
  addressInfo: any;
  apiInProgress: boolean;
  saveAddress: (formData: any) => void;
}

const CancelToken = axios.CancelToken;
const AddressForm: React.FC<AddressForm> = ({
  addressInfo,
  apiInProgress,
  saveAddress,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
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
      if (!!mapAddress) {
        values.city = mapAddress?.city;
        values.areaCode = mapAddress?.pincode;
        values.state = mapAddress?.state;
        values.street = mapAddress.street;
        values.lat = mapAddress?.lat?.toFixed(6);
        values.lng = mapAddress?.lng?.toFixed(6);
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
              submitCount,
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
                  <View style={appStyles.inputContainer}>
                    <InputField
                      inputLabel={t('Address Form.Name')}
                      value={values.name}
                      onBlur={handleBlur('name')}
                      required
                      label={''}
                      placeholder={t('Address Form.Name')}
                      errorMessage={
                        touched.name || submitCount > 0 ? errors.name : null
                      }
                      error={touched.name && errors.name}
                      onChangeText={handleChange('name')}
                      disabled={apiInProgress}
                    />
                  </View>
                  <View style={appStyles.inputContainer}>
                    <InputField
                      value={values.email}
                      onBlur={handleBlur('email')}
                      required
                      inputLabel={t('Address Form.Email')}
                      label={''}
                      placeholder={t('Address Form.Email')}
                      errorMessage={
                        touched.email || submitCount > 0 ? errors.email : null
                      }
                      error={touched.email && errors.email}
                      onChangeText={handleChange('email')}
                      disabled={apiInProgress}
                    />
                  </View>
                  <View style={appStyles.inputContainer}>
                    <InputField
                      keyboardType={'numeric'}
                      maxLength={10}
                      value={values.number}
                      required
                      onBlur={handleBlur('number')}
                      inputLabel={t('Address Form.Mobile Number')}
                      label={''}
                      placeholder={t('Address Form.Mobile Number')}
                      errorMessage={
                        touched.number || submitCount > 0 ? errors.number : null
                      }
                      error={touched.number && errors.number}
                      onChangeText={handleChange('number')}
                      disabled={apiInProgress}
                    />
                  </View>
                  <View style={appStyles.inputContainer}>
                    <InputField
                      value={values.building}
                      onBlur={handleBlur('building')}
                      inputLabel={t('Address Form.Building')}
                      label={''}
                      placeholder={t('Address Form.Building')}
                      errorMessage={
                        touched.building || submitCount > 0
                          ? errors.building
                          : null
                      }
                      error={touched.building && errors.building}
                      onChangeText={handleChange('building')}
                      required
                      disabled={apiInProgress}
                    />
                  </View>
                  <View style={appStyles.inputContainer}>
                    <InputField
                      value={values.street}
                      onBlur={handleBlur('street')}
                      required
                      inputLabel={t('Address Form.Street')}
                      label={''}
                      placeholder={t('Address Form.Street')}
                      errorMessage={
                        touched.street || submitCount > 0 ? errors.street : null
                      }
                      error={touched.street && errors.street}
                      onChangeText={handleChange('street')}
                      disabled
                    />
                  </View>
                  <View style={appStyles.inputContainer}>
                    <View style={styles.row}>
                      <View style={appStyles.container}>
                        <InputField
                          value={values.city}
                          onBlur={handleBlur('city')}
                          required
                          inputLabel={t('Address Form.City')}
                          label={''}
                          placeholder={t('Address Form.City')}
                          errorMessage={
                            touched.city || submitCount > 0 ? errors.city : null
                          }
                          error={touched.city && errors.city}
                          onChangeText={handleChange('city')}
                          disabled
                        />
                      </View>
                      <View style={styles.spacing} />
                      <View style={appStyles.container}>
                        <InputField
                          value={values.areaCode}
                          keyboardType={'numeric'}
                          maxLength={6}
                          onBlur={handleBlur('areaCode')}
                          inputLabel={t('Address Form.Pin Code')}
                          label={''}
                          required
                          placeholder={t('Address Form.Pin Code')}
                          errorMessage={
                            touched.areaCode || submitCount > 0
                              ? errors.areaCode
                              : null
                          }
                          error={touched.areaCode && errors.areaCode}
                          disabled
                        />
                      </View>
                    </View>
                  </View>
                  <View style={appStyles.inputContainer}>
                    <InputField
                      value={values.state}
                      onBlur={handleBlur('state')}
                      required
                      inputLabel={t('Address Form.State')}
                      label={''}
                      placeholder={t('Address Form.State')}
                      errorMessage={
                        touched.state || submitCount > 0 ? errors.state : null
                      }
                      error={touched.state && errors.state}
                      onChangeText={handleChange('state')}
                      disabled
                    />
                  </View>
                  <View style={appStyles.inputContainer}>
                    <View style={styles.addressTagContainer}>
                      <DropdownField
                        inputLabel={t('Address Form.Address Type')}
                        name="tag"
                        value={values.tag}
                        setValue={(newValue: any) =>
                          setFieldValue('tag', newValue)
                        }
                        label=""
                        required
                        placeholder={t('Address Form.Address Type')}
                        error={!!touched.tag && !!errors.tag}
                        errorMessage={touched.tag ? errors.tag : null}
                        list={addressTags.map((one: string) => {
                          return {
                            label: one,
                            value: one,
                          };
                        })}
                      />
                    </View>
                  </View>

                  <Button
                    mode="contained"
                    style={styles.button}
                    contentStyle={appStyles.containedButtonContainer}
                    onPress={() => handleSubmit()}
                    loading={apiInProgress}
                    disabled={apiInProgress}>
                    {t('Address Form.Save')}
                  </Button>
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
        searchWidgetProps={styles.searchWidgetProps}
        resultCallback={(res: any) => {
          setMapAddress(res);
        }}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    mapContainer: {flex: 1},
    spacing: {
      width: 20,
    },
    row: {
      flexDirection: 'row',
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
      marginTop: 12,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchWidgetProps: {backgroundColor: '#F0FFF0'},
    button: {
      borderRadius: 8,
    },
  });

export default AddressForm;
