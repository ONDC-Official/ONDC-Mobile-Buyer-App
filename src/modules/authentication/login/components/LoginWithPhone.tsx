import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import InputField from '../../../../components/input/InputField';
import OrContainer from '../../common/OrContainer';
import SocialMediaLogin from '../../common/GoogleLogin';
import {showToastWithGravity} from '../../../../utils/utils';
import useStoreUserAndNavigate from '../../../../hooks/useStoreUserAndNavigate';
import {useAppTheme} from '../../../../utils/theme';

const LoginWithPhone = () => {
  const navigation = useNavigation<any>();
  const {storeDetails} = useStoreUserAndNavigate();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [googleLoginRequested, setGoogleLoginRequested] =
    useState<boolean>(false);
  const [codeAvailable, setCodeAvailable] = useState<boolean>(false);
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [mobileError, setMobileError] = useState<string>('');
  const [codeError, setCodeError] = useState<string>('');
  // If null, no SMS has been sent
  const [confirmation, setConfirmation] = useState<any>(null);
  const [code, setCode] = useState('');

  const updateMobileNumber = (value: string) => {
    setMobileNumber(value);
    setMobileError(value.length !== 10 ? 'Enter valid mobile number' : '');
  };

  const updateCode = (value: string) => {
    setCode(value);
    setCodeError(value.length !== 6 ? 'Enter valid code' : '');
  };

  const verifyOtp = async () => {
    try {
      setApiInProgress(true);
      await confirmation.confirm(code);
      const user = auth()?.currentUser;
      const idTokenResult = await user?.getIdTokenResult();

      await storeDetails(idTokenResult, user);
    } catch (error) {
      showToastWithGravity('Enter valid OTP');
    } finally {
      setApiInProgress(false);
    }
  };

  const sendOtp = async () => {
    try {
      setApiInProgress(true);
      const confirm = await auth().signInWithPhoneNumber(`+91${mobileNumber}`);
      setConfirmation(confirm);
      setCodeAvailable(true);
    } catch (error: any) {
      if (error?.code === 'auth/invalid-phone-number') {
        showToastWithGravity('Please enter valid phone number');
      } else if (error?.code === 'auth/too-many-requests') {
        showToastWithGravity(
          'We have blocked all requests from this device due to unusual activity. Try again later',
        );
      } else {
        showToastWithGravity(error.message);
      }
    } finally {
      setApiInProgress(false);
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <InputField
          left={<TextInput.Affix text="+91" />}
          inputMode={'numeric'}
          disabled={googleLoginRequested || apiInProgress}
          name="email"
          value={mobileNumber}
          required
          inputLabel="Phone No."
          placeholder="Enter phone no."
          error={!!mobileError}
          errorMessage={mobileError ? mobileError : null}
          onChangeText={updateMobileNumber}
          right={
            codeAvailable ? (
              <TextInput.Icon
                icon={'pencil'}
                onPress={() => setCodeAvailable(false)}
              />
            ) : null
          }
        />
      </View>
      {codeAvailable && (
        <View style={styles.inputContainer}>
          <InputField
            disabled={googleLoginRequested || apiInProgress}
            value={code}
            required
            inputLabel="OTP*"
            placeholder="Enter OTP"
            secureTextEntry
            error={!!codeError}
            errorMessage={codeError ? codeError : null}
            onChangeText={updateCode}
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {codeAvailable ? (
          <View>
            <Button
              labelStyle={[theme.fonts.bodyLarge]}
              style={styles.containedButton}
              contentStyle={styles.button}
              mode="contained"
              onPress={verifyOtp}
              loading={apiInProgress}
              disabled={googleLoginRequested || apiInProgress}>
              Verify
            </Button>
            <View style={styles.dontReceiveContainer}>
              <Text variant={'bodyMedium'}>Didn’t receive OTP?</Text>
              <Text variant={'bodyLarge'} style={styles.resend}>
                Resend
              </Text>
            </View>
          </View>
        ) : (
          <Button
            labelStyle={[theme.fonts.bodyLarge]}
            style={styles.containedButton}
            contentStyle={styles.button}
            mode="contained"
            onPress={sendOtp}
            loading={apiInProgress}
            disabled={
              googleLoginRequested ||
              apiInProgress ||
              mobileNumber.length !== 10 ||
              mobileError.length > 0
            }>
            Send OTP
          </Button>
        )}
      </View>

      <OrContainer />
      <SocialMediaLogin
        loginRequested={googleLoginRequested || apiInProgress}
        googleLoginRequested={googleLoginRequested}
        setGoogleLoginRequested={setGoogleLoginRequested}
      />

      <View style={styles.loginMessage}>
        <Text variant={'bodyMedium'} style={styles.dontHaveMessage}>
          Don't have an account?
        </Text>
        <TouchableOpacity
          disabled={googleLoginRequested || apiInProgress}
          onPress={() => navigation.navigate('SignUp')}>
          <Text variant={'bodyLarge'} style={styles.signUpText}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    inputContainer: {
      marginTop: 20,
    },
    forgotPasswordContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    buttonContainer: {
      marginTop: 28,
    },
    containedButton: {
      borderRadius: 12,
    },
    button: {
      height: 44,
    },
    loginMessage: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    dontHaveMessage: {
      color: colors.neutral300,
    },
    signUpText: {color: colors.primary, paddingLeft: 8},
    dontReceiveContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    resend: {
      marginLeft: 4,
      color: colors.primary,
    },
  });

export default LoginWithPhone;
