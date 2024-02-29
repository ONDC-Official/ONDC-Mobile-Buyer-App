import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {CATEGORIES} from '../../../../../utils/categories';
import {useAppTheme} from '../../../../../utils/theme';
import SectionHeaderWithViewAll from '../../../../../components/sectionHeaderWithViewAll/SectionHeaderWithViewAll';

const Categories = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToList = () => {
    navigation.navigate('FeaturedCategories');
  };

  const navigateToCategoryDetails = (category: string, domain: string) => {
    navigation.navigate('CategoryDetails', {category, domain});
  };

  return (
    <View style={styles.container}>
      <SectionHeaderWithViewAll
        title={'Featured Categories'}
        viewAll={navigateToList}
      />
      <FlatList
        data={CATEGORIES.slice(0, 8)}
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
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 20,
    },
    categoryText: {
      color: colors.neutral400,
      textAlign: 'center',
    },
    category: {
      marginHorizontal: 16,
      marginTop: 12,
      flex: 1,
      alignItems: 'center',
    },
    imageContainer: {
      height: 67,
      width: 67,
    },
  });

export default Categories;
