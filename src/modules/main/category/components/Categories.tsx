import React, {useCallback, useEffect, useRef} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {CATEGORIES} from '../../../../utils/categories';
import {useAppTheme} from '../../../../utils/theme';
import {FB_DOMAIN} from '../../../../utils/constants';

interface Categories {
  currentCategory: string;
}

const Categories: React.FC<Categories> = ({currentCategory}) => {
  const {t} = useTranslation();
  const flatListRef = useRef<any>(null);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      const name = t(`Featured Categories.${item.name}`);
      const isSelected = item.shortName === currentCategory;

      const navigateToCategory = () => {
        if (item.domain === FB_DOMAIN) {
          navigation.navigate('FBCategoryDetails');
        } else if (item.shortName !== currentCategory) {
          navigation.navigate('CategoryDetails', {
            category: item.shortName,
            domain: item.domain,
          });
        }
      };

      return (
        <TouchableOpacity style={styles.category} onPress={navigateToCategory}>
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
              <FastImage source={{uri: item.Icon}} style={styles.image} />
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
    [currentCategory, t],
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
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.name}
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

export default Categories;
