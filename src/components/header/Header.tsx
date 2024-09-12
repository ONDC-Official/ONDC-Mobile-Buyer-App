import {Text} from 'react-native-paper';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../utils/theme';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.white}
        barStyle={'dark-content'}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <MaterialIcons
            name={'arrow-back'}
            size={24}
            color={theme.colors.neutral400}
          />
        </TouchableOpacity>
        <Text variant={'titleLarge'} style={styles.pageTitle}>
          {label}
        </Text>
        <View style={styles.iconsView}>
          {search ? (
            <TouchableOpacity onPress={openSearch}>
              <MaterialIcons
                name={'search'}
                size={24}
                color={theme.colors.neutral400}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
          {wishlist ? (
            <TouchableOpacity onPress={openWishlist}>
              <MaterialCommunityIcons
                name={'heart-outline'}
                size={24}
                color={theme.colors.neutral400}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
          {cart ? (
            <TouchableOpacity onPress={openCart}>
              <MaterialCommunityIcons
                name={'cart-outline'}
                size={24}
                color={theme.colors.neutral400}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {},
    header: {
      height: 48,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      backgroundColor: colors.white,
    },
    pageTitle: {
      color: colors.neutral400,
    },
    iconsView: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  });

export default Header;
