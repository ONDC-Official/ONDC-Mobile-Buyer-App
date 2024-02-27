import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from '../../utils/theme';

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
    <View style={styles.pageContainer}>
      {children}
      {cartItems.length > 0 && (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={navigateToCart}>
            <Text variant={'bodyLarge'} style={styles.text}>
              {itemQuantity > 1
                ? `${itemQuantity} Items Added`
                : `${itemQuantity} Item Added`}
              , Go To Cart
            </Text>
            <Icon
              name={'keyboard-arrow-right'}
              size={18}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    container: {
      paddingHorizontal: 16,
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 13,
      borderRadius: 8,
    },
    text: {
      color: colors.white,
    },
  });

export default Page;
