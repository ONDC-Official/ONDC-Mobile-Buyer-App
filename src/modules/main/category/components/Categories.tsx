import React, {useCallback, useEffect, useRef} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {CATEGORIES} from '../../../../utils/categories';
import {useAppTheme} from '../../../../utils/theme';

interface Categories {
  currentCategory: string;
}

const Categories: React.FC<Categories> = ({currentCategory}) => {
  const {t} = useTranslation();
  const flatListRef = useRef<any>(null);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const navigateToCategory = (category: any) => {
    if (category.shortName !== currentCategory) {
      navigation.navigate('CategoryDetails', {
        category: category.shortName,
        domain: category.domain,
      });
    }
  };

  const renderItem = useCallback(
    ({item, index}: {item: any; index: number}) => {
      const name = t(`Featured Categories.${item.name}`);
      const numberOfLines = name.split(' ')[0].length > 8 ? 1 : 2;

      return (
        <TouchableOpacity
          style={[styles.category, index === 0 ? styles.first : {}]}
          onPress={() => navigateToCategory(item)}>
          <View
            style={[
              styles.imageContainer,
              item.shortName === currentCategory
                ? styles.selected
                : styles.normal,
            ]}>
            <FastImage source={{uri: item.Icon}} style={styles.image} />
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
    [navigateToCategory, currentCategory, t],
  );

  useEffect(() => {
    if (currentCategory) {
      const index = CATEGORIES.findIndex(
        (one: any) => one.shortName === currentCategory,
      );
      setTimeout(() => {
        flatListRef.current.scrollToIndex({animated: true, index});
      }, 500);
    }
  }, [currentCategory]);

  return (
    <View style={styles.container}>
      <FlatList
        initialNumToRender={50}
        ref={flatListRef}
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.name}
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
      paddingTop: 16,
    },
    categoryText: {
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    category: {
      alignItems: 'center',
      marginRight: 24,
      width: 59,
      padding: 0,
    },
    first: {
      paddingLeft: 16,
      width: 75,
    },
    imageContainer: {
      height: 56,
      width: 56,
      marginBottom: 6,
      backgroundColor: colors.neutral100,
      padding: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 28,
    },
    image: {
      height: 44,
      width: 44,
    },
    selected: {
      borderColor: colors.primary,
    },
    normal: {
      borderColor: colors.neutral100,
    },
  });

export default Categories;
