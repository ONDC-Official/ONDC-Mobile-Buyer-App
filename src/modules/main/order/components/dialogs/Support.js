import {Formik} from 'formik';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as Yup from 'yup';
import InputField from '../../../../../components/input/InputField';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {postData} from '../../../../../utils/api';
import {BASE_URL, CALL} from '../../../../../utils/apiUtilities';
import {showToastWithGravity} from '../../../../../utils/utils';
import {useSelector} from 'react-redux';
import {Button, Dialog, Text, withTheme} from 'react-native-paper';

const userInfo = {
  number: '',
};

/**
 * Component is used to display dialogue when user clicks on call icon
 * @param theme: application theme
 * @param item:single order object
 * @param modalVisible:boolean indicates visibility of dialogue
 * @param setModalVisible:function to set visibility of dialogue
 * @returns {JSX.Element}
 * @constructor
 */
const Support = ({modalVisible, setModalVisible, sellerInfo, theme}) => {
  const {handleApiError} = useNetworkErrorHandling();
  const {token} = useSelector(({authReducer}) => authReducer);

  const [callInProgress, setCallInProgress] = useState(false);

  const validationSchema = Yup.object({
    number: Yup.string()
      .trim()
      .matches(/^[6-9]{1}[0-9]{9}$/, 'Invalid number')
      .required('This field is required'),
  });

  /**
   * Component is used to handle click event of call me button
   * @param number:number entered by uder
   * @returns {Promise<void>}
   */
  const requestCall = async number => {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setCallInProgress(true);
      const {data} = await postData(
        `${BASE_URL}${CALL}`,

        {
          customer_phone_number: `+91${number}`,
          seller_phone_number: `+91${sellerInfo.phone}`,
        },
        options,
      );
      if (data.hasOwnProperty('error')) {
        showToastWithGravity(data.error.message);
      } else {
        setCallInProgress(false);
        setModalVisible(false);
        showToastWithGravity('Call is placed');
      }
    } catch (error) {
      handleApiError(error);
      setCallInProgress(false);
    }
  };

  return (
    <Dialog visible={modalVisible} style={styles.container}>
      <Dialog.Title>ONDC Support</Dialog.Title>

      <Text style={styles.messageContainer}>
        Enter the phone number on which you want us to call
      </Text>

      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={values => {
          requestCall(values.number)
            .then(() => {})
            .catch(() => {});
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
                keyboardType={'numeric'}
                maxLength={10}
                numberOfLines={1}
                value={values.number}
                onBlur={handleBlur('number')}
                placeholder={'Enter the phone number'}
                errorMessage={touched.number ? errors.number : null}
                onChangeText={handleChange('number')}
                disabled={callInProgress}
              />
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button
                    mode="outlined"
                    onPress={() => setModalVisible(false)}
                    disabled={callInProgress}>
                    Cancel
                  </Button>
                </View>
                <View style={styles.button}>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={callInProgress}
                    disabled={callInProgress}>
                    Call me
                  </Button>
                </View>
              </View>
            </View>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default withTheme(Support);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'flex-end',
  },
  formContainer: {
    padding: 10,
  },
  messageContainer: {padding: 10},
  button: {marginLeft: 8},
});
