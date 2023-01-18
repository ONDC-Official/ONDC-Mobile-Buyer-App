import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';

import Toast, {ErrorToast} from 'react-native-toast-message';
import Navigation from './src/navigation/Navigation';
import {theme} from './src/utils/theme';
import store from './src/redux/store';

const App = () => {
  const toastConfig = {
    error: props => <ErrorToast {...props} text1NumberOfLines={2} />,
  };

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <Navigation />
        <Toast config={toastConfig} />
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
