import {StyleSheet} from 'react-native';

export const makeButtonStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      borderColor: colors.primary,
      borderRadius: 8,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      borderWidth: 1,
    },
    label: {
      color: colors.primary,
    },
    webView: {
      flex: 1,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    draggableIcon: {
      backgroundColor: '#000',
    },
    rbSheet: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
    closeSheet: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
      alignItems: 'center',
      paddingBottom: 8,
      paddingTop: 20,
    },
    wrapper: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
  });
