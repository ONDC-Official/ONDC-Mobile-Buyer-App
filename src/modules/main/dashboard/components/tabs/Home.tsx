import React, {useRef} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import Header from '../header/Header';
import Categories from '../home/Categories';
import {useAppTheme} from '../../../../../utils/theme';
import StoresNearMe from '../../../category/components/StoresNearMe';
import AddressSheet from '../address/AddressSheet';

const Home = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const addressSheet = useRef<any>();

  const openAddressList = () => {
    addressSheet.current.open();
  };

  return (
    <View style={styles.container}>
      <Header onPress={openAddressList} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Categories />
        <StoresNearMe />
      </ScrollView>
      <AddressSheet addressSheet={addressSheet} />
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
