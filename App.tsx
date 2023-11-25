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

const App = () => {
  const navigationRef = useRef<any>(null);
  const toastConfig = {
    error: (props: any) => <ErrorToast {...props} text1NumberOfLines={2} />,
  };

  useEffect(() => {
    const getUrlDetails = ({url}) => {
      if (url) {
        getMultipleData(['token', 'uid', 'emailId', 'name']).then(data => {
          if (data[0][1] !== null) {
            const urlParams: any = {};
            const params = url.split('?');
            if (params.length > 0) {
              const variables = params[1].split('&');
              variables.forEach(one => {
                const fields = one.split('=');
                if (fields.length > 0) {
                  urlParams[fields[0]] = fields[1];
                  if (urlParams.hasOwnProperty('context.provider.id')) {
                    navigationRef.current.navigate('BrandDetails', {
                      brandId: urlParams['context.provider.id'],
                    });
                  }
                }
              });
            }
          }
        });
      }
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
