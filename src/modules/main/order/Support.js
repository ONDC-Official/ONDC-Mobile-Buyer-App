import {Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Dialog, withTheme} from 'react-native-elements';
import InputField from '../../../components/input/InputField';
import * as Yup from 'yup';
import {strings} from '../../../locales/i18n';
import {Context as AuthContext} from '../../../context/Auth';
import Button from './Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getData, postData} from '../../../utils/api';
import {BASE_URL, CALL, ON_SUPPORT, SUPPORT} from '../../../utils/apiUtilities';

const invalidNumber = strings('errors.invalid_number');
const requiredField = strings('errors.required');
const numberPlaceholder = strings('main.cart.number');

const validationSchema = Yup.object({
  number: Yup.string()
    .trim()
    .matches(/^[6-9]{1}[0-9]{9}$/, invalidNumber)
    .required(requiredField),
});

const Support = ({modalVisible, setModalVisible, item, theme}) => {
  const {colors} = theme;
  const {
    state: {token},
  } = useContext(AuthContext);
  const [callInProgress, setCallInProgress] = useState(false);

  const userInfo = {
    number: '',
  };

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const callMe = async number => {
    try {
      setCallInProgress(true);
      const {data} = await postData(
        `${BASE_URL}${SUPPORT}`,
        [
          {
            context: {
              bpp_id: item.bpp_id,
              transaction_id: item.transaction_id,
            },
            message: {
              ref_id: item.ref_id,
            },
          },
        ],
        options,
      );
      if (data[0].message.ack.status === 'ACK') {
        const response = await getData(
          `${BASE_URL}${ON_SUPPORT}messageIds=${data[0].context.message_id}`,
          options,
        );
        console.log(response.data);

        const res = await postData(
          `${BASE_URL}${CALL}`,

          {
            customer_phone_number: response.data[0].message.phone,
            seller_phone_number: `+91${number}`,
          },
          options,
        );
        console.lof(res);
        setModalVisible(false);
      }
      setCallInProgress(false);
    } catch (e) {
      console.log(e.response);
      setCallInProgress(false);
    }
  };
  return (
    <View style={styles.centeredView}>
      <Dialog isVisible={modalVisible}>
        <Formik
          initialValues={userInfo}
          validationSchema={validationSchema}
          onSubmit={values => {
            callMe(values.number)
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
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}
                  style={styles.close}>
                  <Icon
                    name="close-thick"
                    color={colors.accentColor}
                    size={16}
                  />
                </TouchableOpacity>
                <InputField
                  keyboardType={'numeric'}
                  maxLength={10}
                  value={values.number}
                  onBlur={handleBlur('number')}
                  placeholder={numberPlaceholder}
                  errorMessage={touched.number ? errors.number : null}
                  onChangeText={handleChange('number')}
                />
                <View style={styles.buttonContainer}>
                  <Button
                    backgroundColor={colors.statusBackground}
                    borderColor={colors.accentColor}
                    title={'Call me'}
                    onPress={handleSubmit}
                    color={colors.accentColor}
                    loader={callInProgress}
                  />
                  <Button
                    backgroundColor={colors.cancelledBackground}
                    borderColor={colors.error}
                    title={'Cancel'}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                    color={colors.error}
                  />
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  close: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 50,
    alignSelf: 'flex-end',
  },
});