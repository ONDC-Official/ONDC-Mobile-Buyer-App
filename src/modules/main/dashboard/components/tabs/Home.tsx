import React, {useRef} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Draggable from 'react-native-draggable';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Header from '../header/Header';
import Categories from '../home/Categories';
import {useAppTheme} from '../../../../../utils/theme';
import StoresNearMe from '../../../category/components/StoresNearMe';
import AddressSheet from '../address/AddressSheet';

import {CATEGORIES} from '../../../../../utils/categories';

const Home = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const addressSheet = useRef<any>();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const openAddressList = () => {
    addressSheet.current.open();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Header onPress={openAddressList} />
      <Categories />
      <StoresNearMe />
      <AddressSheet addressSheet={addressSheet} />
      <Draggable
        renderSize={50}
        x={150}
        y={300}
        imageSource={require('../../../../../assets/Categories.png')}
        isCircle
        onShortPressRelease={() =>
          navigation.navigate('CategoryDetails', {
            category: CATEGORIES[0].shortName,
            domain: CATEGORIES[0].domain,
          })
        }
      />
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
