import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

const ItemCard = ({theme, width, item}) => {
  return (
    <Card containerStyle={[styles.card, {width: width}]}>
      <View style={styles.container}>
        <Text style={styles.text}>{item.category}</Text>
      </View>
      <FastImage
        source={item.image}
        style={styles.image}
        resizeMode={'contain'}
      />
    </Card>
  );
};

export default withTheme(ItemCard);

const styles = StyleSheet.create({
  card: {
    padding: 0,
    borderRadius: 12,
    elevation: 5,
    marginTop: 12,
    marginLeft: 10,
    marginRight: 0,
    margin: 0,
    height: 200,
    width: 140,
  },
  container: {padding: 10},
  image: {
    height: 100,
    width: '100%',
    alignSelf: 'center',
  },
  text: {marginBottom: 10, fontSize: 14},
});
