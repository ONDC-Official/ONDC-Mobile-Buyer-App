import React, {useCallback} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {CATEGORIES} from '../../../../../utils/categories';
import {useAppTheme} from '../../../../../utils/theme';

interface Category {
  id: string;
  name: string;
  shortName: string;
  Icon: string;
  routeName: string;
  domain: string;
}

const Categories = () => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const renderItem = useCallback(
    ({item}: {item: Category}) => (
      <TouchableOpacity
        style={styles.category}
        onPress={() =>
          navigation.navigate('CategoryDetails', {
            category: item.shortName,
            domain: item.domain,
          })
        }>
        <View style={styles.imageContainer}>
          <FastImage source={{uri: item.Icon}} style={styles.image} />
        </View>
        <Text
          variant={'labelMedium'}
          style={styles.categoryText}
          numberOfLines={2}
          ellipsizeMode={'tail'}>
          {t(`Featured Categories.${item.name}`)}
        </Text>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        horizontal
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 16,
      backgroundColor: colors.primary50,
    },
    categoryText: {
      color: colors.neutral400,
      textAlign: 'center',
      marginTop: 4,
    },
    category: {
      alignItems: 'center',
      width: 59,
      marginRight: 24,
    },
    imageContainer: {
      height: 56,
      width: 56,
      marginBottom: 2,
      padding: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 28,
      backgroundColor: 'white',
    },
    image: {
      height: 44,
      width: 44,
    },
  });

export default Categories;
