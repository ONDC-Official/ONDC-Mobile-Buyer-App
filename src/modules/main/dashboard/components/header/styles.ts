import {StyleSheet} from 'react-native';

const makeStyles = (colors: any) =>
  StyleSheet.create({
    micContainer: {
      marginLeft: 10,
    },
    modalView: {
      alignSelf: 'center',
      height: '80%',
      width: '90%',
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
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
      width: 75,
      height: 75,
      borderRadius: 75,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 100,
    },
    micWaves: {
      backgroundColor: 'rgba(0, 142, 204, 0.4)',
      borderRadius: 75,
    },
    labelText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: '600',
    },
  });

export default makeStyles;
