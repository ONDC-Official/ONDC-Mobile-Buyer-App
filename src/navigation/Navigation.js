import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

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
import Profile from '../modules/main/profile/Profile';
import Support from '../modules/main/support/Support';
import Order from '../modules/main/order/Order';
import OrderDetails from '../modules/main/order/OrderDetails';
import CallSeller from '../modules/main/order/CallSeller';
import CancelOrder from '../modules/main/order/CancelOrder';
import ReturnOrder from '../modules/main/order/ReturnOrder';
import UpdateAddress from '../modules/main/dashboard/components/UpdateAddress';
import RaiseComplaint from '../modules/main/order/RaiseComplaint';
import UpdateBillingAddress from '../modules/main/payment/billingAddress/UpdateBillingAddress';

const Stack = createNativeStackNavigator();

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
            title: 'Add Address',
          }}
        />
        <Stack.Screen
          name="UpdateAddress"
          component={UpdateAddress}
          options={{
            title: 'Update Delivery Address',
          }}
        />

        <Stack.Screen
          name="AddressList"
          component={AddressList}
          options={{
            title: 'Delivery Address',
          }}
        />

        <Stack.Screen
          name="BillingAddressPicker"
          component={BillingAddressPicker}
          options={{
            title: 'Billing Address',
          }}
        />

        <Stack.Screen
          name="AddBillingAddress"
          component={AddBillingAddress}
          options={{
            title: 'Add Billing Address',
          }}
        />

        <Stack.Screen
          name="UpdateBillingAddress"
          component={UpdateBillingAddress}
          options={{
            title: 'Update Billing Address',
          }}
        />

        <Stack.Screen name="Confirmation" component={Confirmation} />

        <Stack.Screen name="Payment" component={Payment} />

        <Stack.Screen name="Profile" component={Profile} />

        <Stack.Screen name="Orders" component={Order} />

        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={{
            title: '',
          }}
        />

        <Stack.Screen
          name="CallSeller"
          component={CallSeller}
          options={{
            title: 'Provider Contact Details',
          }}
        />

        <Stack.Screen
          name="CancelOrder"
          component={CancelOrder}
          options={{
            title: 'Cancel Order',
          }}
        />

        <Stack.Screen
          name="ReturnOrder"
          component={ReturnOrder}
          options={{
            title: 'Return Order',
          }}
        />

        <Stack.Screen
          name="RaiseComplaint"
          component={RaiseComplaint}
          options={{
            title: 'Raise Complaint',
          }}
        />

        <Stack.Screen name="Support" component={Support} />

        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
