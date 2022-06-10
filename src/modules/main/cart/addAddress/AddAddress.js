import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, withTheme} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import ContainButton from '../../../../components/button/ContainButton';
import InputField from '../../../../components/input/InputField';
import {Context as AuthContext} from '../../../../context/Auth';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../../locales/i18n';
import {appStyles} from '../../../../styles/styles';
import {postData} from '../../../../utils/api';
import {
  ADD_ADDRESS,
  BASE_URL,
  BILLING_ADDRESS,
  UPDATE_ADDRESS,
  UPDATE_BILLING_ADDRESS,
} from '../../../../utils/apiUtilities';
import Header from '../addressPicker/Header';

const invalidNumber = strings('errors.invalid_number');
const invalidPin = strings('errors.invalid_pin');
const requiredField = strings('errors.required');
const invalidEmail = strings('errors.invalid_email');
const addAddress = strings('main.cart.add_address');
const emailPlaceholder = strings('main.cart.email');
const namePlaceholder = strings('main.cart.name');
const cityPlaceholder = strings('main.cart.city');
const statePlaceholder = strings('main.cart.state');
const numberPlaceholder = strings('main.cart.number');
const pinPlaceholder = strings('main.cart.pin');
const streetPlaceholder = strings('main.cart.street');
const landMartPlaceholder = strings('main.cart.landMark');
const buttonTitle = strings('main.cart.next');

const validationSchema = Yup.object({
  name: Yup.string().trim().required(requiredField),
  email: Yup.string().trim().email(invalidEmail).required(requiredField),
  number: Yup.string()
    .trim()
    .matches(/^[6-9]{1}[0-9]{9}$/, invalidNumber)
    .required(requiredField),
  city: Yup.string().trim().required(requiredField),
  state: Yup.string().trim().required(requiredField),
  pin: Yup.string()
    .trim()
    .matches(/^[1-9]{1}[0-9]{5}$/, invalidPin)
    .required(requiredField),
  landMark: Yup.string().trim().required(requiredField),
  street: Yup.string().trim().required(requiredField),
});

/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @constructor
 * @returns {JSX.Element}
 */
const AddAddress = ({navigation, theme, route: {params}}) => {
  const {colors} = theme;
  const {
    state: {token},
  } = useContext(AuthContext);
  const {handleApiError} = useNetworkErrorHandling();
  const [apiInProgress, setApiInProgress] = useState(false);
  const {selectedAddress, item} = params;

  const userInfo = item
    ? {
      email:
        selectedAddress === 'address' ? item.descriptor.email : item.email,
      name: selectedAddress === 'address' ? item.descriptor.name : item.name,
      number:
        selectedAddress === 'address' ? item.descriptor.phone : item.phone,
      city:
        selectedAddress === 'address' ? item.address.city : item.address.city,
      state:
        selectedAddress === 'address'
          ? item.address.state
          : item.address.state,
      pin:
        selectedAddress === 'address'
          ? item.address.areaCode
          : item.address.areaCode,
      landMark:
        selectedAddress === 'address'
          ? item.address.locality
          : item.address.locality,
      street:
        selectedAddress === 'address'
          ? item.address.street
          : item.address.street,
    }
    : {
      email: '',
      name: '',
      number: '',
      city: '',
      state: '',
      pin: '',
      landMark: '',
      street: '',
    };

  /**
   * Function is used to save new address
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
          gps: '',
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
            ? `${BASE_URL}${UPDATE_ADDRESS}${item.id}`
            : `${BASE_URL}${UPDATE_BILLING_ADDRESS}${item.id}`;
      } else {
        url =
          selectedAddress === 'address'
            ? `${BASE_URL}${ADD_ADDRESS}`
            : `${BASE_URL}${BILLING_ADDRESS}`;
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
    <View
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <Header
        title={item ? 'Update Address' : addAddress}
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
              }) => {
              return (
                <>
                  <InputField
                    value={values.name}
                    onBlur={handleBlur('name')}
                    placeholder={namePlaceholder}
                    errorMessage={touched.name ? errors.name : null}
                    onChangeText={handleChange('name')}
                  />
                  <InputField
                    value={values.email}
                    onBlur={handleBlur('email')}
                    placeholder={emailPlaceholder}
                    errorMessage={touched.email ? errors.email : null}
                    onChangeText={handleChange('email')}
                  />
                  <InputField
                    keyboardType={'numeric'}
                    maxLength={10}
                    value={values.number}
                    onBlur={handleBlur('number')}
                    placeholder={numberPlaceholder}
                    errorMessage={touched.number ? errors.number : null}
                    onChangeText={handleChange('number')}
                  />
                  <InputField
                    value={values.street}
                    onBlur={handleBlur('street')}
                    placeholder={streetPlaceholder}
                    errorMessage={touched.street ? errors.street : null}
                    onChangeText={handleChange('street')}
                  />
                  <InputField
                    value={values.landMark}
                    onBlur={handleBlur('landMark')}
                    placeholder={landMartPlaceholder}
                    errorMessage={touched.landMark ? errors.landMark : null}
                    onChangeText={handleChange('landMark')}
                  />
                  <InputField
                    value={values.city}
                    onBlur={handleBlur('city')}
                    placeholder={cityPlaceholder}
                    errorMessage={touched.city ? errors.city : null}
                    onChangeText={handleChange('city')}
                  />
                  <InputField
                    value={values.state}
                    onBlur={handleBlur('state')}
                    placeholder={statePlaceholder}
                    errorMessage={touched.state ? errors.state : null}
                    onChangeText={handleChange('state')}
                  />
                  <InputField
                    value={values.pin}
                    keyboardType={'numeric'}
                    maxLength={6}
                    onBlur={handleBlur('pin')}
                    placeholder={pinPlaceholder}
                    errorMessage={touched.pin ? errors.pin : null}
                    onChangeText={handleChange('pin')}
                  />

                  <View style={styles.buttonContainer}>
                    <ContainButton
                      title={item ? 'UPDATE' : buttonTitle}
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
