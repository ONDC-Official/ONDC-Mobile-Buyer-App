import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Text, withTheme} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome';

import useLoginWithGoogle from '../hooks/useLoginWithGoogle';
import {showToastWithGravity} from '../../../utils/utils';

interface SocialMediaLogin {
  theme: any;
}

const SocialMediaLogin: React.FC<SocialMediaLogin> = ({theme}) => {
  const {loginWithGoogle} = useLoginWithGoogle();
  const styles = makeStyles(theme.colors);
  const {isConnected, isInternetReachable} = useNetInfo();
  const [loginRequested, setLoginRequested] = useState(false);

  const onLoginWithGooglePress = () => {
    if (isConnected && isInternetReachable) {
      setLoginRequested(true);
      loginWithGoogle().then(() => {
        setLoginRequested(false);
      });
    } else {
      showToastWithGravity('Please check your internet connection.');
    }
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={loginRequested}
          style={styles.button}
          onPress={onLoginWithGooglePress}>
          {loginRequested ? (
            <ActivityIndicator size={16} />
          ) : (
            <Icon name={'google'} color={theme.colors.primary} size={16} />
          )}
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
