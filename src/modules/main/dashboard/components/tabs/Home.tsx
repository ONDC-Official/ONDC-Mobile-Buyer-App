import {useTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import Categories from '../home/Categories';
import TopBrands from '../home/TopBrands';

const Home = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Categories />
      <TopBrands />
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });

export default Home;
