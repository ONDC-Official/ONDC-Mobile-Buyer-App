import React from 'react';
import {StyleSheet, View} from 'react-native';
import Categories from '../home/Categories';
import TopBrands from '../home/TopBrands';
import Header from '../Header';

const Home = () => {
  const styles = makeStyles();

  return (
    <View style={styles.container}>
      <Header />
      <Categories />
      <TopBrands />
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });

export default Home;
