import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Card, IconButton, Text, withTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';

import {
  addItemToCart,
  removeItemFromCart,
  updateItemInCart,
} from '../../../../../../redux/actions';
import {appStyles} from '../../../../../../styles/styles';
import {showInfoToast} from '../../../../../../utils/utils';

const image = require('../../../../../../assets/noImage.png');

/**
 * Component to render single product on product screen
 * @param theme
 * @param navigation
 * @param item: object which contains product details
 * @param cancellable:boolean which indicates visibility of close icon
 * @constructor
 * @returns {JSX.Element}
 */
const DashboardProduct = ({theme, navigation, item}) => {
  const {colors} = theme;

  const dispatch = useDispatch();

  /**
   * function handles click event add button
   */
  const addItem = () => {
    const product = Object.assign({}, item, {quantity: 1});
    dispatch(addItemToCart(product));
  };

  /**
   * function handles click event of increase and decrease buttons
   */
  const updateQuantity = (increase = true) => {
    const newQuantity = increase ? item.quantity + 1 : item.quantity - 1;
    let product = Object.assign({}, item, {quantity: newQuantity});

    if (newQuantity === 0) {
      dispatch(removeItemFromCart(product));
    } else {
      dispatch(updateItemInCart(product));
    }
  };

  const uri =
    item.descriptor.images && item.descriptor.images.length > 0
      ? item.descriptor.images[0]
      : null;

  const cost = item.price.value ? item.price.value : item.price.maximum_value;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('ProductDetails', {
          product: item,
        })
      }>
      <Card style={styles.container}>
        <View style={styles.row}>
          <FastImage
            source={uri ? {uri} : image}
            style={styles.image}
            resizeMode={'contain'}
          />
          <View style={[appStyles.container, styles.details]}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.descriptor?.name}
            </Text>
            <View style={styles.organizationNameContainer}>
              <Text numberOfLines={1}>
                {item?.provider_details?.descriptor?.name}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.amount}>
                ₹{Number.isInteger(cost) ? cost : parseFloat(cost).toFixed(2)}
              </Text>
              {item.quantity < 1 ? (
                <Button
                  mode="outlined"
                  style={{width: 100}}
                  onPress={() => {
                    showInfoToast('Added to cart');
                    addItem(item);
                  }}>
                  Add
                </Button>
              ) : (
                <View style={[styles.quantityDisplayButton]}>
                  <IconButton
                    icon="minus"
                    iconColor="white"
                    style={{backgroundColor: colors.primary}}
                    onPress={() => updateQuantity(false)}
                  />
                  <Text>{item.quantity}</Text>
                  <IconButton
                    icon="plus"
                    iconColor="white"
                    style={{backgroundColor: colors.primary}}
                    onPress={() => updateQuantity(true)}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default withTheme(DashboardProduct);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 8,
  },
  row: {
    flexDirection: 'row',
  },
  details: {
    padding: 12,
  },
  image: {height: '100%', width: 100, marginRight: 10},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  amount: {
    fontWeight: '700',
  },
  organizationNameContainer: {marginTop: 4, marginBottom: 8},
  title: {fontSize: 16, fontWeight: '700', flex: 1},
  iconContainer: {marginRight: 12},
});
