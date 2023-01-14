import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-elements';
import {useTranslation} from 'react-i18next';

import OutlineButton from '../../../components/button/OutlineButton';
import {isIOS} from '../../../utils/utils';
import useLoginWithGoogle from '../landing/hooks/useLoginWithGoogle';

const SocialMediaLogin = () => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {loginWithGoogle} = useLoginWithGoogle();

  return (
    <>
      <View style={styles.buttonContainer}>
        <OutlineButton
          title={t('authentication.landing.continue_with_google')}
          onPress={loginWithGoogle}
          icon={{
            name: 'google',
            type: 'font-awesome',
            size: 30,
            color: theme.colors.accentColor,
          }}
          color={theme.colors.accentColor}
        />
      </View>

      {isIOS && (
        <View style={styles.buttonContainer}>
          <OutlineButton
            title={t('authentication.landing.continue_with_apple')}
            icon={{
              name: 'apple',
              type: 'font-awesome',
              size: 30,
              color: theme.colors.accentColor,
            }}
            color={theme.colors.accentColor}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {width: 300, marginVertical: 12},
});

export default SocialMediaLogin;
