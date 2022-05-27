import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {strings} from '../../../../locales/i18n';
import IconField from './IconField';

const title = strings('main.product.product_details.title');

const Details = ({item, theme}) => {
  const {colors} = theme;
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
              Manufacture Name
            </Text>
            {item['@ondc/org/statutory_reqs_packaged_commodities'] && (
              <>
                {item['@ondc/org/statutory_reqs_packaged_commodities']
                  .net_quantity_or_measure_of_commodity_in_pkg && (
                  <Text style={[styles.title, {color: colors.gray}]}>
                    Net Quantity
                  </Text>
                )}

                {item['@ondc/org/statutory_reqs_packaged_commodities']
                  .month_year_of_manufacture_packing_import && (
                  <Text style={[styles.title, {color: colors.gray}]}>
                    Manufacturing Date
                  </Text>
                )}
                {item['@ondc/org/statutory_reqs_packaged_commodities']
                  .imported_product_country_of_origin && (
                  <Text style={[styles.title, {color: colors.gray}]}>
                    Country of Origin
                  </Text>
                )}
              </>
            )}
            {item.bpp_details.long_desc && (
              <Text style={[styles.title, {color: colors.gray}]}>
                Brand Owner Name
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.value}>
              {item.provider_details.descriptor.name}
            </Text>
            {item['@ondc/org/statutory_reqs_packaged_commodities'] && (
              <>
                {item['@ondc/org/statutory_reqs_packaged_commodities']
                  .net_quantity_or_measure_of_commodity_in_pkg && (
                  <Text style={styles.value}>
                    {
                      item['@ondc/org/statutory_reqs_packaged_commodities']
                        .net_quantity_or_measure_of_commodity_in_pkg
                    }
                  </Text>
                )}

                {item['@ondc/org/statutory_reqs_packaged_commodities']
                  .month_year_of_manufacture_packing_import && (
                  <Text style={styles.value}>
                    {
                      item['@ondc/org/statutory_reqs_packaged_commodities']
                        .month_year_of_manufacture_packing_import
                    }
                  </Text>
                )}

                {item['@ondc/org/statutory_reqs_packaged_commodities']
                  .imported_product_country_of_origin && (
                  <Text style={styles.value}>
                    {
                      item['@ondc/org/statutory_reqs_packaged_commodities']
                        .imported_product_country_of_origin
                    }
                  </Text>
                )}
              </>
            )}

            {item.bpp_details.long_desc && (
              <Text style={styles.value}>{item.bpp_details.long_desc}</Text>
            )}
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
