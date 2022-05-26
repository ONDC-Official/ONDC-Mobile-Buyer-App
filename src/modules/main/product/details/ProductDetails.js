import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {SliderBox} from 'react-native-image-slider-box';
import {appStyles} from '../../../../styles/styles';
import Details from './Details';

const image = require('../../../../assets/ondc.png');
const item = {
  id: '73661424',
  price: {
    currency: 'INR',
    value: 490,
    maximum_value: 490,
  },
  descriptor: {
    name: 'Aashirvaad Superior MP Atta, 10kg',
    symbol:
      'https://www.bigbasket.com/media/uploads/p/l/126906_7-aashirvaad-atta-whole-wheat.jpg',
    short_desc:
      "AASHIRVAAD 10Kg Atta, India's No: 1 Atta brand, uses 100% pure whole wheat grain produce, that is harvested to excellence to prepare the Superior MP Atta.",
    images: [
      'https://www.bigbasket.com/media/uploads/p/l/126906_7-aashirvaad-atta-whole-wheat.jpg',
    ],
  },
  location_id: 'tki-1000',
  fulfillment_id: '1',
  matched: false,
  related: false,
  recommended: false,
  '@ondc/org/returnable': false,
  '@ondc/org/seller_pickup_return': false,
  '@ondc/org/return_window': 'D4D',
  '@ondc/org/cancellable': false,
  '@ondc/org/available_on_cod': false,
  '@ondc/org/time_to_ship': 'D1D',
  '@ondc/org/net_quantity_or_measure_of_commodity_in_pkg': '',
  '@ondc/org/month_year_of_manufacture_packing_import': '2022',
  '@ondc/org/imported_product_country_of_origin': 'IND',
  '@ondc/org/contact_details_consumer_care': '',
  AvailableQuantity: 99,
  '@ondc/org/statutory_reqs_packaged_commodities': {
    description: 'Aashirvaad Superior MP Atta, 10kg',
    manufacturer_or_packer_name: 'ITC',
    manufacturer_or_packer_address:
      '37 J. L. Nehru Road, Kolkata – 700071, India',
    common_or_generic_name_of_commodity: 'Atta',
    multiple_products_name_number_or_qty: '1',
    net_quantity_or_measure_of_commodity_in_pkg: '10Kg',
    month_year_of_manufacture_packing_import: '1/1/2022',
    imported_product_country_of_origin: 'IND',
    contact_details_consumer_care: 'sales@trykaro.in',
  },
  provider_details: {
    id: 'slrp-1276898',
    descriptor: {
      name: 'TryKaro Indiranagar',
      symbol: 'https://cdn.sellerapp.com/img/sellerapp-amazon-logo.svg',
      long_desc: 'TryKaro Indiranagar',
      short_desc: 'TryKaro Indiranagar',
      images: ['https://cdn.sellerapp.com/img/sellerapp-amazon-logo.svg'],
    },
  },
  location_details: {
    id: 'tki-1000',
    gps: '12.970557,77.6448023',
    address: {
      door: '233',
      name: 'san jose',
      ward: '2',
      building: 'san jose 2 floor',
      street: '12 main road',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      area_code: '600001',
      locality: 'Indiranagar',
    },
  },
  category_details: {},
  fulfillment_details: {},
  bpp_details: {
    name: 'SellerApp',
    symbol: 'https://cdn.sellerapp.com/img/sellerapp-amazon-logo.svg',
    long_desc: 'Online eCommerce Store',
    short_desc: 'Online eCommerce Store',
    images: ['https://cdn.sellerapp.com/img/sellerapp-amazon-logo.svg'],
    bpp_id: 'api.test.ondcsellerapp.com',
  },
};

const ProductDetails = ({theme}) => {
  const {colors} = theme;

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.white}]}>
      <View style={[appStyles.container, {backgroundColor: colors.white}]}>
        <View style={styles.imageContainer}>
          <SliderBox
            ImageComponent={FastImage}
            images={[...item.descriptor.images, image]}
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
          <Text style={styles.discriptorName}>{item.descriptor.name}</Text>
          <Text style={[styles.provider, {color: colors.gray}]}>
            Ordering from {item.provider_details.descriptor.name}
          </Text>

          <Text style={styles.discriptorName}>₹{item.price.value}</Text>
        </View>
        <Divider width={1} style={styles.divider} />
        <Details style={styles.divider} item={item} />
        <Divider />
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
});
