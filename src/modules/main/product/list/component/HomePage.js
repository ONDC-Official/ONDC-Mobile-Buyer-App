import React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {skeletonList} from '../../../../../utils/utils';
import ItemCard from './ItemCard';

const list = [
  {
    category: 'Beauty & personal care',
    image: require('../../../../../assets/beauty.png'),
  },
  {category: 'Fashion', image: require('../../../../../assets/fashion.jpg')},
  {
    category: 'Food & Bevarages',
    image: require('../../../../../assets/food.jpg'),
  },
  {
    category: 'Fresh fruits and vegetables',
    image: require('../../../../../assets/fruits.png'),
  },
  {
    category: 'Electronics',
    image: require('../../../../../assets/electronics.png'),
  },
  {
    category: 'Home Decore',
    image: require('../../../../../assets/homeDecore.jpg'),
  },
];

const HomePage = () => {
  const width = Dimensions.get('window').width / 2 - 20;
  const numColumns = Dimensions.get('window').width / width;
  const renderItem = ({item}) => {
    return <ItemCard item={item} width={width} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        renderItem={renderItem}
        scrollEnabled={true}
        numColumns={Math.floor(numColumns)}
        keyExtractor={item => item.category}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {alignItems: 'center', marginBottom: 100},
  contentContainerStyle: {
    paddingRight: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
});
