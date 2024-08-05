import {Dimensions, Platform, StyleSheet} from 'react-native';
const screenHeight = Dimensions.get('window').height;

export const makeStyles = (colors: any) =>
  StyleSheet.create({
    flexContainer: {
      flex: 1,
    },
    pageContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
    },
    container: {
      paddingHorizontal: 16,
      flex: 1,
      height: screenHeight - 50,
    },
    title: {
      paddingTop: 16,
      color: colors.white,
    },
    signUpMessage: {
      paddingTop: 8,
      color: colors.neutral50,
    },
    formContainer: {
      marginVertical: 32,
      padding: 20,
      borderRadius: 15,
      backgroundColor: colors.white,
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 24,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    footerContainer: {
      paddingBottom: 0,
    },
    textCenter: {
      textAlign: 'center',
      color: colors.neutral300,
    },
    terms: {
      paddingTop: 8,
      color: colors.primary,
    },
  });
