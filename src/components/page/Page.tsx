import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

interface Page {
  children: React.ReactNode;
}

const Page: React.FC<Page> = ({children}) => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const styles = makeStyles(theme.colors);

  const navigateToCart = () => navigation.navigate('Cart');

  return (
    <>
      {children}
      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.container} onPress={navigateToCart}>
          <Text variant={'titleSmall'} style={styles.text}>
            Items: {cartItems.length}
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
