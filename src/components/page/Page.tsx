import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from '../../utils/theme';
import {useTranslation} from 'react-i18next';

interface Page {
  children: React.ReactNode;
}

const Page: React.FC<Page> = ({children}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);
  const styles = makeStyles(theme.colors);

  const navigateToCart = () => navigation.navigate('Cart');

  const itemCount = cartItems.length;
  return (
    <View style={styles.pageContainer}>
      {children}
      {itemCount > 0 && (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={navigateToCart}>
            <Text variant={'bodyLarge'} style={styles.text}>
              {itemCount}{' '}
              {itemCount > 1 ? t('Page.Items Added') : t('Page.Item Added')}
              {t('Page., Go To Cart')}
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
