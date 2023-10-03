import React, {useEffect} from 'react';
import {Provider as StoreProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {Linking} from 'react-native';
import Toast, {ErrorToast} from 'react-native-toast-message';

import Navigation from './src/navigation/Navigation';
import {theme} from './src/utils/theme';
import store from './src/redux/store';
import NetworkBanner from './src/components/network/NetworkBanner';
import {alertWithOneButton} from './src/utils/alerts';

const App = () => {
  const toastConfig = {
    error: props => <ErrorToast {...props} text1NumberOfLines={2} />,
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
        <Navigation />
        <NetworkBanner />
        <Toast config={toastConfig} />
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
