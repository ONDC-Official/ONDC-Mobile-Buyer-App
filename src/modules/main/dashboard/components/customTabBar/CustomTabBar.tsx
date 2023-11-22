import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Caption from '../../../../../components/typography/Caption';

interface TabIcon {
  name: string;
  isFocused: boolean;
}

const TabIcon: React.FC<TabIcon> = ({name, isFocused}) => {
  switch (name) {
    case 'Home':
      return (
        <Icon name={'home'} color={isFocused ? '#fff' : '#686868'} size={20} />
      );
    case 'List':
      return (
        <Icon name={'heart'} color={isFocused ? '#fff' : '#686868'} size={20} />
      );
    case 'Cart':
      return (
        <Icon name={'bag'} color={isFocused ? '#fff' : '#686868'} size={20} />
      );
    default:
      return (
        <Icon name={'user'} color={isFocused ? '#fff' : '#686868'} size={20} />
      );
  }
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

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
              <Caption
                variant={'caption1'}
                textStyle={
                  isFocused ? styles.activeButtonText : styles.tabText
                }>
                {label}
              </Caption>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
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
      color: '#686868',
      marginLeft: 6,
    },
  });

export default CustomTabBar;
