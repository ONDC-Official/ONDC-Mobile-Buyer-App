import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import Login from '../modules/authentication/login/Login';
import SignUp from '../modules/authentication/signUp/SignUp';
import Splash from '../modules/authentication/splash/Splash';
import AddDefaultAddress from '../modules/main/profile/AddDefaultAddress';
import Dashboard from '../modules/main/dashboard/Dashboard';
import AddressList from '../modules/main/dashboard/components/AddressList';
import Cart from '../modules/main/cart/Cart';
import SearchProductList from '../modules/main/product/list/SearchProductList';
import BillingAddressPicker from '../modules/main/payment/billingAddress/BillingAddressPicker';
import AddBillingAddress from '../modules/main/payment/billingAddress/AddBillingAddress';
import Confirmation from '../modules/main/payment/confirmation/Confirmation';
import ProductDetails from '../modules/main/product/details/ProductDetails';
import Payment from '../modules/main/payment/payment/Payment';

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
          name="SearchProductList"
          component={SearchProductList}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Cart" component={Cart} />

        <Stack.Screen
          name="AddDefaultAddress"
          component={AddDefaultAddress}
          options={{
            title: 'Add Delivery Address',
          }}
        />

        <Stack.Screen
          name="AddressList"
          component={AddressList}
          options={{
            title: 'Addresses',
          }}
        />

        <Stack.Screen
          name="BillingAddressPicker"
          component={BillingAddressPicker}
          options={{
            title: 'Select Billing Address',
          }}
        />

        <Stack.Screen
          name="AddBillingAddress"
          component={AddBillingAddress}
          options={{
            title: 'Add Billing Address',
          }}
        />

        <Stack.Screen name="Confirmation" component={Confirmation} />
        <Stack.Screen name="Payment" component={Payment} />
        {/*<Stack.Screen name="Profile" component={Profile}/>*/}
        {/*<Stack.Screen*/}
        {/*  name="Support"*/}
        {/*  component={Support}*/}
        {/*  options={{headerShown: false}}*/}
        {/*/>*/}
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
