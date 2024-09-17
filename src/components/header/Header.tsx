import React from 'react';
import {Text} from 'react-native-paper';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from '../../utils/theme';

const Header = ({label, search, wishlist, cart}: any) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation: any = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const openSearch = () => {
    navigation.navigate('SearchProducts');
  };
  const openWishlist = () => {
    navigation.navigate('List');
  };
  const openCart = () => {
    navigation.navigate('DashboardCart');
  };

  return (
    <View>
      <StatusBar
        backgroundColor={theme.colors.white}
        barStyle={'dark-content'}
      />
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <TouchableOpacity onPress={goBack}>
            <MaterialIcons
              name={'arrow-back'}
              size={24}
              color={theme.colors.neutral400}
            />
          </TouchableOpacity>
          <Text
            variant={'titleLarge'}
            style={styles.pageTitle}
            numberOfLines={1}>
            {label}
          </Text>
        </View>
        <View style={styles.actionContainer}>
          {search && (
            <TouchableOpacity onPress={openSearch}>
              <MaterialIcons
                name={'search'}
                size={24}
                color={theme.colors.neutral400}
              />
            </TouchableOpacity>
          )}
          {wishlist && (
            <TouchableOpacity onPress={openWishlist}>
              <MaterialCommunityIcons
                name={'heart-outline'}
                size={24}
                color={theme.colors.neutral400}
              />
            </TouchableOpacity>
          )}
          {cart && (
            <TouchableOpacity onPress={openCart}>
              <MaterialCommunityIcons
                name={'cart-outline'}
                size={24}
                color={theme.colors.neutral400}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    header: {
      height: 48,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.white,
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      flex: 1,
    },
    pageTitle: {
      color: colors.neutral400,
      flex: 1,
    },
    actionContainer: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  });

export default Header;
