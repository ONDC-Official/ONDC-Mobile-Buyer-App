import React, {useEffect} from 'react';
import {Linking, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Toast, {ErrorToast} from 'react-native-toast-message';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/redux/store';
import {theme} from './src/utils/theme';
import AppNavigation from './src/navigation/AppNavigation';
import NetworkBanner from './src/components/network/NetworkBanner';
import {alertWithOneButton} from './src/utils/alerts';

const App = () => {
  const toastConfig = {
    error: (props: any) => <ErrorToast {...props} text1NumberOfLines={2} />,
  };

  useEffect(() => {
    const getUrlDetails = ({url}) => {
      if (url) {
        alertWithOneButton('Application Focus for', url, 'Ok', () => {});
      }
    };

    Linking.addEventListener('url', getUrlDetails);

    Linking.getInitialURL().then(url => {
      if (url) {
        alertWithOneButton('Application is open using', url, 'Ok', () => {});
      }
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor={theme.colors.primary} />
          <AppNavigation />
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
