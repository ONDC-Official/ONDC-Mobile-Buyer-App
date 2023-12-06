import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {CATEGORIES} from '../../../../../utils/categories';

const Categories = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToCategoryDetails = (category: string, domain: string) => {
    navigation.navigate('CategoryDetails', {category, domain});
  };

  return (
    <View>
      <FlatList
        data={CATEGORIES}
        numColumns={4}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.category}
            onPress={() =>
              navigateToCategoryDetails(item.shortName, item.domain)
            }>
            <FastImage source={item.Icon} style={styles.imageContainer} />
            <Text variant={'labelMedium'} style={styles.categoryText}>
              {item.name}
            </Text>
          </TouchableOpacity>
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
