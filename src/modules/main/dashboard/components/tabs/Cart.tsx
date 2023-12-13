import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Cart from '../../../cart/Cart';

const DashboardCart = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant={'titleSmall'}>My Cart</Text>
      </View>
      <Cart />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
});

export default DashboardCart;
