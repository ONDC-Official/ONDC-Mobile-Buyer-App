import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {strings} from '../../../../locales/i18n';
import IconField from './IconField';

const title = strings('main.product.product_details.title');
const manufactureName = strings(
  'main.product.product_details.manufacture_name',
);
const manufactureDate = strings(
  'main.product.product_details.manufacture_date',
);
const netQuantityLabel = strings('main.product.product_details.net_quantity');
const countryLabel = strings('main.product.product_details.country_of_origin');
const brandLabel = strings('main.product.product_details.brand_owner_name');

const Details = ({item, theme}) => {
  const {colors} = theme;

  const packageCommodity =
    item['@ondc/org/statutory_reqs_packaged_commodities'];

  const netQuantity = packageCommodity
    ? packageCommodity.net_quantity_or_measure_of_commodity_in_pkg
    : null;
  const manufacturingDate = packageCommodity
    ? packageCommodity.month_year_of_manufacture_packing_import
    : null;
  const country = packageCommodity
    ? packageCommodity.imported_product_country_of_origin
    : null;
  const ownerName = item.bpp_details.long_desc;
  return (
    <>
      <View style={[styles.container, styles.productDetailsContainer]}>
        {item['@ondc/org/returnable'] && (
          <>
            <IconField name="Returnable" icon="package-variant" />
            <View style={styles.space} />
          </>
        )}
        {item['@ondc/org/cancellable'] && (
          <IconField name="Cancellable" icon="package-variant-closed" />
        )}
      </View>
      <View style={styles.container}>
        <Text style={[styles.heading, {color: colors.gray}]}>{title}</Text>
        <View style={styles.productDetailsContainer}>
          <View style={styles.productDetailsTitleContainer}>
            <Text style={[styles.title, {color: colors.gray}]}>
              {manufactureName}
            </Text>
            {packageCommodity && (
              <>
                {netQuantity && (
                  <Text style={[styles.title, {color: colors.gray}]}>
                    {netQuantityLabel}
                  </Text>
                )}

                {manufacturingDate && (
                  <Text style={[styles.title, {color: colors.gray}]}>
                    {manufactureDate}
                  </Text>
                )}
                {country && (
                  <Text style={[styles.title, {color: colors.gray}]}>
                    {countryLabel}
                  </Text>
                )}
              </>
            )}
            {ownerName && (
              <Text style={[styles.title, {color: colors.gray}]}>
                {brandLabel}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.value}>
              {item.provider_details.descriptor.name}
            </Text>
            {item['@ondc/org/statutory_reqs_packaged_commodities'] && (
              <>
                {netQuantity && <Text style={styles.value}>{netQuantity}</Text>}
                {manufacturingDate && (
                  <Text style={styles.value}>{manufacturingDate}</Text>
                )}
                {country && <Text style={styles.value}>{country}</Text>}
              </>
            )}
            {ownerName && <Text style={styles.value}>{ownerName}</Text>}
          </View>
        </View>
      </View>
    </>
  );
};

export default withTheme(Details);

const styles = StyleSheet.create({
  container: {padding: 10},
  heading: {fontSize: 18, fontWeight: '700', marginBottom: 8},
  productDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetailsTitleContainer: {marginRight: 30},
  title: {fontSize: 14, marginBottom: 4},
  value: {fontSize: 14, marginBottom: 4, fontWeight: 'bold'},
  space: {margin: 10},
});
