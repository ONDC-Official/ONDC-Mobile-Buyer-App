import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../Header';
import Categories from '../home/Categories';
import TopBrands from '../home/TopBrands';

const Home = () => {
  const styles = makeStyles();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <Header onSearchFocus={() => navigation.navigate('SearchProducts')}  />
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
