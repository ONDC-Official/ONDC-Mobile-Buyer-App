import {configureFonts, DefaultTheme} from 'react-native-paper';

const fontConfig = {
  ios: {
    regular: {
      fontFamily: 'Lato-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Lato-Medium',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Lato-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Lato-Thin',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Lato-Bold',
      fontWeight: 'bold',
    },
    black: {
      fontFamily: 'Lato-Black',
      fontWeight: '900',
    },
  },
  android: {
    regular: {
      fontFamily: 'Lato-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Lato-Medium',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Lato-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Lato-Thin',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Lato-Bold',
      fontWeight: 'bold',
    },
    black: {
      fontFamily: 'Lato-Black',
      fontWeight: '900',
    },
  },
};

export const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1C75BC',
    accent: '#00AEEF',
    opposite: '#F29C49',
    background: 'white',
    surface: '#FFF',
    error: '#B00020',
    text: '#333',
    pageBackground: '#f0f0f0',
    foodAndBeverages: '#E8F0EA',
    grocery: '#FFF7C0',
  },
  fonts: configureFonts(fontConfig),
};
