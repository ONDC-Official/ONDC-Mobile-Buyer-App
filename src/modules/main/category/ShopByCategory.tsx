import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PRODUCT_SUBCATEGORY} from '../../../utils/categories';
import {useAppTheme} from '../../../utils/theme';
import {useTranslation} from 'react-i18next';

const ShopByCategory = ({route: {params}}: {route: any}) => {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const navigateToSubCategory = (subCategory: any) => {
    navigation.navigate('SubCategoryDetails', {
      subCategory: subCategory.key,
      category: params.category,
    });
  };

  useEffect(() => {
    setSubCategories(PRODUCT_SUBCATEGORY[params.category]);
  }, [params.category]);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      numColumns={3}
      data={subCategories}
      renderItem={({item}) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.brand]}
          onPress={() => navigateToSubCategory(item)}>
          <FastImage source={{uri: item?.imageUrl}} style={styles.brandImage} />
          <Text variant={'labelLarge'} style={styles.name}>
            {t(`Product SubCategories.${item.key}`)}
          </Text>
        </TouchableOpacity>
      )}
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
