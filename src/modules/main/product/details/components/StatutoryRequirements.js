import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';

const StatutoryRequirements = ({requirements, theme}) => {
  const {colors} = theme;

  if (requirements) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={{color: colors.accent}}>
          Statutory Reqs Packaged Commodities
        </Text>
        {requirements.hasOwnProperty('manufacturer_or_packer_name') && (
          <View style={styles.row}>
            <Text>Manufacturer/Packer Name:&nbsp;</Text>
            <Text variant="titleSmall">
              {requirements.manufacturer_or_packer_name}
            </Text>
          </View>
        )}

        {requirements.hasOwnProperty('manufacturer_or_packer_address') && (
          <View style={styles.row}>
            <Text>Manufacturer/Packer Address:&nbsp;</Text>
            <Text variant="titleSmall">
              {requirements.manufacturer_or_packer_address}
            </Text>
          </View>
        )}
        {requirements.hasOwnProperty('common_or_generic_name_of_commodity') && (
          <View style={styles.row}>
            <Text>Generic name of commodity:&nbsp;</Text>
            <Text variant="titleSmall">
              {requirements.common_or_generic_name_of_commodity}
            </Text>
          </View>
        )}

        {requirements.hasOwnProperty(
          'net_quantity_or_measure_of_commodity_in_pkg',
        ) && (
          <View style={styles.row}>
            <Text>Net. Quantity:&nbsp;</Text>
            <Text variant="titleSmall">
              {requirements.net_quantity_or_measure_of_commodity_in_pkg}
            </Text>
          </View>
        )}

        {requirements.hasOwnProperty(
          'month_year_of_manufacture_packing_import',
        ) && (
          <View style={styles.row}>
            <Text>Month Year of Manufacturer/Packing:&nbsp;&nbsp;</Text>
            <Text variant="titleSmall">
              {requirements.month_year_of_manufacture_packing_import}
            </Text>
          </View>
        )}
      </View>
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  sectionContainer: {paddingHorizontal: 16, paddingTop: 24},
  row: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
});

export default withTheme(StatutoryRequirements);
