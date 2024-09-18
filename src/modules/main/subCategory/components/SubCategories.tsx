import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';

import {useAppTheme} from '../../../../utils/theme';
import useSubCategoryName from '../../../../hooks/useSubCategoryName';

interface SubCategories {
  currentCategory: string;
  currentSubCategory: string;
  categoryDomain: string;
  setCurrentSubCategory: (newSubCategory: string) => void;
}

const SubCategories: React.FC<SubCategories> = ({
  currentSubCategory,
  categoryDomain,
  setCurrentSubCategory,
}) => {
  const {getSubcategoryName} = useSubCategoryName();
  const {categories} = useSelector((state: any) => state.categories);
  const flatListRef = useRef<any>(null);
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const updateSubCategory = (subCategory: any) => {
    if (subCategory.code !== currentSubCategory) {
      setCurrentSubCategory(subCategory.code);
    }
  };

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      const name = getSubcategoryName(item.code, item.label);
      const isSelected = item?.code === currentSubCategory;
      return (
        <TouchableOpacity
          style={styles.category}
          onPress={() => updateSubCategory(item)}>
          <View
            style={[
              styles.categoryBorder,
              isSelected ? styles.activeCategory : {},
            ]}
          />

          <View style={styles.categoriesView}>
            <View
              style={[
                styles.imageContainer,
                isSelected ? styles.selected : styles.normal,
              ]}>
              <FastImage source={{uri: item.url}} style={styles.image} />
            </View>
            <Text
              variant={isSelected ? 'labelLarge' : 'labelMedium'}
              style={styles.categoryText}>
              {name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [currentSubCategory, updateSubCategory, styles],
  );

  useEffect(() => {
    setSubCategories(categories[categoryDomain]);
  }, [categoryDomain]);

  useEffect(() => {
    if (subCategories.length > 0 && currentSubCategory) {
      const index = subCategories.findIndex(
        one => one.code === currentSubCategory,
      );
      setTimeout(() => {
        flatListRef.current.scrollToIndex({animated: true, index});
      }, 50);
    }
  }, [subCategories, currentSubCategory]);

  return (
    <View style={styles.container}>
      <FlatList
        initialNumToRender={50}
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        data={subCategories}
        renderItem={renderItem}
        keyExtractor={item => item.code}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {marginTop: 20},
    categoryText: {
      color: colors.neutral400,
      textAlign: 'center',
      lineHeight: 14,
      paddingHorizontal: 4,
    },
    categoryBorder: {
      height: '100%',
      width: 4,
      borderRadius: 10,
      backgroundColor: colors.white,
    },
    activeCategory: {
      backgroundColor: colors.primary,
    },
    category: {
      flexDirection: 'row',
    },
    categoriesView: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      marginLeft: 4,
    },
    imageContainer: {
      height: 52,
      width: 52,
      marginBottom: 4,
      backgroundColor: colors.neutral100,
      padding: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 28,
    },
    image: {
      height: 36,
      width: 36,
    },
    selected: {
      borderColor: colors.primary,
    },
    normal: {
      borderColor: colors.neutral100,
    },
  });

export default SubCategories;
