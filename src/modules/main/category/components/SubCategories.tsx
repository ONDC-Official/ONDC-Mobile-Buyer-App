import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PRODUCT_SUBCATEGORY} from '../../../../utils/categories';
import {useAppTheme} from '../../../../utils/theme';
import SectionHeaderWithViewAll from '../../../../components/sectionHeaderWithViewAll/SectionHeaderWithViewAll';

interface SubCategories {
  currentCategory: string;
}

const screenWidth = Dimensions.get('screen').width;

const SubCategories: React.FC<SubCategories> = ({currentCategory}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const navigateToSubCategory = (subCategory: any) => {
    navigation.navigate('SubCategoryDetails', {
      subCategory: subCategory.key,
      category: currentCategory,
    });
  };

  const navigateToAll = () => {
    navigation.navigate('ShopByCategory', {category: currentCategory});
  };

  useEffect(() => {
    setSubCategories(PRODUCT_SUBCATEGORY[currentCategory]);
  }, [currentCategory]);

  return (
    <View style={styles.sectionContainer}>
      <SectionHeaderWithViewAll
        title={'Shop By Category'}
        viewAll={navigateToAll}
      />

      <View style={styles.container}>
        {subCategories.length > 0 &&
          subCategories.slice(0, 8).map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.brand, index < 4 ? styles.marginBottom : {}]}
              onPress={() => navigateToSubCategory(item)}>
              <FastImage
                source={{uri: item?.imageUrl}}
                style={styles.brandImage}
              />
              <Text variant={'labelLarge'} style={styles.name}>
                {item.key}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    sectionContainer: {
      marginTop: 28,
    },
    container: {
      paddingHorizontal: 16,
      marginTop: 12,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    title: {
      color: colors.neutral400,
      marginBottom: 12,
    },
    brand: {
      width: (screenWidth - 32) / 4,
    },
    marginBottom: {
      marginBottom: 16,
    },
    secondItem: {
      marginBottom: 20,
    },
    brandImage: {
      padding: 16,
      borderRadius: 10,
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    name: {
      color: colors.neutral400,
    },
  });
export default SubCategories;
