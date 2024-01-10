import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
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
    const list = PRODUCT_SUBCATEGORY[currentCategory];
    const midPoint = Math.floor(list.length / 2);
    const firstHalf = list.slice(0, midPoint);
    const secondHalf = list.slice(midPoint);
    setSubCategories([firstHalf, secondHalf]);
  }, [currentCategory]);

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
          {subCategories[0].map((item: any, index: number) => {
            const secondItem = subCategories[1][index];
            return (
              <View key={`SubCategory${index}`}>
                <TouchableOpacity
                  style={styles.brand}
                  onPress={() => navigateToSubCategory(item)}>
                  <FastImage
                    source={{uri: item?.imageUrl}}
                    style={styles.brandImage}
                  />
                  <Text variant={'bodyMedium'}>{item.key}</Text>
                </TouchableOpacity>
                {!!secondItem && (
                  <TouchableOpacity
                    style={styles.brand}
                    onPress={() => navigateToSubCategory(secondItem)}>
                    <FastImage
                      source={{uri: secondItem?.imageUrl}}
                      style={styles.brandImage}
                    />
                    <Text variant={'bodyMedium'}>{secondItem.key}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 16,
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
