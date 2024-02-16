import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text, withTheme} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';

import useLoginWithGoogle from '../hooks/useLoginWithGoogle';
import {showToastWithGravity} from '../../../utils/utils';
import GoogleIcon from '../../../assets/google.svg';

interface GoogleLogin {
  theme: any;
  setGoogleLoginRequested: (newValue: boolean) => void;
  loginRequested: boolean;
  googleLoginRequested: boolean;
}

const GoogleLogin: React.FC<GoogleLogin> = ({
  theme,
  loginRequested,
  googleLoginRequested,
  setGoogleLoginRequested,
}) => {
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
        <ActivityIndicator size={16} />
      ) : (
        <GoogleIcon width={36} height={36} />
      )}
      <Text variant={'bodyLarge'} style={styles.buttonLabel}>
        Sign In with Google
      </Text>
    </TouchableOpacity>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    button: {
      maxHeight: 48,
      borderRadius: 12,
      borderWidth: 1,
      paddingVertical: 6,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#B5B5B5',
    },
    buttonLabel: {
      marginStart: 10,
      color: '#1A1A1A',
    },
  });

export default withTheme(GoogleLogin);
