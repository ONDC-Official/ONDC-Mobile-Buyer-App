import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {withTheme} from 'react-native-paper';
import CustomTabBar from './components/customTabBar/CustomTabBar';
import Home from './components/tabs/Home';
import List from './components/tabs/List';
import Cart from './components/tabs/Cart';
import Profile from './components/tabs/Profile';

interface Dashboard {
}

const Tab = createBottomTabNavigator();

const Dashboard: React.FC<Dashboard> = () => {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen name="Home" component={Home}/>
        <Tab.Screen name="List" component={List}/>
        <Tab.Screen name="Cart" component={Cart}/>
        <Tab.Screen name="Profile" component={Profile}/>
      </Tab.Navigator>
    </>
  );
};

export default withTheme(Dashboard);
