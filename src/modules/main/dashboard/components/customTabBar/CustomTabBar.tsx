import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import HomeIcon from '../../../../../assets/dashboard/home.svg';
import CartIcon from '../../../../../assets/dashboard/cart.svg';
import ProfileIcon from '../../../../../assets/dashboard/profile.svg';
import HomeActiveIcon from '../../../../../assets/dashboard/home_a.svg';
import CartActiveIcon from '../../../../../assets/dashboard/cart_a.svg';
import ProfileActiveIcon from '../../../../../assets/dashboard/profile_a.svg';
import {useAppTheme} from '../../../../../utils/theme';

interface TabIcon {
  name: string;
  isFocused: boolean;
}

const TabIcon: React.FC<TabIcon> = ({name, isFocused}) => {
  if (isFocused) {
    switch (name) {
      case 'Home':
        return <HomeActiveIcon width={20} height={20} color={'#686868'} />;
      case 'Cart':
        return <CartActiveIcon width={20} height={20} color={'#686868'} />;
      default:
        return <ProfileActiveIcon width={20} height={20} color={'#686868'} />;
    }
  } else {
    switch (name) {
      case 'Home':
        return <HomeIcon width={20} height={20} color={'#fff'} />;
      case 'Cart':
        return <CartIcon width={20} height={20} color={'#fff'} />;
      default:
        return <ProfileIcon width={20} height={20} color={'#fff'} />;
    }
  }
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {cartItems} = useSelector(({cart}) => cart);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setVisible(false);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setVisible(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (visible) {
    return (
      <View style={[styles.container, styles.boxShadow]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label = route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const badge = cartItems?.length;

          return (
            <View key={route.name} style={styles.tab}>
              <TouchableOpacity
                style={[styles.button, isFocused ? styles.activeButton : {}]}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}>
                <TabIcon name={route.name} isFocused={isFocused} />
                <Text
                  variant={'labelMedium'}
                  style={isFocused ? styles.activeButtonText : styles.tabText}>
                  {t(`${label}.${label}`)}
                </Text>
                {route.name === 'Cart' && badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>{badge}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }

  return <></>;
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    boxShadow: {
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowOffset: {width: 0, height: -4},
      shadowOpacity: 13 / 100,
      shadowRadius: 0,
      elevation: 13,
    },
    container: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 16,
      height: 64,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      backgroundColor: colors.white,
    },
    tab: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    activeButton: {
      backgroundColor: colors.primary,
    },
    activeButtonText: {
      fontWeight: '600',
      color: '#fff',
      marginLeft: 6,
    },
    tabText: {
      color: colors.neutral300,
      marginLeft: 6,
    },
    badge: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: colors.primary200,
      borderRadius: 12,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    badgeLabel: {color: colors.white, fontSize: 10},
  });

export default CustomTabBar;
