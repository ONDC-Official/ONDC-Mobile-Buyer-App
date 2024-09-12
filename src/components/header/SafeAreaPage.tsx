import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import React from 'react';
import {hasNotch} from 'react-native-device-info';
import {useAppTheme} from '../../utils/theme';
import Header from '../../components/header/Header';

const SafeAreaPage = ({children}: {children: any}) => {
  const theme: any = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <SafeAreaView style={[styles.pageBackground, styles.androidPaddingBottom]}>
      <StatusBar
        backgroundColor={theme.colors.white}
        barStyle={'dark-content'}
      />
      {children}
    </SafeAreaView>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageBackground: {
      backgroundColor: colors.white,
      flex: 1,
    },
    androidPaddingBottom: {
      paddingBottom: hasNotch() ? 0 : 16,
    },
  });

export default SafeAreaPage;
