import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View,} from 'react-native';
import {Button, Chip, IconButton, Text, withTheme,} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

import {appStyles} from '../../../../styles/styles';
import {showInfoToast} from '../../../../utils/utils';
import useProductQuantity from '../hook/useProductQuantity';
import ProductImages from './components/ProductImages';

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
  const [product, setProduct] = useState(null);

  const {addItem, updateQuantity} = useProductQuantity(product);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: product?.descriptor?.name,
    });
  }, [navigation]);

  useEffect(() => {
    if (params.hasOwnProperty('product')) {
      setProduct(params.product);
    }
  }, [params]);

  const outOfStock = product?.quantityMeta?.available?.count === 0;

  return (
    <ScrollView>
      <View style={[appStyles.container, {backgroundColor: colors.white}]}>
        {product?.descriptor.images?.length > 0 ? (
          <ProductImages images={product?.descriptor?.images} />
        ) : (
          <FastImage
            source={image}
            style={styles.image}
            resizeMode={'contain'}
          />
        )}

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.descriptorName}>
              {product?.descriptor?.name}
            </Text>
            <Text style={[styles.descriptorName, {color: colors.opposite}]}>
              ₹
              {product?.price.value
                ? product?.price.value
                : product?.price.maximum_value}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={[styles.provider, {color: colors.gray}]}>
              Seller: {product?.provider_details?.descriptor?.name}
            </Text>
            {product?.descriptor.short_desc && (
              <Text style={[styles.provider, {color: colors.gray}]}>
                {product?.descriptor.short_desc}
              </Text>
            )}
          </View>

          <View style={styles.chipContainer}>
            {product?.hasOwnProperty('@ondc/org/returnable') &&
              product['@ondc/org/returnable'] && (
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  selectedColor={theme.colors.opposite}>
                  Returnable
                </Chip>
              )}
            {product?.hasOwnProperty('@ondc/org/cancellable') &&
              product['@ondc/org/cancellable'] && (
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  selectedColor={theme.colors.opposite}>
                  Cancellable
                </Chip>
              )}
            {product?.hasOwnProperty('@ondc/org/available_on_cod') &&
              product['@ondc/org/available_on_cod'] && (
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  selectedColor={theme.colors.opposite}>
                  COD
                </Chip>
              )}
          </View>

          <View style={styles.detailsContainer}>
            <Text style={{color: colors.accent}}>Product Description</Text>
            <Text style={styles.longDescription}>
              {product?.descriptor?.long_desc}
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={{color: colors.accent}}>Provider</Text>
            <Text>{product?.provider_details?.descriptor?.name}</Text>
            <Text style={styles.longDescription}>
              {product?.provider_details?.descriptor?.long_desc}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {!outOfStock &&
              (product?.quantity < 1 ? (
                <Button
                  mode="outlined"
                  style={{width: 100}}
                  onPress={() => {
                    showInfoToast('Added to cart');
                    let item = addItem(product);
                    setProduct(item);
                  }}>
                  Add
                </Button>
              ) : (
                <View style={[styles.quantityDisplayButton]}>
                  <IconButton
                    icon="minus"
                    iconColor="white"
                    style={{backgroundColor: colors.primary}}
                    onPress={() => {
                      let item = updateQuantity(false);
                      setProduct(item);
                    }}
                  />
                  <Text>{product?.quantity}</Text>
                  <IconButton
                    icon="plus"
                    iconColor="white"
                    style={{backgroundColor: colors.primary}}
                    onPress={() => {
                      let item = updateQuantity(true);
                      setProduct(item);
                    }}
                  />
                </View>
              ))}
          </View>
        </View>
      </View>
    </ScrollView>
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
  detailsContainer: {paddingHorizontal: 16},
  sectionContainer: {paddingHorizontal: 16, paddingTop: 24},
  quantityDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 15,
  },
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
  buttonContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  chip: {
    marginEnd: 8,
  },
  longDescription: {
    marginTop: 8,
  },
});
