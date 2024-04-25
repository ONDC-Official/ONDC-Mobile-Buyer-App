import React, {useCallback, useEffect, useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {PRODUCT_SUBCATEGORY} from '../../../utils/categories';
import {useAppTheme} from '../../../utils/theme';

const ShopByCategory = ({route: {params}}: {route: any}) => {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const navigateToSubCategory = (subCategory: any) => {
    navigation.navigate('SubCategoryDetails', {
      subCategory: subCategory.key,
      category: params.category,
    });
  };

  const renderItem = useCallback(({item}: {item: any}) => {
    if (item?.isEmpty) {
      return <View style={styles.brand} />;
    } else {
      return (
        <TouchableOpacity
          style={styles.brand}
          onPress={() => navigateToSubCategory(item)}>
          <FastImage source={item?.imageUrl} style={styles.brandImage} />
          <Text variant={'labelLarge'} style={styles.name}>
            {t(`Product SubCategories.${item.key}`)}
          </Text>
        </TouchableOpacity>
      );
    }
  }, []);

  const subCategories = useMemo(() => {
    if (params.category) {
      const list = PRODUCT_SUBCATEGORY[params.category];
      const remainder = list.length % 3;
      const emptyItems = remainder === 0 ? 0 : 3 - remainder;

      // Create a new array with empty items
      const dataWithEmptyItems = [...list];
      for (let index = 0; index < emptyItems; index++) {
        dataWithEmptyItems.push({isEmpty: true, key: String(index)});
      }
      return dataWithEmptyItems;
    }
  }, [params.category]);

  useEffect(() => {
    navigation.setOptions({
      title: t('Product SubCategories.Shop by Category'),
    });
  }, []);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      numColumns={3}
      data={subCategories}
      renderItem={renderItem}
      keyExtractor={item => item.key}
    />
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      backgroundColor: colors.white,
    },
    brand: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 19,
    },
    brandImage: {
      width: 92,
      height: 92,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    name: {
      color: colors.neutral400,
    },
  });

export default ShopByCategory;
