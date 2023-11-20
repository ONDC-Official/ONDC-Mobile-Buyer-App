import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text, withTheme} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';

import useLoginWithGoogle from '../hooks/useLoginWithGoogle';
import {showToastWithGravity} from '../../../utils/utils';

interface SocialMediaLogin {
  theme: any;
}

const SocialMediaLogin: React.FC<SocialMediaLogin> = ({theme}) => {
  const {loginWithGoogle} = useLoginWithGoogle();
  const styles = makeStyles(theme.colors);
  const {isConnected, isInternetReachable} = useNetInfo();

  const onLoginWithGooglePress = () => {
    if (isConnected && isInternetReachable) {
      loginWithGoogle().then(() => {
      });
    } else {
      showToastWithGravity('Please check your internet connection.');
    }
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onLoginWithGooglePress}>
          <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Light}
            onPress={onLoginWithGooglePress}
          />
          <Text style={styles.buttonLabel}>Continue with google</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    buttonContainer: {width: 300, marginTop: 12, marginBottom: 8},
    button: {
      maxHeight: 48,
      borderRadius: 24,
      borderWidth: 1,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.primary,
    },
    buttonLabel: {
      marginStart: 12,
      color: colors.primary,
    },
    googleButton: {
      height: 46,
      width: 38,
      borderWidth: 5,
      borderRadius: 20,
      borderColor: 'white',
    },
  });

export default withTheme(SocialMediaLogin);
