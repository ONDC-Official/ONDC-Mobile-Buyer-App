/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {ThemeProvider} from 'react-native-elements';
import CartContextProvider from './src/context/Cart';
import {Provider as AuthProvider} from './src/context/Auth';
import Toast, {ErrorToast, InfoToast} from 'react-native-toast-message';
import Navigation from './src/navigation/Navigation';
import {theme} from './src/utils/theme';

const App = () => {
  const toastConfig = {
    error: props => <ErrorToast {...props} text1NumberOfLines={2} />,
  };
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CartContextProvider>
          <Navigation />
          <Toast config={toastConfig} />
        </CartContextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
