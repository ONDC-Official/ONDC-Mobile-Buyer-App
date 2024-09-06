import React, {useCallback, useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useAppTheme} from '../../../../utils/theme';
import useSubCategoryName from '../../../../hooks/useSubCategoryName';

interface SubCategories {
  currentCategory: string;
  categoryDomain: string;
}

const SubCategories: React.FC<SubCategories> = ({
  currentCategory,
  categoryDomain,
}) => {
  const {getSubcategoryName} = useSubCategoryName();
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {categories} = useSelector((state: any) => state.categories);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const navigateToSubCategory = (subCategory: any) => {
    navigation.navigate('SubCategoryDetails', {
      subCategory: subCategory.code,
      category: currentCategory,
      categoryDomain,
    });
  };

  const list = useMemo(() => {
    if (categories) {
      let data = categories[categoryDomain];
      if (data?.length > 0) {
        return data;
      } else {
        return [];
      }
    }
  }, [categoryDomain]);

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      if (item.value === 'Empty') {
        return <View key={item.key} style={styles.brand} />;
      }
      let name = getSubcategoryName(item.code, item.label);

      return (
        <TouchableOpacity
          style={styles.brand}
          onPress={() => navigateToSubCategory(item)}>
          <FastImage source={{uri: item.url}} style={styles.brandImage} />
          <Text
            variant={'labelLarge'}
            style={styles.name}
            ellipsizeMode={'tail'}>
            {name}
          </Text>
        </TouchableOpacity>
      );
    },
    [navigateToSubCategory, t],
  );

  const headerComponent = () => {
    return (
      <Text variant="titleLarge" style={styles.headerText}>
        {currentCategory}
      </Text>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.container}>
        <FlatList
          data={list}
          numColumns={3}
          ListHeaderComponent={headerComponent}
          keyExtractor={item => item.code}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    sectionContainer: {},
    container: {
      paddingHorizontal: 24,
      marginBottom: -12,
      marginHorizontal: -16,
    },
    title: {
      color: colors.neutral400,
      marginBottom: 12,
    },
    brand: {
      flexGrow: 1,
      width: '25%',
      marginVertical: 8,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    alignCenter: {
      alignItems: 'center',
    },
    alignEnd: {
      alignItems: 'flex-end',
    },
    marginBottom: {
      marginBottom: 16,
    },
    secondItem: {
      marginBottom: 20,
    },
    brandImage: {
      borderRadius: 10,
      width: '100%',
      height: 83,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    name: {
      flex: 1,
      color: colors.neutral400,
      textAlign: 'center',
      marginHorizontal: 8,
    },
    headerText: {paddingHorizontal: 8},
  });
export default SubCategories;
