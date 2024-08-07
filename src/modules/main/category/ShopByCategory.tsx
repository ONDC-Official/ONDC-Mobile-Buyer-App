import React, {useCallback, useEffect, useMemo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useAppTheme} from '../../../utils/theme';
import useSubCategoryName from '../../../hooks/useSubCategoryName';
import NoStoreIcon from '../../../assets/no_store_icon.svg';

const ShopByCategory = ({route: {params}}: {route: any}) => {
  const {getSubcategoryName} = useSubCategoryName();
  const {categories} = useSelector((state: any) => state.categories);
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const navigateToSubCategory = (subCategory: any) => {
    navigation.navigate('SubCategoryDetails', {
      subCategory: subCategory.code,
      category: params.category,
      categoryDomain: params.categoryDomain,
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
          {item?.url ? (
            <FastImage source={{uri: item?.url}} style={styles.brandImage} />
          ) : (
            <View style={[styles.brandImage, styles.emptyBrandImage]}>
              <NoStoreIcon width={50} height={50} />
            </View>
          )}
          <Text variant={'labelLarge'} style={styles.name}>
            {getSubcategoryName(item.code, item.label)}
          </Text>
        </TouchableOpacity>
      );
    }
  }, []);

  const subCategories = useMemo(() => {
    if (params.categoryDomain) {
      const list = categories[params.categoryDomain];
      const remainder = list.length % 3;
      const emptyItems = remainder === 0 ? 0 : 3 - remainder;

      // Create a new array with empty items
      const dataWithEmptyItems = [...list];
      for (let index = 0; index < emptyItems; index++) {
        dataWithEmptyItems.push({isEmpty: true, key: String(index)});
      }
      return dataWithEmptyItems;
    }
  }, [params.category, params.categoryDomain]);

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
      keyExtractor={item => item.code}
    />
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      paddingVertical: 20,
      backgroundColor: colors.white,
    },
    brand: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 19,
      padding: 8,
    },
    brandImage: {
      width: 92,
      height: 92,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    emptyBrandImage: {
      backgroundColor: colors.neutral50,
      borderRadius: 46,
    },
    name: {
      color: colors.neutral400,
      textAlign: 'center',
    },
  });

export default ShopByCategory;
