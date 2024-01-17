import {configureFonts, MD3LightTheme} from 'react-native-paper';
import {Platform} from 'react-native';

const fontConfig: any = {
  titleMedium: {
    fontFamily: Platform.select({
      web: 'Inter-Bold, sans-serif',
      ios: 'Inter-Bold',
      default: 'Inter-Bold',
    }),
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: Platform.select({
      web: 'Inter-Bold, sans-serif',
      ios: 'Inter-Bold',
      default: 'Inter-Bold',
    }),
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
  },
  labelSmall: {
    fontFamily: Platform.select({
      web: 'Inter-Regular, sans-serif',
      ios: 'Inter-Regular',
      default: 'Inter-Regular',
    }),
    fontSize: 10,
    lineHeight: 16,
  },
  labelMedium: {
    fontFamily: Platform.select({
      web: 'Inter-Regular, sans-serif',
      ios: 'Inter-Regular',
      default: 'Inter-Regular',
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
  bodyLarge: {
    fontSize: 16,
    lineHeight: 20,
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
    primary: '#008ECC',
    warning: '#F29C49',
    footer: '#f3bf93',
    background: '#FFF',
    surface: '#FFF',
    error: '#D83232',
    red: '#D61C4E',
    text: '#333',
    shippedBackground: '#FFC132',
    deliveredBackground: '#2EB086',
    cancelledBackground: '#FFE8E7',
    statusBackground: '#E9F1F8',
    success: '#419E6A',
    disabled: 'grey',
    white: '#fff',
    border: '#ebebeb',
  },
  fonts: configureFonts({config: fontConfig}),
};
