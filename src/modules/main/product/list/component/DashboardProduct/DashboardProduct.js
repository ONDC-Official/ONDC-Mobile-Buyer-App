import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';

import {addItemToCart, removeItemFromCart, updateItemInCart,} from '../../../../../../redux/actions';
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
  const {t} = useTranslation();

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
    let product = increase
      ? Object.assign({}, item, {quantity: item.quantity + 1})
      : Object.assign({}, item, {quantity: item.quantity - 1});

    if (product.quantity === 0) {
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
      }
      style={styles.container}>
      <FastImage
        source={uri ? {uri} : image}
        style={styles.image}
        resizeMode={'contain'}
      />
      <View style={appStyles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.descriptor?.name}
          </Text>
        </View>
        <View style={styles.organizationNameContainer}>
          <Text numberOfLines={1}>
            {item?.provider_details?.descriptor?.name}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text>
            ₹{Number.isInteger(cost) ? cost : parseFloat(cost).toFixed(2)}
          </Text>
          {item.quantity < 1 ? (
            <TouchableOpacity
              style={[styles.button, {borderColor: colors.accentColor}]}
              onPress={() => {
                showInfoToast(t('main.product.add_to_cart'));
                addItem(item);
              }}>
              <Text style={{color: colors.accentColor}}>
                {t('main.product.add_button_title')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.quantityDisplayButton,
                {backgroundColor: colors.accentColor},
              ]}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => updateQuantity(false)}>
                <Icon name="minus" size={16} color={colors.white} />
              </TouchableOpacity>
              <Text style={{color: colors.white}}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => updateQuantity(true)}>
                <Icon name="plus" color={colors.white} size={16} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default withTheme(DashboardProduct);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  image: {height: 80, width: 80, marginRight: 10},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 26,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
  },
  quantityDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 15,
  },
  actionButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  organizationNameContainer: {marginTop: 4, marginBottom: 8},
  title: {fontSize: 16, fontWeight: '600', flex: 1},
  iconContainer: {marginRight: 12},
  titleContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});
