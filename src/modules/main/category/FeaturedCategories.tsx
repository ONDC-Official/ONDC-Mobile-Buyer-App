import React, {useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import {CATEGORIES} from '../../../utils/categories';
import {useAppTheme} from '../../../utils/theme';

const FeaturedCategories = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const navigateToCategoryDetails = (category: string, domain: string) => {
    navigation.navigate('CategoryDetails', {category, domain});
  };

  // Memoize the keyExtractor to avoid unnecessary re-renders
  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      return (
        <TouchableOpacity
          key={item.key}
          style={[styles.brand]}
          onPress={() => {
            navigateToCategoryDetails(item.shortName, item.domain);
          }}>
          <FastImage source={{uri: item.Icon}} style={styles.brandImage} />
          <Text variant={'labelMedium'} style={styles.name}>
            {t(`Featured Categories.${item.name}`)}
          </Text>
        </TouchableOpacity>
      );
    },
    [navigateToCategoryDetails, styles, t],
  );

  useEffect(() => {
    navigation.setOptions({
      title: t('Featured Categories.Featured Categories'),
    });
  }, []);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      numColumns={3}
      data={CATEGORIES}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 20,
      backgroundColor: colors.white,
    },
    brand: {
      width: '33.33%',
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
