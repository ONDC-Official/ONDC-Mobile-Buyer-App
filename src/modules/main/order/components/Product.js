import {StyleSheet, View} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import StatusContainer from './StatusContainer';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {stringToDecimal} from '../../../../utils/utils';
import TextViewWithMoreLess from '../../../../components/TextView/TextViewWithMoreLess';

const image = require('../../../../assets/noImage.png');

const Product = ({item}) => {
  const uri =
    item.product?.descriptor?.images &&
    item.product?.descriptor?.images.length > 0
      ? item.product?.descriptor?.images[0]
      : null;

  return (
    <>
      <View style={styles.container}>
        <FastImage
          source={uri ? {uri} : image}
          style={styles.image}
          resizeMode={'contain'}
        />
        <View style={styles.rightPane}>
          <View style={styles.details}>
            <TextViewWithMoreLess
              textContent={item.product?.descriptor?.name}
              style={styles.title}
            />

            <Text variant="titleSmall" style={styles.price}>
              ₹
              {stringToDecimal(
                item.product?.price?.value * item?.quantity?.count,
              )}
            </Text>
          </View>
          <Text style={styles.quantity}>
            QTY:{` ${item?.quantity?.count} * ${item.product?.price?.value}`}
          </Text>
          <StatusContainer product={item} />
        </View>
      </View>
      <Divider />
    </>
  );
};

const styles = StyleSheet.create({
  image: {height: '100%', width: 100, marginRight: 10},
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  details: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightPane: {
    flexShrink: 1,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  title: {
    marginRight: 10,
    flexShrink: 1,
  },
  address: {marginBottom: 4},
  divider: {marginTop: 10},
  price: {
    width: 50,
    textAlign: 'right',
  },
});

export default Product;
