import {Text} from 'react-native-paper';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../utils/theme';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
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
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <FastImage
            source={require('../../assets/arrow_back.png')}
            style={styles.backArrow}
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
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      backgroundColor: colors.white,
    },
    pageTitle: {
      color: colors.neutral400,
    },
    backArrow: {
      height: 16,
      width: 16,
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
