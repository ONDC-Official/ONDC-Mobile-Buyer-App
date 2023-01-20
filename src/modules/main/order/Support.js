import {Formik} from 'formik';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import InputField from '../../../components/input/InputField';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {postData} from '../../../utils/api';
import {CALL, BASE_URL} from '../../../utils/apiUtilities';
import {showToastWithGravity} from '../../../utils/utils';
import {useSelector} from 'react-redux';
import {Button, Text} from 'react-native-paper';

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
  const {colors} = theme;
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
      console.log('requestCall', error);
      handleApiError(error);
      setCallInProgress(false);
    }
  };

  return (
    <View style={styles.centeredView}>
      <Dialog isVisible={modalVisible} overlayStyle={styles.overlayStyle}>
        <View style={styles.container}>
          <Text style={styles.heading}>ONDC SUPPORT</Text>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.close}>
            <Icon name="close-thick" color={colors.primary} size={16} />
          </TouchableOpacity>
        </View>
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
              <>
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
              </>
            );
          }}
        </Formik>
      </Dialog>
    </View>
  );
};

export default withTheme(Support);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'flex-end',
  },
  close: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 50,
    alignSelf: 'flex-end',
  },
  overlayStyle: {
    borderRadius: 10,
    width: '90%',
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  heading: {fontSize: 18},
  messageContainer: {padding: 10},
  button: {width: 90, marginHorizontal: 8},
});
