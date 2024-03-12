import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CATEGORIES} from '../../../utils/categories';
import {useAppTheme} from '../../../utils/theme';
import {useTranslation} from 'react-i18next';

const FeaturedCategories = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const navigateToCategoryDetails = (category: string, domain: string) => {
    navigation.navigate('CategoryDetails', {category, domain});
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      numColumns={3}
      data={CATEGORIES}
      renderItem={({item}) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.brand]}
          onPress={() =>
            navigateToCategoryDetails(item.shortName, item.domain)
          }>
          <FastImage source={item.Icon} style={styles.brandImage} />
          <Text variant={'labelMedium'} style={styles.name}>
            {t(`Featured Categories.${item.name}`)}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
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

export default FeaturedCategories;
