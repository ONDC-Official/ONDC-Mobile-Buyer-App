import React, {useCallback, useEffect, useRef} from 'react';
import {Linking, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Toast, {ErrorToast} from 'react-native-toast-message';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {useTranslation} from 'react-i18next';
import store from './src/toolkit/store';
import {theme} from './src/utils/theme';
import AppNavigation from './src/navigation/AppNavigation';
import NetworkBanner from './src/components/network/NetworkBanner';
import {getMultipleData} from './src/utils/storage';
import {getUrlParams, isDomainSupported, isValidQRURL} from './src/utils/utils';
import {SUPPORT_EMAIL} from './src/utils/constants';

const toastConfig = {
  error: (props: any) => <ErrorToast {...props} text1NumberOfLines={2} />,
};

const App = () => {
  const navigationRef = useRef<any>(null);
  const {t} = useTranslation();

  const handleDeepLink = useCallback((url: any) => {
    if (url) {
      getMultipleData(['token', 'uid', 'emailId', 'name']).then(data => {
        if (data[0][1] !== null) {
          const urlParams = getUrlParams(url);
          if (isValidQRURL(urlParams)) {
            if (isDomainSupported(urlParams['context.domain'])) {
              const brandId = `${urlParams['context.bpp_id']}_${urlParams['context.domain']}_${urlParams['message.intent.provider.id']}`;
              const pageParams: any = {brandId};
              if (
                urlParams.hasOwnProperty(
                  'message.intent.provider.locations.0.id',
                )
              ) {
                pageParams.outletId = `${brandId}_${urlParams['message.intent.provider.locations.0.id']}`;
              }
              navigationRef.current.navigate('BrandDetails', pageParams);
            } else {
              navigationRef.current.navigate('InvalidBrandDetails', {
                message: t(
                  'This store/seller type is not supported by Saarthi Application, explore other buyer apps.',
                ),
              });
            }
          } else {
            navigationRef.current.navigate('InvalidBrandDetails', {
              message: t(
                'Provider Details.Incorrect specifications or malformed request',
                {
                  email: SUPPORT_EMAIL,
                },
              ),
            });
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const getUrlDetails = ({url}: {url: any}) => {
      handleDeepLink(url);
    };

    Linking.addEventListener('url', getUrlDetails);

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [handleDeepLink]);

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.topSafeArea} />
        <SafeAreaView style={styles.bottomSafeArea}>
          <StatusBar backgroundColor={theme.colors.primary} />
          <AppNavigation navigationRef={navigationRef} />
          <NetworkBanner />
          <Toast config={toastConfig} />
        </SafeAreaView>
      </PaperProvider>
    </StoreProvider>
  );
};

const styles = StyleSheet.create({
  topSafeArea: {
    flex: 0,
    backgroundColor: theme.colors.primary,
  },
  bottomSafeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});

export default App;
