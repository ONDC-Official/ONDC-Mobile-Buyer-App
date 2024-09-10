import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
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
  currentCategory,
  currentSubCategory,
  categoryDomain,
  setCurrentSubCategory,
}) => {
  const {getSubcategoryName} = useSubCategoryName();
  const {categories} = useSelector((state: any) => state.categories);
  const {t} = useTranslation();
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
      return (
        <TouchableOpacity
          style={styles.category}
          onPress={() => updateSubCategory(item)}>
          {item?.code === currentSubCategory ? (
            <View style={styles.activeCat} />
          ) : (
            <></>
          )}

          <View style={styles.categoriesView}>
            <View
              style={[
                styles.imageContainer,
                item?.code === currentSubCategory
                  ? styles.selected
                  : styles.normal,
              ]}>
              <FastImage source={{uri: item.url}} style={styles.image} />
            </View>
            <Text
              variant={
                item?.code === currentSubCategory ? 'labelLarge' : 'labelMedium'
              }
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
    container: {},
    categoryText: {
      color: colors.neutral400,
      textAlign: 'center',
      lineHeight: 14,
      paddingHorizontal: 4,
    },
    activeCat: {
      height: '100%',
      width: 4,
      marginRight: -4,
      backgroundColor: colors.primary,
      borderRadius: 10,
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
    first: {
      paddingLeft: 16,
      width: 75,
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
