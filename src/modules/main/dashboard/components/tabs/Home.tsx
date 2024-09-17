import React, {useCallback, useMemo, useRef} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Header from '../header/Header';
import Categories from '../home/Categories';
import {useAppTheme} from '../../../../../utils/theme';
import StoresNearMe from '../../../category/components/StoresNearMe';
import AddressSheet from '../address/AddressSheet';

import CategoryMenu from '../home/CategoryMenu';

const Home = () => {
  const theme = useAppTheme();
  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);
  const addressSheet = useRef<any>();

  const openAddressList = useCallback(() => {
    addressSheet.current?.open();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Header onPress={openAddressList} />
      <Categories />
      <StoresNearMe />
      <AddressSheet addressSheet={addressSheet} />
      <CategoryMenu />
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
