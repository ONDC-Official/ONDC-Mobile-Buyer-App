import React, {useContext} from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddressPicker from '../modules/main/cart/addressPicker/AddressPicker';
import AddAddress from '../modules/main/cart/addAddress/AddAddress';
import Payment from '../modules/main/cart/payment/Payment';
import More from '../modules/main/more/More';
import Confirmation from '../modules/main/cart/Confirmation';
import Profile from '../modules/main/more/Profile';
import {useTheme, withBadge} from 'react-native-elements';
import {CartContext} from '../context/Cart';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Dashboard = () => {
  const {cart} = useContext(CartContext);
  const {theme} = useTheme();
  const badgeStyles = {
    backgroundColor: theme.colors.accentColor,
    paddingHorizontal: 4,
  };

  const BadgedIcon = withBadge(cart.length, {badgeStyle: badgeStyles})(Icon);

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
            return cart.length > 0 ? (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
