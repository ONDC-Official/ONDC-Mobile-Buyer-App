import React, {useCallback, useMemo, useRef} from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import Draggable from 'react-native-draggable';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Header from '../header/Header';
import Categories from '../home/Categories';
import {useAppTheme} from '../../../../../utils/theme';
import StoresNearMe from '../../../category/components/StoresNearMe';
import AddressSheet from '../address/AddressSheet';

import {CATEGORIES} from '../../../../../utils/categories';

const screenDimensions = Dimensions.get('window');

const Home = () => {
  const theme = useAppTheme();
  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);
  const addressSheet = useRef<any>();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const openAddressList = useCallback(() => {
    addressSheet.current?.open();
  }, []);

  const navigateToCategoryDetails = useCallback(() => {
    navigation.navigate('CategoryDetails', {
      category: CATEGORIES[0].shortName,
      domain: CATEGORIES[0].domain,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Header onPress={openAddressList} />
      <Categories />
      <StoresNearMe />
      <AddressSheet addressSheet={addressSheet} />
      <Draggable
        renderSize={50}
        x={screenDimensions.width - 40}
        y={screenDimensions.height * 0.7}
        imageSource={require('../../../../../assets/dashboard/categories.png')}
        isCircle
        onShortPressRelease={navigateToCategoryDetails}
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
