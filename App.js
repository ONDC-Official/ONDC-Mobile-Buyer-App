import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import {ThemeProvider} from 'react-native-elements';

import {Provider as AuthProvider} from './src/context/Auth';
import Toast, {ErrorToast, InfoToast} from 'react-native-toast-message';
import Navigation from './src/navigation/Navigation';
import {theme} from './src/utils/theme';
import store from './src/redux/store';

const App = () => {
  const toastConfig = {
    error: props => <ErrorToast {...props} text1NumberOfLines={2} />,
  };
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CartContextProvider>
        <StoreProvider store={store}>
          <Navigation />
          <Toast config={toastConfig} />
        </StoreProvider>
        </CartContextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
