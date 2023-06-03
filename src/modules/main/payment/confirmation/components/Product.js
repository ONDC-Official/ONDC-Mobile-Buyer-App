import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {
  Button,
  Card,
  Divider,
  IconButton,
  Text,
  withTheme,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {
  removeItemFromCart,
  updateItemInCart,
} from '../../../../../redux/actions';
import {appStyles} from '../../../../../styles/styles';
import useProductQuantity from '../../../product/hook/useProductQuantity';
import {stringToDecimal} from '../../../../../utils/utils';
import Tat from './Tat';

const image = require('../../../../../assets/noImage.png');

/**
 * Component to render single product card on product screen
 * @param theme
 * @param navigation
 * @param item: object which contains product details
 * @param cancellable:boolean which indicates visibility of close icon
 * @param apiInProgress
 * @constructor
 * @returns {JSX.Element}
 */
const Product = ({theme, navigation, item, apiInProgress}) => {
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

  const color = item.itemOutOfStock
    ? colors.error
    : item.quantityMismatch
    ? colors.opposite
    : colors.text;
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('ProductDetails', {
          product: item,
        });
      }}
      style={[item?.confirmation ? {} : {borderColor: colors.error}]}>
      <View style={styles.row}>
        <FastImage
          source={uri ? {uri} : image}
          style={styles.image}
          resizeMode={'contain'}
        />
        <View style={[appStyles.container, styles.details]}>
          <View style={styles.priceContainer}>
            <Text variant="titleSmall" style={[styles.title, {color: color}]}>
              {item?.descriptor?.name}
            </Text>
            <Text style={{color: colors.opposite}} variant="titleMedium">
              ₹{stringToDecimal(cost * item?.quantity)}
            </Text>
          </View>
          <View style={styles.organizationNameContainer}>
            <Text numberOfLines={1} style={{color: color}}>
              Qt:&nbsp;{item?.quantity} * {stringToDecimal(cost)}
            </Text>
          </View>
          <View style={[styles.organizationNameContainer]}>
            <Text numberOfLines={1} style={{color: color}}>
              {item?.provider_details?.descriptor?.name}
            </Text>
          </View>

          {item?.confirmation?.hasOwnProperty('fulfillment') && (
            <View>
              <Text>
                Fulfilled By:&nbsp;
                <Text variant="titleSmall">
                  {item?.confirmation?.fulfillment['@ondc/org/provider_name']}
                </Text>
              </Text>
              <Text>
                Type of Delivery:&nbsp;
                <Text variant="titleSmall">
                  {item?.confirmation?.fulfillment['@ondc/org/category']}
                </Text>
              </Text>
              <Tat
                duration={item?.confirmation?.fulfillment['@ondc/org/TAT']}
              />
            </View>
          )}
          <View style={styles.priceContainer}>
            <Button
              style={{borderColor: colors.red}}
              labelStyle={{color: colors.red}}
              mode="outlined"
              onPress={() => cancelItem(item)}>
              Remove
            </Button>
            {!outOfStock && (
              <View style={[styles.quantityDisplayButton]}>
                <IconButton
                  icon="minus"
                  iconColor="white"
                  style={{backgroundColor: colors.primary}}
                  onPress={() => updateQuantity(false)}
                  disabled={item?.quantity <= 1}
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

      {item?.knowCharges?.map((charge, index) => (
        <View style={styles.messageContainer} key={`${charge?.title}${index}`}>
          <Divider />
          <View style={styles.priceContainer}>
            <Text variant="titleSmall" style={styles.title}>
              {charge?.title}
            </Text>
            <Text style={{color: colors.opposite}} variant="titleMedium">
              ₹{stringToDecimal(charge?.price?.value)}
            </Text>
          </View>
        </View>
      ))}

      {item?.confirmation?.hasOwnProperty('message') && (
        <View style={styles.messageContainer}>
          <Text style={{color: colors.opposite}}>
            {item?.confirmation?.message}
          </Text>
        </View>
      )}
      {item.hasOwnProperty('dataReceived') && !item.dataReceived && (
        <View style={styles.messageContainer}>
          <Text
            style={{
              color: colors.error,
              alignSelf: alignment,
            }}
            variant="titleSmall">
            Cannot fetch details for this product
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default withTheme(Product);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  details: {
    padding: 12,
  },
  title: {flexShrink: 1},
  image: {height: '100%', width: 100, marginRight: 10},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizationNameContainer: {marginTop: 4, marginBottom: 8},
  messageContainer: {
    padding: 8,
  },
});
