import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

const PageBackground = () => {
  const theme = useTheme();
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
      flex: 1,
    },
    whiteBackground: {
      backgroundColor: '#fff',
      flex: 1,
    },
  });

export default PageBackground;
