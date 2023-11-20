import {useTheme} from 'react-native-paper';
import {FlatList, StyleSheet, View} from 'react-native';
import {CATEGORIES} from '../../../../../utils/constants';
import Caption from '../../../../../components/typography/Caption';

const Home = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        numColumns={4}
        renderItem={({item}) => (
          <View style={styles.category}>
            <View style={styles.imageContainer}>
              <item.Icon/>
            </View>
            <Caption variant={'caption1'} textStyle={styles.categoryText}>
              {item.name}
            </Caption>
          </View>
        )}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    categoryText: {
      fontWeight: '700',
      textAlign: 'center',
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    category: {
      padding: 16,
      flex: 1,
      alignItems: 'center',
    },
    imageContainer: {
      height: 67,
      width: 67,
    },
  });

export default Home;
