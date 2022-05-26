import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {strings} from '../../../../locales/i18n';
import IconField from './IconField';

const title = strings('main.product.product_details.title');

const Details = ({item, theme}) => {
  const {colors} = theme;
  return (
    <>
      <View style={[styles.container, styles.productDetailsContainer]}>
        <IconField name="Returnable" icon="package-variant" />
        <View style={styles.space} />
        <IconField name="Cancellable" icon="package-variant-closed" />
      </View>
      <View style={styles.container}>
        <Text style={[styles.heading, {color: colors.gray}]}>{title}</Text>
        <View style={styles.productDetailsContainer}>
          <View style={styles.productDetailsTitleContainer}>
            <Text style={[styles.title, {color: colors.gray}]}>
              Manufacture Name
            </Text>
            <Text style={[styles.title, {color: colors.gray}]}>
              Net Quantity
            </Text>
            <Text style={[styles.title, {color: colors.gray}]}>
              Manufacturing Date
            </Text>
            <Text style={[styles.title, {color: colors.gray}]}>
              Country of Origin
            </Text>
            <Text style={[styles.title, {color: colors.gray}]}>
              Brand Owner Name
            </Text>
          </View>
          <View>
            <Text style={styles.value}>
              {item.provider_details.descriptor.name}
            </Text>
            <Text style={styles.value}>10Kg</Text>
            <Text style={styles.value}>1/1/2022</Text>
            <Text style={styles.value}>India</Text>
            <Text style={styles.value}>ONDC</Text>
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
