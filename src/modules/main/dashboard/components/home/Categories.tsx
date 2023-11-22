import {FlatList, Image, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import {CATEGORIES} from '../../../../../utils/constants';
import Caption from '../../../../../components/typography/Caption';

const Categories = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <FlatList
      data={CATEGORIES}
      numColumns={4}
      renderItem={({item}) => (
        <View style={styles.category}>
          <View style={styles.imageContainer}>
            <Image source={item.Icon} style={styles.imageContainer} />
          </View>
          <Caption variant={'caption1'} textStyle={styles.categoryText}>
            {item.name}
          </Caption>
        </View>
      )}
      keyExtractor={item => item.name}
    />
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    categoryText: {
      fontWeight: '700',
      textAlign: 'center',
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

export default Categories;
