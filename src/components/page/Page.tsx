import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {useAppTheme} from '../../utils/theme';
import useFormatNumber from '../../hooks/useFormatNumber';

interface Page {
  children: React.ReactNode;
  outletId?: string;
}

const Page: React.FC<Page> = ({children, outletId = ''}) => {
  const {formatNumber} = useFormatNumber();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {cartItems} = useSelector(({cart}) => cart);
  const styles = makeStyles(theme.colors);

  const {index, count} = useMemo(() => {
    if (outletId !== '') {
      const cartIndex = cartItems.findIndex(
        (one: any) => one.location_id === outletId,
      );
      if (cartIndex > -1) {
        return {index: cartIndex, count: cartItems[cartIndex].items.length};
      } else {
        return {index: -1, count: 0};
      }
    } else {
      return {index: -1, count: 0};
    }
  }, [outletId, cartItems]);

  return (
    <View style={styles.pageContainer}>
      {children}
      {index > -1 && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SubCart', {index: index})}>
            <Text variant={'bodyLarge'} style={styles.text}>
              {formatNumber(count)}{' '}
              {count > 1 ? t('Page.Items Added') : t('Page.Item Added')}
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
      marginBottom: 16,
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
