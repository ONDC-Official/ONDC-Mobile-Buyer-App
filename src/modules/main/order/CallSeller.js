import React, {useEffect, useState} from 'react';
import RNEventSource from 'react-native-event-source';
import {useIsFocused} from '@react-navigation/native';
import {Button, Card, Text, withTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {getData, postData} from '../../../utils/api';
import {BASE_URL, CALL, ON_SUPPORT, SUPPORT} from '../../../utils/apiUtilities';
import {appStyles} from '../../../styles/styles';
import InputField from '../../../components/input/InputField';
import {showToastWithGravity} from '../../../utils/utils';

const userInfo = {
  number: '',
};

const CallSeller = ({
  theme,
  route: {
    params: {bppId, transactionId, orderId},
  },
  navigation,
}) => {
  const isFocused = useIsFocused();
  const {token} = useSelector(({authReducer}) => authReducer);
  const {handleApiError} = useNetworkErrorHandling();
  const [supportMessageId, setSupportMessageId] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);

  const [requestInProgress, setRequestInProgress] = useState(false);

  const validationSchema = Yup.object({
    number: Yup.string()
      .trim()
      .matches(/^[6-9]{1}[0-9]{9}$/, 'Invalid number')
      .required('This field is required'),
  });

  /**
   * Component is used to handle click event of call me button
   * @param number:number entered by user
   * @returns {Promise<void>}
   */
  const requestCall = async number => {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setRequestInProgress(true);
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
        showToastWithGravity('Call is placed');
      }
      setRequestInProgress(false);
    } catch (error) {
      handleApiError(error);
      setRequestInProgress(false);
    }
  };

  const getSupport = () => {
    setCallInProgress(true);
    postData(
      `${BASE_URL}${SUPPORT}`,
      [
        {
          context: {
            bpp_id: bppId,
            transaction_id: transactionId,
          },
          message: {
            ref_id: orderId,
          },
        },
      ],
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then(({data}) => {
        if (data[0].message.ack.status === 'ACK') {
          setSupportMessageId(data[0].context.message_id);
        }
      })
      .catch(error => {
        handleApiError(error);
        setCallInProgress(false);
      });
  };

  /**
   * function request support info
   * @param messageId:message id received in get support API
   * @returns {Promise<void>}
   */
  const onGetSupport = async messageId => {
    try {
      const {data} = await getData(
        `${BASE_URL}${ON_SUPPORT}messageIds=${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data[0].message.hasOwnProperty('phone')) {
        setSellerInfo(data[0].message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const removeEvents = eventSource => {
    if (eventSource) {
      eventSource.removeAllListeners();
      eventSource.close();
      setCallInProgress(false);
    }
  };

  useEffect(() => {
    let eventSource;
    let timer;

    if (supportMessageId && isFocused) {
      eventSource = new RNEventSource(
        `${BASE_URL}/clientApis/events?messageId=${supportMessageId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (!timer) {
        timer = setTimeout(removeEvents, 20000, eventSource);
      }

      eventSource.addEventListener('on_support', event => {
        const data = JSON.parse(event.data);
        onGetSupport(data.messageId)
          .then(() => {})
          .catch(() => {});
      });
    }

    return () => {
      removeEvents(eventSource);
    };
  }, [supportMessageId, isFocused]);

  useEffect(() => {
    getSupport();
  }, []);

  if (callInProgress) {
    return (
      <View style={[appStyles.centerContainer, appStyles.container]}>
        <ActivityIndicator size={32} color={theme.colors.primary} />
      </View>
    );
  } else {
    if (sellerInfo) {
      return (
        <Card style={styles.card}>
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
                    placeholder={'Phone number'}
                    errorMessage={touched.number ? errors.number : null}
                    onChangeText={handleChange('number')}
                    disabled={requestInProgress}
                  />
                  <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                      <Button
                        contentStyle={appStyles.containedButtonContainer}
                        labelStyle={appStyles.containedButtonLabel}
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        disabled={requestInProgress}>
                        Cancel
                      </Button>
                    </View>
                    <View style={styles.button}>
                      <Button
                        contentStyle={appStyles.containedButtonContainer}
                        labelStyle={appStyles.containedButtonLabel}
                        mode="contained"
                        onPress={handleSubmit}
                        loading={requestInProgress}
                        disabled={requestInProgress}>
                        Call me
                      </Button>
                    </View>
                  </View>
                </View>
              );
            }}
          </Formik>
        </Card>
      );
    } else {
      return (
        <View style={[appStyles.centerContainer, appStyles.container]}>
          <Text>Something went wrong, please try again.</Text>
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
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
  card: {
    backgroundColor: 'white',
    margin: 8,
    padding: 8,
  },
});

export default withTheme(CallSeller);
