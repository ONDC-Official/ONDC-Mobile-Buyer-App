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

import Navigation from './src/navigation/Navigation';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartContextProvider>
          <Navigation />
        </CartContextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
