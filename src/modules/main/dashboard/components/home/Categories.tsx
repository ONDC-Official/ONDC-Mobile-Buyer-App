import {useCallback} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {CATEGORIES} from '../../../../../utils/categories';
import {useAppTheme} from '../../../../../utils/theme';
import SectionHeaderWithViewAll from '../../../../../components/sectionHeaderWithViewAll/SectionHeaderWithViewAll';

interface Category {
  id: string;
  name: string;
  shortName: string;
  Icon: string;
  routeName: string;
  domain: string;
}
const Categories = () => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToList = useCallback(() => {
    navigation.navigate('FeaturedCategories');
  }, []);

  const renderItem = useCallback(
    ({item}: {item: Category}) => (
      <TouchableOpacity
        style={styles.category}
        onPress={() =>
          navigation.navigate('CategoryDetails', {
            category: item.shortName,
            domain: item.domain,
          })
        }>
        <FastImage source={{uri: item.Icon}} style={styles.imageContainer} />
        <Text
          variant={'labelMedium'}
          style={styles.categoryText}
          numberOfLines={2}
          ellipsizeMode={'tail'}>
          {t(`Featured Categories.${item.name}`)}
        </Text>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <SectionHeaderWithViewAll
        title={t('Home.Featured Categories')}
        viewAll={navigateToList}
      />
      <FlatList
        data={CATEGORIES.slice(0, 8)}
        numColumns={4}
        renderItem={renderItem}
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
      marginTop: 4,
    },
    category: {
      paddingHorizontal: 8,
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
