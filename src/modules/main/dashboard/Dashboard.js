import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {withBadge} from 'react-native-elements';
import {useTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Cart from '../cart/Cart';
import More from '../more/More';
import Order from '../order/Order';
import Products from '../product/list/Products';

const Tab = createBottomTabNavigator();

const tabIconColor = (focused, highlightedColor, tabColor) => focused ? highlightedColor : tabColor;

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
    <Tab.Navigator screenOptions={{
      tabBarStyle:  { height: 60 }}
    }>
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
                color={tabIconColor(tabInfo.focused, theme.colors.accentColor, theme.colors.tabColor)}
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
                color={tabIconColor(tabInfo.focused, theme.colors.accentColor, theme.colors.tabColor)}
              />
            ) : (
              <Icon
                name="cart"
                size={24}
                color={tabIconColor(tabInfo.focused, theme.colors.accentColor, theme.colors.tabColor)}
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
                color={tabIconColor(tabInfo.focused, theme.colors.accentColor, theme.colors.tabColor)}
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
                color={tabIconColor(tabInfo.focused, theme.colors.accentColor, theme.colors.tabColor)}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Dashboard;
