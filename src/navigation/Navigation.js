import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Landing from '../modules/authentication/landing/Landing';
import Login from '../modules/authentication/login/Login';
import SignUp from '../modules/authentication/signUp/SignUp';
import Splash from '../modules/authentication/splash/Splash';
import AddAddress from '../modules/main/cart/addAddress/AddAddress';
import AddressPicker from '../modules/main/cart/addressPicker/AddressPicker';
import Confirmation from '../modules/main/cart/Confirmation';
import Payment from '../modules/main/cart/payment/Payment';
import Dashboard from '../modules/main/dashboard/Dashboard';
import Profile from '../modules/main/more/Profile';
import Support from '../modules/main/more/support/Support';
import ProductDetails from '../modules/main/product/details/ProductDetails';

const Stack = createStackNavigator();

/**
 * Component for stack navigation
 * @returns {JSX.Element}
 * @constructor
 */
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
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
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddressPicker"
          component={AddressPicker}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddAddress"
          component={AddAddress}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Confirmation"
          component={Confirmation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Support"
          component={Support}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
