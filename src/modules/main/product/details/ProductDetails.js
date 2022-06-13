import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {SliderBox} from 'react-native-image-slider-box';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import {strings} from '../../../../locales/i18n';
import {removeItemFromCart} from '../../../../redux/actions';
import {updateItemInCart} from '../../../../redux/actions';
import {addItemToCart} from '../../../../redux/actions';
import {appStyles} from '../../../../styles/styles';
import {showInfoToast} from '../../../../utils/utils';
import Details from './Details';

const image = require('../../../../assets/ondc.png');
const addToCart = strings('main.product.add_to_cart');
const add = strings('main.product.add_button_title');

const ProductDetails = ({theme, navigation, route: {params}}) => {
  const {colors} = theme;
  const {product} = params;
  const dispatch = useDispatch();
  const {products} = useSelector(({productReducer}) => productReducer);

  const item = products.find(one => one.id === product.id);

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

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.white}]}>
      <View style={[appStyles.container, {backgroundColor: colors.white}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}>
          <Icon name="arrow-left" size={16} color={colors.accentColor} />
        </TouchableOpacity>

        <SliderBox
          ImageComponent={FastImage}
          images={
            item.descriptor.images
              ? [...item.descriptor.images, image]
              : [image]
          }
          sliderBoxHeight={250}
          onCurrentImagePressed={index => {}}
          resizeMode="contain"
          dotColor={colors.accentColor}
          inactiveDotColor={colors.greyOutline}
          resizeMethod={'resize'}
          ImageComponentStyle={[
            styles.imageComponentStyle,
            {backgroundColor: colors.white},
          ]}
          dotStyle={styles.dotStyle}
          paginationBoxStyle={[
            styles.paginationBoxStyle,
            {backgroundColor: colors.white},
          ]}
        />
        <ScrollView>
          <View style={styles.imageContainer}>
            <Text style={styles.discriptorName}>{item.descriptor.name}</Text>
            <Text style={[styles.provider, {color: colors.gray}]}>
              Ordering from{' '}
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

            <Text style={styles.discriptorName}>
              ₹{item.price.value ? item.price.value : item.price.maximum_value}
            </Text>
          </View>
          <Divider width={1} style={styles.divider} />
          <Details style={styles.divider} item={item} />
          <Divider />
          <View style={{alignItems: 'flex-start', padding: 10}}>
            {item.quantity < 1 ? (
              <TouchableOpacity
                style={[styles.button, {borderColor: colors.accentColor}]}
                onPress={() => {
                  showInfoToast(addToCart);
                  addItem(item);
                }}>
                <Text style={{color: colors.accentColor}}>{add}</Text>
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
  discriptorName: {fontSize: 18, fontWeight: '700'},
  provider: {fontSize: 14, marginBottom: 4},
  imageContainer: {padding: 10},
  priceContainer: {fontWeight: '700'},
  imageComponentStyle: {
    width: '100%',
    marginBottom: 30,
  },
  dotStyle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  paginationBoxStyle: {width: '100%'},
  divider: {marginVertical: 8},
  backIcon: {paddingTop: 10, paddingHorizontal: 10, paddingBottom: 5},
  card: {marginTop: 10, marginHorizontal: 10, borderRadius: 8, elevation: 6},
  subContainer: {flexDirection: 'row'},
  image: {height: 80, width: 80, marginRight: 10},

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
