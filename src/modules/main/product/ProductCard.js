import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';

const addButton = strings('main.product.add_button_title');

/**
 * Component to render single product card on product screen
 * @param addItem:function gets execute when user click on add and plus button
 * @param removeItem:function gets execute when user clicks on minus button
 * @param item:object which contains product details
 * @constructor
 * @returns {JSX.Element}
 */
const ProductCard = ({theme, item, apiInProgress, removeItem, addItem}) => {
  const {colors} = theme;

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.subContainer}>
        <FastImage
          source={{uri: item.descriptor.images[0]}}
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
            <Text>₹ {item.price.value}</Text>
            {item.quantity < 1 ? (
              <TouchableOpacity
                style={[styles.button, {borderColor: colors.primary}]}
                onPress={() => {
                  addItem(item);
                }}
                disabled={apiInProgress}>
                <Text style={{color: colors.primary}}>{addButton}</Text>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.quantityDisplayButton,
                  {backgroundColor: colors.primary},
                ]}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    removeItem(item);
                  }}>
                  <Icon name="minus" size={16} color={colors.white} />
                </TouchableOpacity>
                <Text style={{color: colors.white}}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    addItem(item);
                  }}>
                  <Icon name="plus" color={colors.white} size={16} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
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
