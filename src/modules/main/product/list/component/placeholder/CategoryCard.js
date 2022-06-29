import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

/**
 * Component to render single item card on product screen
 * @param navigation
 * @param item: object which contains item information
 * @param width:width of the card
 * @constructor
 * @returns {JSX.Element}
 */
const CategoryCard = ({width, item}) => {
  return (
    <View style={[styles.container, {width: width}]}>
      <FastImage
        source={item.image}
        style={styles.image}
        resizeMode={'contain'}
      />
      <View style={styles.nameContainer}>
        <Text style={styles.text}>{item.category}</Text>
      </View>
    </View>
  );
};

export default withTheme(CategoryCard);

const styles = StyleSheet.create({
  container: {padding: 10, alignItems: 'center'},
  nameContainer: {padding: 10},
  image: {
    height: 100,
    width: '100%',
    alignSelf: 'center',
  },
  text: {marginBottom: 10, fontSize: 14},
});
