import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PRODUCT_SUBCATEGORY} from '../../../../utils/categories';

interface SubCategories {
  currentCategory: string;
}

const SubCategories: React.FC<SubCategories> = ({currentCategory}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const navigateToSubCategory = (subCategory: any) => {
    navigation.navigate('SubCategoryDetails', {
      subCategory: subCategory.key,
      category: currentCategory,
    });
  };

  useEffect(() => {
    setSubCategories(PRODUCT_SUBCATEGORY[currentCategory]);
  }, [currentCategory]);

  const numColumns = Math.ceil(subCategories.length / 2);
  return (
    <View style={styles.container}>
      <Text variant={'titleSmall'} style={styles.title}>
        Shop By Category
      </Text>

      {subCategories.length > 0 && (
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={{
              alignSelf: 'flex-start',
            }}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={subCategories}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.brand}
                onPress={() => navigateToSubCategory(item)}>
                <FastImage
                  source={{uri: item?.imageUrl}}
                  style={styles.brandImage}
                />
                <Text variant={'bodyMedium'}>{item.key}</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 40,
      paddingLeft: 16,
    },
    title: {
      marginBottom: 12,
    },
    brand: {
      width: 100,
      marginRight: 20,
      marginBottom: 20,
      alignItems: 'center',
    },
    brandImage: {
      padding: 16,
      borderRadius: 10,
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
  });
export default SubCategories;
