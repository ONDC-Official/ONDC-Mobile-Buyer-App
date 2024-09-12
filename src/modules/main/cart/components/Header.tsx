import {Text} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../../../utils/theme';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

const Header = ({label, search, wishlist, cart, navigateToHome}: any) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation: any = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
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
          {cart ? (
            <TouchableOpacity
              style={styles.addMoreItems}
              onPress={navigateToHome}>
              <MaterialIcons
                name={'add'}
                size={24}
                color={theme.colors.primary}
              />
              <Text variant={'labelLarge'} style={styles.addMoreItemsLabel}>
                {t('Cart.Add More Items')}
              </Text>
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
    addMoreItems: {
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
    },
    addMoreItemsLabel: {
      color: colors.primary,
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
