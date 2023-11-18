import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text, withTheme} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';

import useLoginWithGoogle from '../hooks/useLoginWithGoogle';
import {showToastWithGravity} from '../../../utils/utils';

const SocialMediaLogin = ({theme}) => {
  const {loginWithGoogle} = useLoginWithGoogle();
  const {isConnected, isInternetReachable} = useNetInfo();
  const onLoginWithGooglePress = () => {
    if (isConnected && isInternetReachable) {
      loginWithGoogle();
    } else {
      showToastWithGravity('Please check your internet connection.');
    }
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {borderColor: theme.colors.primary}]}
          mode="outlined"
          onPress={onLoginWithGooglePress}>
          <GoogleSigninButton
            style={{
              height: 46,
              width: 38,
              borderWidth: 5,
              borderRadius: 20,
              borderColor: 'white',
            }}
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Light}
            onPress={onLoginWithGooglePress}
          />
          <Text style={[styles.buttonLabel, {color: theme.colors.primary}]}>
            Continue with google
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {width: 300, marginTop: 12, marginBottom: 8},
  button: {
    maxHeight: 48,
    borderRadius: 24,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    marginStart: 12,
  },
});

export default withTheme(SocialMediaLogin);
