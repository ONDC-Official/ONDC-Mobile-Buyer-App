/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View
} from 'react-native';
import Navigation from './src/navigation/Navigation';
import {ThemeProvider} from "react-native-elements"





const App = () => {
  return (
    <ThemeProvider>
     <Navigation/>
   </ThemeProvider>
  );
};



export default App;
