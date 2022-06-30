import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {removeItemFromCart} from '../../../../../redux/actions';
import {updateItemInCart} from '../../../../../redux/actions';
import {addItemToCart} from '../../../../../redux/actions';
import {appStyles} from '../../../../../styles/styles';
import {showInfoToast} from '../../../../../utils/utils';

const image = require('../../../../../assets/noImage.png');

/**
 * Component to render single product card on product screen
 * @param theme
 * @param navigation
 * @param item: object which contains product details
 * @param cancellable:boolean which indicates visibility of close icon
 * @constructor
 * @returns {JSX.Element}
 */
const ProductCard = ({theme, navigation, item, cancellable}) => {
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
    let product = null;
    if (increase) {
      product = Object.assign({}, item, {quantity: item.quantity + 1});
      dispatch(updateItemInCart(product));
    } else {
      product = Object.assign({}, item, {quantity: item.quantity - 1});
      if (product.quantity === 0) {
        dispatch(removeItemFromCart(product));
      } else {
        dispatch(updateItemInCart(product));
      }
    }
  };

  const cancelItem = () => {
    const product = Object.assign({}, item, {quantity: 0});
    dispatch(updateItemInCart(product));
    dispatch(removeItemFromCart(product));
  };

  const uri =
    item.descriptor.images && item.descriptor.images.length > 0
      ? item.descriptor.images[0]
      : null;

  const cost = item.price.value ? item.price.value : item.price.maximum_value;
  return (
    <Card containerStyle={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            item,
          });
        }}>
        <View style={styles.subContainer}>
          <FastImage
            source={uri ? {uri} : image}
            style={styles.image}
            resizeMode={'contain'}
          />
          <View style={appStyles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.descriptor.name}
              </Text>
              {cancellable && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => cancelItem(item)}>
                  <Icon name="close" size={20}/>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.organizationNameContainer}>
              <Text numberOfLines={1}>
                {item.provider_details.descriptor.name}
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
                    <Icon name="minus" size={16} color={colors.white}/>
                  </TouchableOpacity>
                  <Text style={{color: colors.white}}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => updateQuantity(true)}>
                    <Icon name="plus" color={colors.white} size={16}/>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default withTheme(ProductCard);

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 6,
  },
  subContainer: {flexDirection: 'row'},
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
