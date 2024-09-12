import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import React from 'react';
import {useAppTheme} from '../../../utils/theme';

const SafeAreaPage = ({children}: {children: any}) => {
  const theme: any = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <SafeAreaView style={styles.pageBackground}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle={'dark-content'}
      />
      {children}
    </SafeAreaView>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageBackground: {
      backgroundColor: colors.primary,
      flex: 1,
    },
  });

export default SafeAreaPage;
