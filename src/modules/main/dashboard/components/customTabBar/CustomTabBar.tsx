import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {useAppTheme} from '../../../../../utils/theme';

interface TabIcon {
  name: string;
  isFocused: boolean;
}

const TabIcon: React.FC<TabIcon> = ({name, isFocused}) => {
  const theme = useAppTheme();

  if (isFocused) {
    switch (name) {
      case 'Home':
        return (
          <FeatherIcon name={'home'} size={24} color={theme.colors.white} />
        );
      case 'Orders':
        return (
          <MaterialIcon
            name={'list-alt'}
            size={24}
            color={theme.colors.white}
          />
        );
      default:
        return <AntIcon name={'user'} size={24} color={theme.colors.white} />;
    }
  } else {
    switch (name) {
      case 'Home':
        return (
          <FeatherIcon
            name={'home'}
            size={24}
            color={theme.colors.neutral300}
          />
        );
      case 'Orders':
        return (
          <MaterialIcon
            name={'list-alt'}
            size={24}
            color={theme.colors.neutral300}
          />
        );
      default:
        return (
          <AntIcon name={'user'} size={24} color={theme.colors.neutral300} />
        );
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

          const tabLabel = t(`${label}.${label}`);

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
                {isFocused ? (
                  <Text variant={'labelLarge'} style={styles.activeButtonText}>
                    {tabLabel}
                  </Text>
                ) : (
                  <Text variant={'labelSmall'} style={styles.tabText}>
                    {tabLabel}
                  </Text>
                )}
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
      gap: 6,
    },
    tab: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      width: '100%',
      height: 36,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    activeButton: {
      backgroundColor: colors.primary,
    },
    activeButtonText: {
      fontWeight: '600',
      color: '#fff',
    },
    tabText: {
      color: colors.neutral300,
    },
  });

export default CustomTabBar;
