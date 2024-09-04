import React, {useRef, useState} from 'react';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';

import Header from '../header/Header';
import Categories from '../home/Categories';
import {useAppTheme} from '../../../../../utils/theme';
import StoresNearMe from '../../../category/components/StoresNearMe';
import AddressSheet from '../address/AddressSheet';
import Draggable from 'react-native-draggable';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CATEGORIES} from '../../../../../utils/categories';

const Home = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const addressSheet = useRef<any>();
  const [scroll, setScroll] = useState(true);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const openAddressList = () => {
    addressSheet.current.open();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Header onPress={openAddressList} />
      <Categories />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        scrollEnabled={scroll}>
        <StoresNearMe />
      </ScrollView>
      <AddressSheet addressSheet={addressSheet} />
      <Draggable
        renderSize={50}
        x={150}
        y={300}
        imageSource={require('../../../../../assets/Categories.png')}
        onPressIn={() => setScroll(false)}
        onRelease={() => setScroll(true)}
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
