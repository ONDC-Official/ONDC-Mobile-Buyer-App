import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import {useNetInfo} from '@react-native-community/netinfo';

import useStoreUserAndNavigate from '../../../hooks/useStoreUserAndNavigate';
import {showToastWithGravity} from '../../../utils/utils';
import {useAppTheme} from '../../../utils/theme';

interface AppleLogin {
  setAppleLoginRequested: (newValue: boolean) => void;
  loginRequested: boolean;
  appleLoginRequested: boolean;
}

const AppleLogin: React.FC<AppleLogin> = ({
  loginRequested,
  appleLoginRequested,
  setAppleLoginRequested,
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const {storeDetails} = useStoreUserAndNavigate();
  const {isConnected, isInternetReachable} = useNetInfo();

  const loginWithApple = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign-in the user with the credential
      await auth().signInWithCredential(appleCredential);

      const idTokenResult = await auth()?.currentUser?.getIdTokenResult();
      if (!auth()?.currentUser?.emailVerified) {
        await auth().currentUser?.sendEmailVerification();
      }
      await storeDetails(idTokenResult, auth()?.currentUser);
    } catch (error) {
      console.log(error);
    }
  };
  const onAppleButtonPress = async () => {
    if (isConnected && isInternetReachable) {
      setAppleLoginRequested(true);
      loginWithApple().then(() => {
        setAppleLoginRequested(false);
      });
    } else {
      showToastWithGravity('Please check your internet connection.');
    }
  };

  return (
    <View pointerEvents={loginRequested ? 'none' : 'auto'}>
      <AppleButton
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={styles.button}
        onPress={onAppleButtonPress}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    button: {
      marginTop: 16,
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      paddingVertical: 6,
      borderColor: colors.neutral200,
    },
  });

export default AppleLogin;
