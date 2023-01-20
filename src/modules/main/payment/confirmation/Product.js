import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {Card, IconButton, Text, withTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {removeItemFromCart, updateItemInCart} from '../../../../redux/actions';
import {appStyles} from '../../../../styles/styles';
import useProductQuantity from '../../product/hook/useProductQuantity';

const image = require('../../../../assets/noImage.png');

/**
 * Component to render single product card on product screen
 * @param theme
 * @param navigation
 * @param item: object which contains product details
 * @param cancellable:boolean which indicates visibility of close icon
 * @param confirmed
 * @param apiInProgress
 * @constructor
 * @returns {JSX.Element}
 */
const Product = ({theme, navigation, item, confirmed, apiInProgress}) => {
  const {colors} = theme;
  const dispatch = useDispatch();
  const {updateQuantity} = useProductQuantity(item);

  const alignment = apiInProgress ? 'center' : 'auto';

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
  const outOfStock = item?.quantityMeta?.available?.count === 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('ProductDetails', {
          product: item,
        });
      }}>
      <Card
        style={[
          confirmed
            ? {backgroundColor: 'white'}
            : {backgroundColor: colors.surface, borderColor: colors.error},
          styles.container]
        }>
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
              <Text>
                ₹{Number.isInteger(cost) ? cost : parseFloat(cost).toFixed(2)}
              </Text>
              {!outOfStock && (
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
          <View>
            <IconButton
              icon={'close'}
              iconColor={colors.error}
              onPress={() => cancelItem(item)}>
              <Icon name="close" size={20} />
            </IconButton>
          </View>
        </View>
        {!confirmed &&
          (apiInProgress ? (
            <ActivityIndicator color={colors.error} />
          ) : (
            <Text
              style={{
                color: colors.error,
                alignSelf: alignment,
              }}>
              Cannot fetch details for this product
            </Text>
          ))}
      </Card>
    </TouchableOpacity>
  );
};

export default withTheme(Product);

const styles = StyleSheet.create({
  container: {
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
  outOfStock: {
    position: 'absolute',
    height: '100%',
    width: 100,
    backgroundColor: '#fff',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});
