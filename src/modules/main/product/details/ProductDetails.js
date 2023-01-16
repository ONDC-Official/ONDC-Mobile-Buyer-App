import React from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {addItemToCart, removeItemFromCart, updateItemInCart} from '../../../../redux/actions';
import {appStyles} from '../../../../styles/styles';
import {showInfoToast} from '../../../../utils/utils';
import Details from './Details';

const image = require('../../../../assets/noImage.png');

/**
 * Component to display product details
 * @param item: object containing product details
 * @param theme:application theme
 * @constructor
 * @returns {JSX.Element}
 */
const ProductDetails = ({theme, navigation, route: {params}}) => {
  const {colors} = theme;

  const {t} = useTranslation();

  const {products} = useSelector(({productReducer}) => productReducer);

  const {product} = params;

  const item = products.find(one => one.id === product.id);

  const dispatch = useDispatch();

  /**
   * function handles click event add button
   */
  const addItem = () => {
    const updatedProduct = Object.assign({}, item, {quantity: 1});
    dispatch(addItemToCart(updatedProduct));
  };

  /**
   * function handles click event of increase and decrease buttons
   */
  const updateQuantity = (increase = true) => {
    let updatedProduct = null;
    if (increase) {
      updatedProduct = Object.assign({}, item, {quantity: item.quantity + 1});
      dispatch(updateItemInCart(updatedProduct));
    } else {
      updatedProduct = Object.assign({}, item, {quantity: item.quantity - 1});
      if (updatedProduct.quantity === 0) {
        dispatch(removeItemFromCart(updatedProduct));
      } else {
        dispatch(updateItemInCart(updatedProduct));
      }
    }
  };

  const uri = item.descriptor.images ? item.descriptor.images[0] : null;

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.white}]}>
      <View style={[appStyles.container, {backgroundColor: colors.white}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}>
          <Icon name="arrow-left" size={16} color={colors.accentColor} />
        </TouchableOpacity>
        <View
          style={[
            styles.container,
            {
              borderColor: colors.greyOutline,
            },
          ]}>
          <FastImage
            source={uri ? {uri} : image}
            style={styles.image}
            resizeMode={'contain'}
          />
        </View>

        <ScrollView>
          <View style={styles.imageContainer}>
            {/* <Text style={styles.descriptorName}>{item.id}</Text> */}

            <Text style={styles.descriptorName}>{item.descriptor.name}</Text>
            <Text style={[styles.provider, {color: colors.gray}]}>
              {t('main.product.product_details.ordering_from')}{' '}
              <Text
                style={[
                  styles.provider,
                  styles.priceContainer,
                  {color: colors.gray},
                ]}>
                {item.provider_details.descriptor.name}
              </Text>
            </Text>
            {item.descriptor.short_desc && (
              <Text style={[styles.provider, {color: colors.gray}]}>
                {item.descriptor.short_desc}
              </Text>
            )}

            <Text style={styles.descriptorName}>
              ₹{item.price.value ? item.price.value : item.price.maximum_value}
            </Text>
          </View>
          <Divider width={1} style={styles.divider} />

          <>
            <Details style={styles.divider} item={item} />
            <Divider />
          </>

          <View style={styles.addButton}>
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default withTheme(ProductDetails);

const styles = StyleSheet.create({
  descriptorName: {fontSize: 18, fontWeight: '700', marginBottom: 4},
  provider: {fontSize: 14, marginBottom: 4, flexShrink: 1},
  imageContainer: {padding: 10},
  priceContainer: {fontWeight: '700'},
  divider: {marginVertical: 8},
  backIcon: {paddingTop: 10, paddingHorizontal: 10, paddingBottom: 5},
  card: {marginTop: 10, marginHorizontal: 10, borderRadius: 8, elevation: 6},
  subContainer: {flexDirection: 'row'},
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
  image: {
    height: 190,
    width: 250,
    alignSelf: 'center',
  },
  container: {
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignSelf: 'center',
    borderRadius: 8,
  },
  addButton: {alignItems: 'flex-start', padding: 10},
});
