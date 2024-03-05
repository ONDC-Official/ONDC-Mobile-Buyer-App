import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';

import useLoginWithGoogle from '../hooks/useLoginWithGoogle';
import {showToastWithGravity} from '../../../utils/utils';
import GoogleIcon from '../../../assets/google.svg';
import {useAppTheme} from '../../../utils/theme';

interface GoogleLogin {
  setGoogleLoginRequested: (newValue: boolean) => void;
  loginRequested: boolean;
  googleLoginRequested: boolean;
}

const GoogleLogin: React.FC<GoogleLogin> = ({
  loginRequested,
  googleLoginRequested,
  setGoogleLoginRequested,
}) => {
  const theme = useAppTheme();
  const {loginWithGoogle} = useLoginWithGoogle();
  const styles = makeStyles(theme.colors);
  const {isConnected, isInternetReachable} = useNetInfo();

  const onLoginWithGooglePress = () => {
    if (isConnected && isInternetReachable) {
      setGoogleLoginRequested(true);
      loginWithGoogle().then(() => {
        setGoogleLoginRequested(false);
      });
    } else {
      showToastWithGravity('Please check your internet connection.');
    }
  };

  return (
    <TouchableOpacity
      disabled={loginRequested}
      style={styles.button}
      onPress={onLoginWithGooglePress}>
      {googleLoginRequested ? (
        <ActivityIndicator size={36} />
      ) : (
        <GoogleIcon width={36} height={36} />
      )}
      <Text variant={'bodyLarge'} style={styles.buttonLabel}>
        Sign In with Google
      </Text>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    button: {
      maxHeight: 48,
      borderRadius: 12,
      borderWidth: 1,
      paddingVertical: 6,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.neutral200,
    },
    buttonLabel: {
      marginStart: 10,
      color: colors.neutral400,
    },
  });

export default GoogleLogin;
