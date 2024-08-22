import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {useAppTheme} from '../../../../utils/theme';
import AllOptionsIcon from '../../../../assets/all_options.svg';
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
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const updateSubCategory = (subCategory: any) => {
    if (subCategory.code !== currentSubCategory) {
      setCurrentSubCategory(subCategory.code);
    }
  };

  const navigateToAll = () => {
    navigation.navigate('ShopByCategory', {
      category: currentCategory,
      categoryDomain,
    });
  };

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      const name = getSubcategoryName(item.code, item.label);
      const numberOfLines = name.split(' ')[0].length > 8 ? 1 : 2;
      return (
        <TouchableOpacity
          style={styles.subCategory}
          onPress={() => updateSubCategory(item)}>
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
            variant={'labelMedium'}
            style={styles.categoryText}
            ellipsizeMode={'tail'}
            numberOfLines={numberOfLines}>
            {name}
          </Text>
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
      <TouchableOpacity style={styles.allOptionsButton} onPress={navigateToAll}>
        <View style={styles.allOptionsContainer}>
          <AllOptionsIcon width={21} height={21} />
        </View>
        <Text
          variant={'labelLarge'}
          style={styles.allOptions}
          numberOfLines={2}>
          {t('Cart.All Options')}
        </Text>
      </TouchableOpacity>
      <FlatList
        initialNumToRender={50}
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        data={subCategories}
        horizontal
        renderItem={renderItem}
        keyExtractor={item => item.code}
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
    container: {
      paddingLeft: 16,
      paddingTop: 16,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryText: {
      textAlign: 'center',
      color: colors.neutral400,
      width: 56,
    },
    subCategory: {
      alignItems: 'center',
      marginRight: 24,
      width: 56,
    },
    imageContainer: {
      height: 56,
      width: 56,
      marginBottom: 2,
      backgroundColor: colors.neutral100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      height: 54,
      width: 54,
      borderRadius: 29,
    },
    selected: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    normal: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.neutral100,
    },
    allOptionsContainer: {
      width: 56,
      height: 56,
      borderRadius: 34,
      backgroundColor: colors.primary50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    allOptions: {
      color: colors.primary,
      marginTop: 6,
      textAlign: 'center',
    },
    allOptionsButton: {
      width: 56,
      marginRight: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default SubCategories;
