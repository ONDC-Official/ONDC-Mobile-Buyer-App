import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Chip, IconButton, Text, withTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

import {appStyles} from '../../../../styles/styles';
import {showInfoToast, stringToDecimal} from '../../../../utils/utils';
import useProductQuantity from '../hook/useProductQuantity';
import ProductImages from './components/ProductImages';
import TimeToShip from './components/TimeToShip';
import CartFooter from '../list/component/CartFooter/CartFooter';
import ReturnWindow from './components/ReturnWindow';
import VegNonVegTags from '../list/component/VegNonVegTag';
import StatutoryRequirements from './components/StatutoryRequirements';

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
      headerTitle: params.product?.descriptor?.name,
    });
  }, [navigation, params]);

  useEffect(() => {
    if (params.hasOwnProperty('product')) {
      setProduct(params.product);
    }
  }, [params]);

  const outOfStock = product?.quantityMeta?.available?.count === 0;

  return (
    <View style={appStyles.container}>
      <ScrollView style={appStyles.container}>
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
              <View style={styles.metaContainer}>
                <Text style={styles.descriptorName}>
                  {product?.descriptor?.name}
                </Text>
                <View style={styles.typeContainer}>
                  <VegNonVegTags list={product?.tags} />

                  <Text style={styles.fssaiLicense}>
                    Fssai License No:{' '}
                    <Text variant="titleSmall">
                      {product?.hasOwnProperty('@ondc/org/fssai_license_no')
                        ? product['@ondc/org/fssai_license_no']
                        : 'NA'}
                    </Text>
                  </Text>
                </View>
                {product?.descriptor.short_desc && (
                  <Text style={[styles.provider, {color: colors.gray}]}>
                    {product?.descriptor.short_desc}
                  </Text>
                )}
              </View>
              <View>
                <Text variant="titleLarge" style={{color: colors.opposite}}>
                  ₹
                  {product?.price.value
                    ? stringToDecimal(product?.price.value)
                    : stringToDecimal(product?.price.maximum_value)}
                </Text>
                {product?.hasOwnProperty('@ondc/org/time_to_ship') && (
                  <TimeToShip duration={product['@ondc/org/time_to_ship']} />
                )}
              </View>
            </View>

            <View style={styles.chipContainer}>
              {product?.hasOwnProperty('@ondc/org/returnable') &&
              product['@ondc/org/returnable'] ? (
                <Chip
                  selectedColor={theme.colors.primary}
                  mode="flat"
                  style={styles.chipStyle}
                  textStyle={styles.chipTextStyle}>
                  Returnable
                </Chip>
              ) : (
                <Chip
                  selectedColor={theme.colors.error}
                  mode="flat"
                  style={styles.chipStyle}
                  textStyle={styles.chipTextStyle}>
                  Non-Returnable
                </Chip>
              )}
              {product?.hasOwnProperty('@ondc/org/cancellable') &&
              product['@ondc/org/cancellable'] ? (
                <Chip
                  selectedColor={theme.colors.primary}
                  mode="flat"
                  style={styles.chipStyle}>
                  Cancellable
                </Chip>
              ) : (
                <Chip
                  selectedColor={theme.colors.error}
                  mode="flat"
                  compact
                  style={styles.chipStyle}
                  textStyle={styles.chipTextStyle}>
                  Non-Cancellable
                </Chip>
              )}
              {product?.hasOwnProperty('@ondc/org/available_on_cod') &&
                product['@ondc/org/available_on_cod'] && (
                  <Chip
                    mode="flat"
                    style={styles.chip}
                    selectedColor={theme.colors.opposite}>
                    COD
                  </Chip>
                )}
            </View>

            {product?.hasOwnProperty('@ondc/org/return_window') && (
              <ReturnWindow duration={product['@ondc/org/return_window']} />
            )}

            {!!product?.descriptor?.long_desc && (
              <View style={styles.detailsContainer}>
                <Text style={{color: colors.accent}}>Product Description</Text>
                <Text style={styles.longDescription}>
                  {product?.descriptor?.long_desc}
                </Text>
              </View>
            )}

            <StatutoryRequirements
              requirements={
                product?.hasOwnProperty(
                  '@ondc/org/statutory_reqs_packaged_commodities',
                )
                  ? product['@ondc/org/statutory_reqs_packaged_commodities']
                  : null
              }
            />

            <View style={styles.sectionContainer}>
              <Text style={{color: colors.accent}}>Provider</Text>
              <Text>{product?.provider_details?.descriptor?.name}</Text>
              <Text style={styles.longDescription}>
                {product?.provider_details?.descriptor?.long_desc}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        {!outOfStock &&
          (product?.quantity < 1 ? (
            <Button
              contentStyle={appStyles.containedButtonContainer}
              labelStyle={appStyles.containedButtonLabel}
              mode="outlined"
              onPress={() => {
                showInfoToast('Added to cart', 'bottom');
                let item = addItem(product);
                item && setProduct(item);
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
      <CartFooter />
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
  timeRequired: {
    marginTop: 8,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRequiredLabel: {
    color: 'white',
    lineHeight: 16,
    textAlign: 'center',
    padding: 0,
    margin: 0,
  },
  descriptorName: {fontSize: 18, fontWeight: '700', marginBottom: 4},
  provider: {fontSize: 14, marginBottom: 4, flexShrink: 1},
  detailsContainer: {paddingHorizontal: 16},
  sectionContainer: {paddingHorizontal: 16, paddingTop: 24},
  reqsRow: {
    flexDirection: 'row',
  },
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
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fssaiLicense: {
    marginStart: 8,
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
    flexWrap: 'wrap',
  },
  metaContainer: {flexShrink: 1, marginEnd: 8},
  chipStyle: {
    width: 122,
    alignSelf: 'center',
    justifyContent: 'center',
    marginEnd: 5,
  },
  chipTextStyle: {
    marginLeft: 8,
    marginRight: 8,
    minWidth: 105,
    fontSize: 13,
    textAlign: 'center',
  },
});
