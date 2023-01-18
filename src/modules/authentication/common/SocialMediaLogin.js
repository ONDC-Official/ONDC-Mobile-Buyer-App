import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';

import useLoginWithGoogle from '../hooks/useLoginWithGoogle';

const SocialMediaLogin = () => {
  const {loginWithGoogle} = useLoginWithGoogle();

  return (
    <>
      <View style={styles.buttonContainer}>
        <Button mode="outlined" icon="google" onPress={loginWithGoogle}>
          Continue with google
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {width: 300, marginTop: 12, marginBottom: 8},
});

export default SocialMediaLogin;
