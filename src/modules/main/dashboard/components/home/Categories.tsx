import {FlatList, Image, StyleSheet, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';

import {CATEGORIES} from '../../../../../utils/constants';

const Categories = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View>
      <FlatList
        data={CATEGORIES}
        numColumns={4}
        renderItem={({item}) => (
          <View style={styles.category}>
            <View style={styles.imageContainer}>
              <Image source={item.Icon} style={styles.imageContainer} />
            </View>
            <Text variant={'labelSmall'} style={styles.categoryText}>
              {item.name}
            </Text>
          </View>
        )}
        keyExtractor={item => item.name}
      />
      <View style={styles.viewAllContainer}>
        <Button mode={'outlined'} style={styles.viewAllButton}>
          View all
        </Button>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    categoryText: {
      fontWeight: '700',
      textAlign: 'center',
    },
    category: {
      padding: 12,
      flex: 1,
      alignItems: 'center',
    },
    imageContainer: {
      height: 67,
      width: 67,
    },
    viewAllContainer: {
      paddingTop: 24,
      alignItems: 'center',
    },
    viewAllButton: {
      borderColor: colors.primary,
    },
  });

export default Categories;
