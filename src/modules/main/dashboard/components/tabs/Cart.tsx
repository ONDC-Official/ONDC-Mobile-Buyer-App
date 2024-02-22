import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Cart from '../../../cart/Cart';
import {useAppTheme} from '../../../../../utils/theme';

const DashboardCart = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant={'titleSmall'}>My Cart</Text>
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
  });

export default DashboardCart;
