import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {useAppTheme} from '../../utils/theme';
import useStatusBarColor from '../../hooks/useStatusBarColor';

const SafeAreaPage = ({children}: {children: any}) => {
  const theme: any = useAppTheme();
  const styles = makeStyles(theme.colors);
  useStatusBarColor('dark-content', theme.colors.white);

  return <SafeAreaView style={styles.pageBackground}>{children}</SafeAreaView>;
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageBackground: {
      backgroundColor: colors.white,
      flex: 1,
    },
  });

export default SafeAreaPage;
