import {Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '../../../../utils/theme';
import CartIcon from '../../../../assets/cart.svg';

const EmptyCart = () => {
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.emptyCart}>
      <View style={styles.emptyCartDetails}>
        <CartIcon width={128} height={128} />
        <Text variant={'headlineSmall'} style={styles.title}>
          Your Cart is Empty
        </Text>
        <Text variant="bodySmall" style={styles.emptyDescription}>
          It seems you haven’t added any products in your cart
        </Text>
      </View>
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
      paddingHorizontal: 25,
    },
    title: {
      color: colors.neutral400,
      marginTop: 15,
    },
    emptyDescription: {
      marginVertical: 8,
      color: colors.neutral400,
    },
  });

export default EmptyCart;
