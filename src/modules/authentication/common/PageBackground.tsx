import {StyleSheet, View} from 'react-native';
import React from 'react';
import { useAppTheme } from "../../../utils/theme";

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
      flex: 1,
    },
    whiteBackground: {
      backgroundColor: colors.white,
      flex: 1,
    },
  });

export default PageBackground;
