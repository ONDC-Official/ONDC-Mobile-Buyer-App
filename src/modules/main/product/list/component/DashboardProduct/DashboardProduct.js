import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Card, IconButton, Text, withTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

import {appStyles} from '../../../../../../styles/styles';
import {showInfoToast, stringToDecimal} from '../../../../../../utils/utils';
import useProductQuantity from '../../../hook/useProductQuantity';
import moment from 'moment';

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
const DashboardProduct = ({
  theme,
  navigation,
  item,
  imageBackgroundColor = '#FFF7C0',
}) => {
  const {colors} = theme;
  const {addItem, updateQuantity} = useProductQuantity(item);

  const uri =
    item.descriptor.images && item.descriptor.images.length > 0
      ? item.descriptor.images[0]
      : null;

  const cost = item.price.value ? item.price.value : item.price.maximum_value;

  const outOfStock = item?.quantityMeta?.available?.count === 0;

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
            style={[styles.image, {backgroundColor: imageBackgroundColor}]}
            resizeMode={'contain'}
          />
          <View style={[appStyles.container, styles.details]}>
            {item?.hasOwnProperty('storeOpenTillDate') && (
              <View style={styles.storeTime}>
                <Text style={{color: colors.opposite}}>
                  Open until{' '}
                  {moment(item.storeOpenTillDate).format('DD-MM-YYYY hh:mm a')}
                </Text>
              </View>
            )}
            <Text style={styles.title} numberOfLines={1}>
              {item?.descriptor?.name}
            </Text>
            <View style={styles.organizationNameContainer}>
              <Text numberOfLines={1}>
                {item?.provider_details?.descriptor?.name}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.amount}>₹{stringToDecimal(cost)}</Text>
              {!outOfStock &&
                (item.quantity < 1 ? (
                  <Button
                    mode="outlined"
                    contentStyle={appStyles.containedButtonContainer}
                    labelStyle={appStyles.containedButtonLabel}
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
                ))}
            </View>
          </View>
        </View>
        {outOfStock && (
          <View style={styles.outOfStock}>
            <Text
              style={{
                color: theme.colors.error,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Out of stock
            </Text>
          </View>
        )}
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
  storeTime: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
});
