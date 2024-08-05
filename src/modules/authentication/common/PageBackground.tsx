import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import {useAppTheme} from '../../../utils/theme';

const screenHeight = Dimensions.get('window').height;

const PageBackground = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.flexContainer}>
      <View style={styles.primaryBackground} />
      <View style={styles.whiteBackground} />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    flexContainer: {
      flex: 1,
    },
    primaryBackground: {
      backgroundColor: colors.primary,
      height: screenHeight / 2,
    },
    whiteBackground: {
      backgroundColor: colors.white,
      height: screenHeight / 2,
    },
  });

export default PageBackground;
