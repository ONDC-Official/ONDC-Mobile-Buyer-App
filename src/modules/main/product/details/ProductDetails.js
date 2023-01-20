import React, {useEffect} from 'react';
import {Dimensions, ScrollView, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {appStyles} from '../../../../styles/styles';
import {showInfoToast} from '../../../../utils/utils';
import Details from './Details';
import useProductQuantity from '../hook/useProductQuantity';
import PagerView from 'react-native-pager-view';

const image = require('../../../../assets/noImage.png');
const imageSize = Dimensions.get('window').width;

/**
 * Component to display product details
 * @param item: object containing product details
 * @param theme:application theme
 * @constructor
 * @returns {JSX.Element}
 */
const ProductDetails = ({theme, navigation, route: {params}}) => {
  const {colors} = theme;

  const {product} = params;

  const {addItem, updateQuantity} = useProductQuantity(product);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: product?.descriptor?.name,
    });
  }, [navigation]);

  console.log(JSON.stringify(product, undefined, 4));
  return (
    <View style={[appStyles.container, {backgroundColor: colors.white}]}>
      {product.descriptor.images?.length > 0 ? (
        <PagerView style={[styles.pager, {height: imageSize}]} initialPage={0}>
          {product.descriptor.images?.map(uri => (
            <FastImage
              source={{uri}}
              style={styles.image}
              resizeMode={'contain'}
            />
          ))}
        </PagerView>
      ) : (
        <FastImage source={image} style={styles.image} resizeMode={'contain'} />
      )}

      <ScrollView style={styles.details}>
        <View style={styles.imageContainer}>
          <Text style={styles.descriptorName}>{product?.descriptor?.name}</Text>
          <Text style={[styles.provider, {color: colors.gray}]}>
            Seller: {product?.provider_details?.descriptor?.name}
          </Text>
          {product.descriptor.short_desc && (
            <Text style={[styles.provider, {color: colors.gray}]}>
              {product.descriptor.short_desc}
            </Text>
          )}

          <Text style={styles.descriptorName}>
            ₹
            {product.price.value
              ? product.price.value
              : product.price.maximum_value}
          </Text>
        </View>
        <Divider width={1} style={styles.divider} />

        <>
          <Details style={styles.divider} item={product} />
          <Divider />
        </>

        <View style={styles.addButton}>
          {product.quantity < 1 ? (
            <TouchableOpacity
              style={[styles.button, {borderColor: colors.primary}]}
              onPress={() => {
                showInfoToast('Added to Cart');
                addItem(product);
              }}>
              <Text style={{color: colors.primary}}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.quantityDisplayButton,
                {backgroundColor: colors.primary},
              ]}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => updateQuantity(false)}>
                <Icon name="minus" size={16} color={colors.white} />
              </TouchableOpacity>
              <Text style={{color: colors.white}}>{product.quantity}</Text>
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
  );
};

export default withTheme(ProductDetails);

const styles = StyleSheet.create({
  details: {
    marginTop: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
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
    height: imageSize,
    width: imageSize,
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
  pager: {
    zIndex: 999,
    backgroundColor: 'white',
  },
});
