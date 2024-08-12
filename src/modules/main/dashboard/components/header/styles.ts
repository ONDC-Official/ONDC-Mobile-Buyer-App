import {StyleSheet} from 'react-native';

const makeStyles = (colors: any) =>
  StyleSheet.create({
    modalView: {
      alignSelf: 'center',
      height: 350,
      width: 300,
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    micWavesContainer: {
      width: 60,
      height: 60,
      borderRadius: 75,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 75,
    },
    labelText: {
      marginTop: 100,
      textAlign: 'center',
    },
  });

export default makeStyles;
