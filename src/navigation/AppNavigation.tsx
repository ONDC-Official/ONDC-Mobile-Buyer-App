import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from '../modules/authentication/login/Login';
import SignUp from '../modules/authentication/signUp/SignUp';
import Splash from '../modules/authentication/splash/Splash';
import AddDefaultAddress from '../modules/main/profile/AddDefaultAddress';
import Dashboard from '../modules/main/dashboard/Dashboard';
import AddressList from '../modules/main/dashboard/components/address/AddressList';
import Cart from '../modules/main/cart/Cart';
import ProductDetails from '../modules/main/product/details/ProductDetails';
import Profile from '../modules/main/profile/Profile';
import OrderDetails from '../modules/main/order/details/OrderDetails';
import UpdateAddress from '../modules/main/dashboard/components/address/UpdateAddress';
import CategoryDetails from '../modules/main/category/CategoryDetails';
import BrandDetails from '../modules/main/provider/BrandDetails';
import SubCategoryDetails from '../modules/main/subCategory/SubCategoryDetails';
import Outlets from '../modules/main/provider/Outlets';
import Orders from '../modules/main/order/list/Orders';
import CancelOrder from '../modules/main/order/details/CancelOrder';

const Stack = createStackNavigator();

interface AppNavigation {
  navigationRef: any;
}

const headerStyle = {
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowColor: 'black',
  shadowOpacity: 1,
  shadowRadius: 3.84,
  elevation: 15,
};

/**
 * Component for stack navigation
 * @returns {JSX.Element}
 * @constructor
 */
const AppNavigation: React.FC<AppNavigation> = ({navigationRef}) => {
  return (
    <NavigationContainer ref={navigationRef}>
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
          name="Cart"
          component={Cart}
          options={{
            title: 'My Cart',
            headerStyle,
          }}
        />
        <Stack.Screen
          name="AddDefaultAddress"
          component={AddDefaultAddress}
          options={{
            title: 'Add Address',
            headerStyle,
          }}
        />
        <Stack.Screen
          name="UpdateAddress"
          component={UpdateAddress}
          options={{
            title: 'Update Delivery Address',
            headerStyle,
          }}
        />

        <Stack.Screen
          name="AddressList"
          component={AddressList}
          options={{
            title: 'Delivery Address',
            headerStyle,
          }}
        />

        <Stack.Screen
          name="MyProfile"
          component={Profile}
          options={{
            title: 'My Profile',
            headerStyle,
          }}
        />

        <Stack.Screen
          name="Orders"
          component={Orders}
          options={{
            title: 'Order History',
            headerStyle,
          }}
        />

        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{
            headerStyle,
          }}
        />

        <Stack.Screen
          name="CategoryDetails"
          component={CategoryDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SubCategoryDetails"
          component={SubCategoryDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CancelOrder"
          component={CancelOrder}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BrandDetails"
          component={BrandDetails}
          options={{
            headerStyle,
          }}
        />
        <Stack.Screen
          name="Outlets"
          component={Outlets}
          options={{
            headerStyle,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
