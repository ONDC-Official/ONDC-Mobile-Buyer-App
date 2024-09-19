import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import CustomTabBar from './components/customTabBar/CustomTabBar';
import Home from './components/tabs/Home';
import Orders from './components/tabs/Orders';
import Profile from './components/tabs/Profile';
import useCartItems from '../../../hooks/useCartItems';
import useWishlistItems from '../../../hooks/useWishlistItems';
import useRefreshToken from '../../../hooks/useRefreshToken';
import useCategoryDetails from '../../../hooks/useCategoryDetails';
import {useAppTheme} from '../../../utils/theme';

interface Dashboard {}

const Tab = createBottomTabNavigator();

const Dashboard: React.FC<Dashboard> = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {getCartItems} = useCartItems();
  const {getWishlistItems} = useWishlistItems();
  const {getUserToken} = useRefreshToken();
  const {getCategoryDetails} = useCategoryDetails();

  useEffect(() => {
    getCategoryDetails().then(() => {});
    getCartItems().then(() => {});
    getUserToken().then(() => {});
    getWishlistItems().then(() => {});
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea} />
      <SafeAreaView style={styles.bottomSafeArea}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Home"
          tabBar={props => <CustomTabBar {...props} />}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Orders" component={Orders} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </SafeAreaView>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {flex: 1},
    topSafeArea: {
      flex: 0,
      backgroundColor: colors.primary,
    },
    bottomSafeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });

export default Dashboard;
