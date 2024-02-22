import React from 'react';
import {StyleSheet, View} from 'react-native';
import Header from '../header/Header';
import Categories from '../home/Categories';
import AllProviders from '../home/AllProviders';
import {useAppTheme} from '../../../../../utils/theme';

const Home = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Header />
      <Categories />
      <AllProviders />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });

export default Home;
