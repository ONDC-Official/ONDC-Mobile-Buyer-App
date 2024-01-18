import {StyleSheet} from 'react-native';

export const makeButtonStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderColor: colors.primary,
      borderRadius: 8,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      borderWidth: 1,
    },
    label: {
      color: colors.primary,
    },
  });
