import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {strings} from '../../../../locales/i18n';

const id = strings('main.product.product_details.id');
const name = strings('main.product.product_details.name');
const bpp_id = strings('main.product.product_details.bpp_id');
const provider = strings('main.product.product_details.provider');
const title = strings('main.product.product_details.title');

const Details = ({item}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.productDetailsContainer}>
        <View style={styles.productDetailsTitleContainer}>
          <Text style={styles.title}>{id}</Text>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.title}>{bpp_id}</Text>
          <Text style={styles.title}>{provider}</Text>
        </View>
        <View>
          <Text style={styles.title}>{item.id}</Text>
          <Text style={styles.title}>{item.descriptor.name}</Text>
          <Text style={styles.title}>{item.bpp_details.bpp_id}</Text>
          <Text style={styles.title}>
            {item.provider_details.descriptor.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {padding: 10},
  heading: {fontSize: 18, fontWeight: '700', marginBottom: 8},
  productDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetailsTitleContainer: {marginRight: 30},
  title: {fontSize: 16, marginBottom: 4},
});
