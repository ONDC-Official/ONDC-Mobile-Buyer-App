import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBar from './components/customTabBar/CustomTabBar';
import Home from './components/tabs/Home';
import List from './components/tabs/List';
import Profile from './components/tabs/Profile';
import DashboardCart from './components/tabs/Cart';
import useCartItems from '../../../hooks/useCartItems';

interface Dashboard {}

const Tab = createBottomTabNavigator();

const Dashboard: React.FC<Dashboard> = () => {
  const {getCartItems} = useCartItems();

  useEffect(() => {
    getCartItems().then(() => {});
  }, []);

  return (
    <>
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
    </>
  );
};

export default Dashboard;
