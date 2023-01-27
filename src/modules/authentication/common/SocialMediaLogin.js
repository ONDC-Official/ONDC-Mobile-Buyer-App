import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text, withTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import useLoginWithGoogle from '../hooks/useLoginWithGoogle';

const SocialMediaLogin = ({theme}) => {
  const {loginWithGoogle} = useLoginWithGoogle();

  return (
    <>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {borderColor: theme.colors.primary}]}
          mode="outlined"
          onPress={loginWithGoogle}>
          <Icon size={18} name="google" color={theme.colors.primary} />
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
