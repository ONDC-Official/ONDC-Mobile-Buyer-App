import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useTheme, withBadge} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Landing from '../modules/authentication/landing/Landing';
import Login from '../modules/authentication/login/Login';
import SignUp from '../modules/authentication/signUp/SignUp';
import Splash from '../modules/authentication/splash/Splash';
import AddAddress from '../modules/main/cart/addAddress/AddAddress';
import AddressPicker from '../modules/main/cart/addressPicker/AddressPicker';
import Cart from '../modules/main/cart/Cart';
import Confirmation from '../modules/main/cart/Confirmation';
import Payment from '../modules/main/cart/payment/Payment';
import More from '../modules/main/more/More';
import Profile from '../modules/main/more/Profile';
import Support from '../modules/main/more/support/Support';
import Order from '../modules/main/order/Order';
import ProductDetails from '../modules/main/product/ProductDetails';
import Products from '../modules/main/product/Products';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Dashboard = () => {
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const {theme} = useTheme();
  const badgeStyles = {
    backgroundColor: theme.colors.accentColor,
    paddingHorizontal: 4,
  };

  const BadgedIcon = withBadge(cartItems.length, {badgeStyle: badgeStyles})(
    Icon,
  );

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Products"
        component={Products}
        options={{
          headerShown: false,
          tabBarIcon: tabInfo => {
            return (
              <Icon
                name="basket"
                size={24}
                color={tabInfo.focused ? theme.colors.accentColor : '#606161'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
          tabBarIcon: tabInfo => {
            return cartItems.length > 0 ? (
              <BadgedIcon
                type="ionicon"
                name="cart"
                size={24}
                color={tabInfo.focused ? theme.colors.accentColor : '#606161'}
              />
            ) : (
              <Icon
                name="cart"
                size={24}
                color={tabInfo.focused ? theme.colors.accentColor : '#606161'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Order}
        options={{
          headerShown: false,
          tabBarIcon: tabInfo => {
            return (
              <Icon
                name="clipboard-edit"
                size={24}
                color={tabInfo.focused ? theme.colors.accentColor : '#606161'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{
          headerShown: false,
          tabBarIcon: tabInfo => {
            return (
              <Icon
                name="dots-horizontal-circle"
                size={24}
                color={tabInfo.focused ? theme.colors.accentColor : '#606161'}
              />
            );
          },
        }}
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
