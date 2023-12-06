import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {CATEGORIES} from '../../../../utils/categories';

interface Categories {
  currentCategory: string;
}

const Categories: React.FC<Categories> = ({currentCategory}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const navigateToCategory = (category: any) => {
    if (category.shortName !== currentCategory) {
      navigation.navigate('CategoryDetails', {
        category: category.shortName,
        domain: category.domain,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        horizontal
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.category}
            onPress={() => navigateToCategory(item)}>
            <View
              style={[
                styles.imageContainer,
                item.shortName === currentCategory
                  ? styles.selected
                  : styles.normal,
              ]}>
              <FastImage source={item.Icon} style={styles.image} />
            </View>
            <Text variant={'labelSmall'} style={styles.categoryText}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingLeft: 16,
      paddingTop: 16,
    },
    categoryText: {
      fontWeight: '700',
      textAlign: 'center',
    },
    category: {
      alignItems: 'center',
      marginRight: 24,
      width: 58,
    },
    imageContainer: {
      height: 56,
      width: 56,
      marginBottom: 6,
      backgroundColor: '#E7E7E7',
      padding: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      height: 44,
      width: 44,
    },
    selected: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    normal: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: '#E7E7E7',
    },
  });

export default Categories;
