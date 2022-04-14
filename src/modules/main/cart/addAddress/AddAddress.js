import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, withTheme} from 'react-native-elements';
import Header from '../addressPicker/Header';
import * as Yup from 'yup';
import {strings} from '../../../../locales/i18n';
import {Formik} from 'formik';
import InputField from '../../../../components/input/InputField';
import ContainButton from '../../../../components/button/ContainButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {appStyles} from '../../../../styles/styles';
import {postData} from '../../../../utils/api';
import {ADD_ADDRESS, BASE_URL} from '../../../../utils/apiUtilities';
import {Context as AuthContext} from '../../../../context/Auth';

const requiredField = strings('errors.required');
const invalidEmail = strings('errors.invalid_email');

const validationSchema = Yup.object({
  name: Yup.string().trim().required(requiredField),
  email: Yup.string().trim().email(invalidEmail).required(requiredField),
  number: Yup.string()
    .trim()
    .matches(/^[6-9]{1}[0-9]{9}$/, 'Invalid number')
    .required(requiredField),
  city: Yup.string().trim().required(requiredField),
  state: Yup.string().trim().required(requiredField),
  pin: Yup.string()
    .trim()
    .matches(/^[1-9]{1}[0-9]{5}$/, 'Invalid pin code ')
    .required(requiredField),
  landMark: Yup.string().trim().required(requiredField),
  street: Yup.string().trim().required(requiredField),
});

const AddAddress = ({navigation, theme}) => {
  const {colors} = theme;
  const {
    state: {token},
  } = useContext(AuthContext);
  const userInfo = {
    email: '',
    name: '',
    number: '',
    city: '',
    state: '',
    pin: '',
    landMark: '',
    street: '',
  };

  const saveAddress = async values => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      console.log(options);
      const {data} = await postData(
        `${BASE_URL}${ADD_ADDRESS}`,
        {
          descriptor: {
            name: '',
            short_desc: '',
          },
          gps: '',
          default: true,
          address: {
            area_code: values.pin,
            city: values.city,
            locality: values.landMark,
            state: values.state,
            street: values.street,
          },
        },
        options,
      );
      navigation.navigate('AddressPicker');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={[appStyles.container, {backgroundColor: colors.white}]}>
      <Header title={'Add Address'} navigation={navigation} />
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
                    placeholder={'Name'}
                    errorMessage={touched.name ? errors.name : null}
                    onChangeText={handleChange('name')}
                  />
                  <InputField
                    value={values.email}
                    onBlur={handleBlur('email')}
                    placeholder={'Email'}
                    errorMessage={touched.email ? errors.email : null}
                    onChangeText={handleChange('email')}
                  />
                  <InputField
                    keyboardType={'numeric'}
                    maxLength={10}
                    value={values.number}
                    onBlur={handleBlur('number')}
                    placeholder={'Number'}
                    errorMessage={touched.number ? errors.number : null}
                    onChangeText={handleChange('number')}
                  />
                  <InputField
                    value={values.street}
                    onBlur={handleBlur('street')}
                    placeholder={'Street'}
                    errorMessage={touched.street ? errors.street : null}
                    onChangeText={handleChange('street')}
                  />
                  <InputField
                    value={values.landMark}
                    onBlur={handleBlur('landMark')}
                    placeholder={'Landmark'}
                    errorMessage={touched.landMark ? errors.landMark : null}
                    onChangeText={handleChange('landMark')}
                  />
                  <InputField
                    value={values.city}
                    onBlur={handleBlur('city')}
                    placeholder={'City'}
                    errorMessage={touched.city ? errors.city : null}
                    onChangeText={handleChange('city')}
                  />
                  <InputField
                    value={values.state}
                    onBlur={handleBlur('state')}
                    placeholder={'State'}
                    errorMessage={touched.state ? errors.state : null}
                    onChangeText={handleChange('state')}
                  />
                  <InputField
                    value={values.pin}
                    keyboardType={'numeric'}
                    maxLength={6}
                    onBlur={handleBlur('pin')}
                    placeholder={'Pin Code'}
                    errorMessage={touched.pin ? errors.pin : null}
                    onChangeText={handleChange('pin')}
                  />

                  <View style={styles.buttonContainer}>
                    <ContainButton title={'Next'} onPress={handleSubmit} />
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
