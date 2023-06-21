import {Formik} from 'formik';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, withTheme} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import * as Yup from 'yup';

import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {postData} from '../../../utils/api';
import {BASE_URL, RAISE_COMPLAINT} from '../../../utils/apiUtilities';
import InputField from '../../../components/input/InputField';
import {appStyles} from '../../../styles/styles';
import {showInfoToast} from '../../../utils/utils';

const validationSchema = Yup.object({
  firstName: Yup.string().trim().required('First Name is required'),
  lastName: Yup.string().trim().required('Last Name is required'),
  contactNumber: Yup.string()
    .trim()
    .matches(/^[6-9]{1}[0-9]{9}$/, 'Please enter a valid Mobile Number')
    .required('Mobile Number is required'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid Email')
    .required('Email is required'),
  issueType: Yup.string().trim().required('Issue Type is required'),
  issueDescription: Yup.string().trim().required('Issue Description is required'),
});

/**
 * Component to render form in add new address screen
 * @param navigation: required: to navigate to the respective screen
 * @param theme:application theme
 * @param params
 * @constructor
 * @returns {JSX.Element}
 */
const RaiseComplaint = ({navigation, theme, route: {params}}) => {
  const {token} = useSelector(({authReducer}) => authReducer);

  const {handleApiError} = useNetworkErrorHandling();

  const [apiInProgress, setApiInProgress] = useState(false);

  let userInfo = {
    firstName: '',
    lastName: '',
    middleName: '',
    contactNumber: '',
    email: '',
    issueType: '',
    issueDescription: '',
    orderId: params.orderId,
  };

  /**
   * Function is used to raise complaint
   * @param values:object containing user inputs
   * @returns {Promise<void>}
   **/
  const raiseComplaint = async values => {
    try {
      setApiInProgress(true);
      await postData(`${BASE_URL}${RAISE_COMPLAINT}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showInfoToast('Complaint raised successfully');
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
          raiseComplaint(values)
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
            <View style={styles.formContainer}>
              <InputField
                value={values.firstName}
                onBlur={handleBlur('firstName')}
                required={true}
                label={'First Name'}
                placeholder={'First name'}
                errorMessage={touched.firstName ? errors.firstName : null}
                onChangeText={handleChange('firstName')}
              />
              <InputField
                value={values.middleName}
                onBlur={handleBlur('middleName')}
                label={'Middle Name'}
                placeholder={'Middle name'}
                errorMessage={touched.middleName ? errors.middleName : null}
                onChangeText={handleChange('middleName')}
              />
              <InputField
                value={values.lastName}
                onBlur={handleBlur('lastName')}
                required={true}
                label={'Last Name'}
                placeholder={'Last name'}
                errorMessage={touched.lastName ? errors.lastName : null}
                onChangeText={handleChange('lastName')}
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
                value={values.contactNumber}
                onBlur={handleBlur('contactNumber')}
                required={true}
                label={'Mobile Number'}
                placeholder={'Mobile Number'}
                errorMessage={
                  touched.contactNumber ? errors.contactNumber : null
                }
                onChangeText={handleChange('contactNumber')}
              />

              <InputField
                value={values.street}
                onBlur={handleBlur('issueType')}
                required={true}
                label={'Issue Type'}
                placeholder={'Issue type'}
                errorMessage={touched.issueType ? errors.issueType : null}
                onChangeText={handleChange('issueType')}
              />
              <InputField
                value={values.street}
                onBlur={handleBlur('issueDescription')}
                required={true}
                label={'Issue Description'}
                placeholder={'Issue description'}
                errorMessage={
                  touched.issueDescription ? errors.issueDescription : null
                }
                onChangeText={handleChange('issueDescription')}
              />

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  contentStyle={appStyles.containedButtonContainer}
                  labelStyle={appStyles.containedButtonLabel}
                  onPress={handleSubmit}
                  loading={apiInProgress}
                  disabled={apiInProgress}>
                  Submit
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

export default withTheme(RaiseComplaint);

const styles = StyleSheet.create({
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
});
