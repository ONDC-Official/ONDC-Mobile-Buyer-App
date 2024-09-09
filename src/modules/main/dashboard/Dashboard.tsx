import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import CustomTabBar from './components/customTabBar/CustomTabBar';
import Home from './components/tabs/Home';
import Orders from './../../main/order/list/Orders';
import Profile from './components/tabs/Profile';
import useCartItems from '../../../hooks/useCartItems';
import useRefreshToken from '../../../hooks/useRefreshToken';
import useCategoryDetails from '../../../hooks/useCategoryDetails';
import {Text} from 'react-native-paper';

interface Dashboard {}

const Tab = createBottomTabNavigator();

const Dashboard: React.FC<Dashboard> = () => {
  const {getCartItems} = useCartItems();
  const {getUserToken} = useRefreshToken();
  const {getCategoryDetails} = useCategoryDetails();

  useEffect(() => {
    getCategoryDetails().then(() => {});
    getCartItems().then(() => {});
    getUserToken().then(() => {});
  }, []);

  return (
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
  );
};

export default Dashboard;
