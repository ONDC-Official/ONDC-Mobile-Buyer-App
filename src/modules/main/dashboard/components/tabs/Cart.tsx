import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Cart from '../../../cart/Cart';
import {useAppTheme} from '../../../../../utils/theme';
import { useTranslation } from 'react-i18next';

const DashboardCart = () => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant={'titleLarge'} style={styles.pageTitle}>
          {t('Cart.My Cart')}
        </Text>
      </View>
      <Cart />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      padding: 16,
    },
    pageTitle: {
      color: colors.neutral400,
    },
  });

export default DashboardCart;
