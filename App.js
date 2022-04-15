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
import Toast, {ErrorToast} from 'react-native-toast-message';
import Navigation from './src/navigation/Navigation';

const App = () => {
  const toastConfig = {
    error: props => <ErrorToast {...props} text1NumberOfLines={2} />,
  };
  return (
    <ThemeProvider>
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
