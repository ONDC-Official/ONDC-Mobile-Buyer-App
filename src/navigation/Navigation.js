import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../modules/authentication/login/Login';
import Splash from '../modules/authentication/splash/Splash';
import SignUp from '../modules/authentication/signUp/SignUp';
import Landing from '../modules/authentication/landing/Landing';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Products from '../modules/main/product/Products';
import Cart from '../modules/main/cart/Cart';
import Order from '../modules/main/order/Order';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Dashboard = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Products"
        component={Products}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Cart" component={Cart} options={{headerShown: false}} />
      <Tab.Screen
        name="Order"
        component={Order}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

/**
 * Component for stack navigation
 * @returns {JSX.Element}
 * @constructor
 */
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        /> */}
        {/* <Stack.Screen
          name="Landing"
          component={Landing}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
