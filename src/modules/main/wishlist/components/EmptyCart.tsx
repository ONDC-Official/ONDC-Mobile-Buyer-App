import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../../../utils/theme';
import WishlistIcon from '../../../../assets/wishlist.svg';
import {useNavigation} from '@react-navigation/native';

const EmptyCart = () => {
  const {t} = useTranslation();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const navigation: any = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.emptyCart}>
      <View style={styles.emptyCartDetails}>
        <WishlistIcon width={128} height={128} />
        <Text variant={'headlineSmall'} style={styles.title}>
          {t('WishList.Your Wishlist is empty')}
        </Text>
        <Text variant="bodySmall" style={styles.emptyDescription}>
          {t(
            'WishList.Save your favorites in your wishlist. Review them anytime and easily add them to your cart.',
          )}
        </Text>
      </View>
      <TouchableOpacity style={styles.shopNowButton} onPress={goBack}>
        <Text variant="bodyLarge" style={styles.shopNowText}>
          Shop Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    emptyCart: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyCartDetails: {
      alignItems: 'center',
      width: 260,
    },
    title: {
      color: colors.neutral400,
      marginTop: 15,
    },
    emptyDescription: {
      marginVertical: 8,
      color: colors.neutral400,
      textAlign: 'center',
    },
    shopNowButton: {
      height: 44,
      width: 156,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 32,
    },
    shopNowText: {
      color: colors.primary,
    },
  });

export default EmptyCart;
