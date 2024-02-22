import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { useAppTheme } from "../../utils/theme";

interface Page {
  children: React.ReactNode;
}

const Page: React.FC<Page> = ({children}) => {
  const theme = useAppTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const styles = makeStyles(theme.colors);

  const navigateToCart = () => navigation.navigate('Cart');

  useEffect(() => {
    const getSum = (total: number, item: any) =>
      total + item?.item?.quantity?.count;
    if (cartItems) {
      setItemQuantity(cartItems.reduce(getSum, 0));
    } else {
      setItemQuantity(0);
    }
  }, [cartItems]);

  return (
    <>
      {children}
      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.container} onPress={navigateToCart}>
          <Text variant={'titleSmall'} style={styles.text}>
            Items: {itemQuantity}
          </Text>
          <Text variant={'titleMedium'} style={styles.text}>
            View Cart
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.primary,
      padding: 16,
    },
    text: {
      color: colors.white,
    },
  });

export default Page;
