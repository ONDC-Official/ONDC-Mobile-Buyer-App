import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {PRODUCT_SUBCATEGORY} from '../../../../utils/categories';
import {useAppTheme} from '../../../../utils/theme';

interface SubCategories {
  currentSubCategory: string;
  category: string;
  setCurrentSubCategory: (newSubCategory: string) => void;
}

const SubCategories: React.FC<SubCategories> = ({
  category,
  currentSubCategory,
  setCurrentSubCategory,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const goBack = () => navigation.goBack();

  const updateSubCategory = (subCategory: any) => {
    if (subCategory.shortName !== currentSubCategory) {
      setCurrentSubCategory(subCategory.key);
    }
  };

  useEffect(() => {
    setSubCategories(PRODUCT_SUBCATEGORY[category]);
  }, [category]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.allOptionsButton} onPress={goBack}>
        <Icon
          name={'view-grid-outline'}
          color={theme.colors.primary}
          size={20}
        />
        <Text variant={'labelLarge'} style={styles.allOptions}>
          All Options
        </Text>
      </TouchableOpacity>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={subCategories}
        horizontal
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.subCategory}
            onPress={() => updateSubCategory(item)}>
            <View
              style={[
                styles.imageContainer,
                item?.key === currentSubCategory
                  ? styles.selected
                  : styles.normal,
              ]}>
              <FastImage source={{uri: item?.imageUrl}} style={styles.image} />
            </View>
            <Text
              variant={'labelLarge'}
              style={styles.categoryText}
              ellipsizeMode={'tail'}>
              {item?.value}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.key}
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
      alignItems: 'flex-end',
    },
    categoryText: {
      textAlign: 'center',
      color: colors.neutral400,
    },
    subCategory: {
      alignItems: 'center',
      marginRight: 24,
      width: 56,
      height: 76,
    },
    imageContainer: {
      height: 56,
      width: 56,
      marginBottom: 6,
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
