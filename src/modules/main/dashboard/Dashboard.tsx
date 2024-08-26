import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';

import CustomTabBar from './components/customTabBar/CustomTabBar';
import Home from './components/tabs/Home';
import List from './components/tabs/List';
import Profile from './components/tabs/Profile';
import DashboardCart from './components/tabs/Cart';
import useCartItems from '../../../hooks/useCartItems';
import useRefreshToken from '../../../hooks/useRefreshToken';
import useCategoryDetails from '../../../hooks/useCategoryDetails';

interface Dashboard {}

const Tab = createBottomTabNavigator();

const Dashboard: React.FC<Dashboard> = () => {
  const {getCartItems} = useCartItems();
  const {} = useRefreshToken();
  const {getCategoryDetails} = useCategoryDetails();

  useEffect(() => {
    getCategoryDetails().then(() => {});
    getCartItems().then(() => {});
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="List" component={List} />
      <Tab.Screen name="Cart" component={DashboardCart} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    modalContainer: {
      backgroundColor: colors.white,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 40,
      borderRadius: 20,
      margin: 20,
      alignItems: 'center',
    },
    modalTitle: {
      marginTop: 20,
      marginBottom: 6,
    },
    closeContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      width: '100%',
      marginBottom: 20,
    },
    modalContent: {
      alignItems: 'center',
      textAlign: 'center',
    },
  });
export default Dashboard;
