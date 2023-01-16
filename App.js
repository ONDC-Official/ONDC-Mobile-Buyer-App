import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import {ThemeProvider} from 'react-native-elements';

import Toast, {ErrorToast} from 'react-native-toast-message';
import Navigation from './src/navigation/Navigation';
import {theme} from './src/utils/theme';
import store from './src/redux/store';

const App = () => {
  const toastConfig = {
    error: props => <ErrorToast {...props} text1NumberOfLines={2} />,
  };

  return (
    <ThemeProvider theme={theme}>
      <StoreProvider store={store}>
        <Navigation />
        <Toast config={toastConfig} />
      </StoreProvider>
    </ThemeProvider>
  );
};

export default App;
