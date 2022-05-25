import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';

//TODO: i18n missing

const Details = ({item}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Product Details</Text>
      <View style={styles.productDetailsContainer}>
        <View style={styles.productDetailsTitleContainer}>
          <Text style={styles.title}>Id</Text>
          <Text style={styles.title}>Name</Text>
          <Text style={styles.title}>Bpp Id</Text>
          <Text style={styles.title}>Provider</Text>
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
