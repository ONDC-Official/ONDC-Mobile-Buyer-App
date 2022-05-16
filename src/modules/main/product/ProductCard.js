import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {strings} from '../../../locales/i18n';
import {removeItemFromCart} from '../../../redux/actions';
import {updateItemInCart} from '../../../redux/actions';
import {addItemToCart} from '../../../redux/actions';
import {appStyles} from '../../../styles/styles';
import {maskAmount} from '../../../utils/utils';
import {showInfoToast} from '../../../utils/utils';

const addButton = strings('main.product.add_button_title');
const addToCart = strings('main.product.add_to_cart');

/**
 * Component to render single product card on product screen
 * @param theme
 * @param item: object which contains product details
 * @param apiInProgress
 * @constructor
 * @returns {JSX.Element}
 */
const ProductCard = ({theme, navigation, item, apiInProgress}) => {
  const {colors} = theme;
  const dispatch = useDispatch();

  const addItem = () => {
    const product = Object.assign({}, item, {quantity: 1});
    dispatch(addItemToCart(product));
  };

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

  return (
    <Card containerStyle={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            images: item.descriptor.images,
            item: item,
          });
        }}>
        <View style={styles.subContainer}>
          <FastImage
            source={{
              uri: item.descriptor.images ? item.descriptor.images[0] : null,
            }}
            style={styles.image}
            resizeMode={'contain'}
          />
          <View style={appStyles.container}>
            <Text style={styles.title} numberOfLines={1}>
              {item.descriptor.name}
            </Text>
            <View style={styles.organizationNameContainer}>
              <Text numberOfLines={1}>{item.provider}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text>{maskAmount(item.price.value)}</Text>
              {item.quantity < 1 ? (
                <TouchableOpacity
                  style={[styles.button, {borderColor: colors.accentColor}]}
                  onPress={() => {
                    showInfoToast(addToCart);
                    addItem(item);
                  }}
                  disabled={apiInProgress}>
                  <Text style={{color: colors.accentColor}}>{addButton}</Text>
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
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default withTheme(ProductCard);

const styles = StyleSheet.create({
  card: {marginTop: 15, borderRadius: 8, elevation: 6},
  subContainer: {flexDirection: 'row'},
  image: {height: 80, width: 80, marginRight: 10},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 5,
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
  title: {fontSize: 18, fontWeight: '600'},
});
