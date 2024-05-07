import React, {useEffect, useRef} from 'react';
import {Linking, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Toast, {ErrorToast} from 'react-native-toast-message';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/redux/store';
import {theme} from './src/utils/theme';
import AppNavigation from './src/navigation/AppNavigation';
import NetworkBanner from './src/components/network/NetworkBanner';
import {getMultipleData} from './src/utils/storage';
import {getUrlParams} from './src/utils/utils';

const App = () => {
  const navigationRef = useRef<any>(null);
  const toastConfig = {
    error: (props: any) => <ErrorToast {...props} text1NumberOfLines={2} />,
  };

  useEffect(() => {
    const handleDeepLink = (url: any) => {
      if (url) {
        getMultipleData(['token', 'uid', 'emailId', 'name']).then(data => {
          if (data[0][1] !== null) {
            const urlParams = getUrlParams(url);
            if (
              urlParams.hasOwnProperty('context.action') &&
              urlParams['context.action'] === 'search'
            ) {
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
            }
          }
        });
      }
    };

    const getUrlDetails = ({url}: {url: any}) => {
      handleDeepLink(url);
    };

    Linking.addEventListener('url', getUrlDetails);

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
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
  container: {
    flex: 1,
  },
});

export default App;
