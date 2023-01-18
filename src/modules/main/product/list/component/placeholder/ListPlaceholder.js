import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {appStyles} from '../../../../../../styles/styles';

const image = require('../../../../../../assets/placeholder.jpg');
const screenWidth = Dimensions.get('window').width;

/**
 * Component to render home page on product screen
 * @constructor
 * @returns {JSX.Element}
 */
const ListPlaceholder = () => (
  <View style={[appStyles.container, styles.container]}>
    <Image source={image} resizeMode={'contain'} style={styles.image} />
  </View>
);

export default ListPlaceholder;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  image: {
    width: screenWidth,
    height: screenWidth,
  },
});
