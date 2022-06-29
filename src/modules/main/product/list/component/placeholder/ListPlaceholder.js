import React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import i18n from '../../../../../../locales/i18next';
import CategoryCard from './CategoryCard';

const list = [
  {
    category: i18n.t('main.product.homepage.beauty_personal_care'),
    image: require('../../../../../../assets/beauty.png'),
  },
  {
    category: i18n.t('main.product.homepage.fashion'),
    image: require('../../../../../assets/fashion.png'),
  },
  {
    category: i18n.t('main.product.homepage.food_bevarages'),
    image: require('../../../../../assets/food.png'),
  },
  {
    category: i18n.t('main.product.homepage.fruits'),
    image: require('../../../../../../assets/fruits.png'),
  },
  {
    category: i18n.t('main.product.homepage.electronics'),
    image: require('../../../../../../assets/electronics.png'),
  },
  {
    category: i18n.t('main.product.homepage.home_decore'),
    image: require('../../../../../assets/homeDecore.png'),
  },
];

/**
 * Component to render home page on product screen
 * @constructor
 * @returns {JSX.Element}
 */
const ListPlaceholder = () => {
  const width = Dimensions.get('window').width / 2 - 20;
  const numColumns = Dimensions.get('window').width / width;

  /**
   * Function is used to render single item card in the list
   * @param item:single object containing information
   * @returns {JSX.Element}
   */
  const renderItem = ({item}) => <CategoryCard item={item} width={width} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        renderItem={renderItem}
        scrollEnabled
        numColumns={Math.floor(numColumns)}
        keyExtractor={item => item.category}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  );
};

export default ListPlaceholder;

const styles = StyleSheet.create({
  container: {alignItems: 'center', marginBottom: 100},
  contentContainerStyle: {
    paddingRight: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
});
