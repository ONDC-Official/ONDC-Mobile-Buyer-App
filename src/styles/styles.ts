import {StyleSheet} from 'react-native';

export const appStyles = StyleSheet.create({
  container: {flex: 1},
  backgroundWhite: {backgroundColor: 'white'},
  centerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginVertical: 8,
  },
  containedButtonLabel: {
    fontSize: 16,
  },
  containedButtonContainer: {
    height: 50,
  },
});

export const makeGlobalStyles = (colors: any) =>
  StyleSheet.create({
    disabledOutlineButton: {
      borderColor: colors.disabled,
    },
    outlineButton: {
      borderColor: colors.primary,
    },
    disabledOutlineButtonText: {
      color: colors.disabled,
    },
    outlineButtonText: {
      color: colors.primary,
    },
    disabledContainedButton: {
      backgroundColor: colors.surfaceDisabled,
      borderColor: colors.surfaceDisabled,
    },
    containedButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    disabledContainedButtonText: {
      color: colors.text,
    },
    containedButtonText: {
      color: colors.white,
    },
  });
