import {configureFonts, MD3LightTheme} from 'react-native-paper';
import {Platform} from 'react-native';

const fontConfig: any = {
  labelSmall: {
    fontFamily: Platform.select({
      web: 'Inter, sans-serif',
      ios: 'Inter',
      default: 'Inter',
    }),
    fontSize: 12,
    lineHeight: 16,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Platform.select({
      web: 'Inter-Regular',
      ios: 'Inter-Regular',
      default: 'Inter-Regular',
    }),
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    fontFamily: Platform.select({
      web: 'Inter-Medium',
      ios: 'Inter-Medium',
      default: 'Inter-Medium',
    }),
  },
};

export const theme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#196AAB',
    accent: '#00AEEF',
    opposite: '#F29C49',
    footer: '#f3bf93',
    background: '#FFF',
    surface: '#FFF',
    error: '#B00020',
    red: '#D61C4E',
    text: '#333',
    pageBackground: '#f0f0f0',
    foodAndBeverages: '#E8F0EA',
    grocery: '#FFF7C0',
    shippedBackground: '#FFC132',
    deliveredBackground: '#2EB086',
    cardBackground: '#f5d9d3',
    cancelledBackground: '#FFE8E7',
    statusBackground: '#E9F1F8',
    tabColor: '#606161',
    success: '#2EB086',
  },
  fonts: configureFonts({config: fontConfig}),
};
