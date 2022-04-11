import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';

const image = require('../../../assets/demo.png');
const addButton = strings('main.product.add_button_title');

const ProductCard = ({theme, item, removeItem, addItem}) => {
  const {colors} = theme;

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <FastImage source={image} style={styles.image} resizeMode={'contain'} />
        <View style={appStyles.container}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.organizationNameContainer}>
            <Text numberOfLines={1}>{item.organization}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text>₹ {item.price}</Text>
            {item.quantity < 1 ? (
              <TouchableOpacity
                style={[styles.button, {borderColor: colors.primary}]}
                onPress={() => {
                  addItem(item);
                }}>
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
                    removeItem(item.id);
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
    </View>
  );
};

export default withTheme(ProductCard);

const styles = StyleSheet.create({
  container: {marginTop: 10, padding: 10},
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
