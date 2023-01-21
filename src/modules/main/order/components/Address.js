import {Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React from 'react';

const Address = ({name, email, title, phone, address}) => {
  return (
    <View style={styles.addressContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.address}>{email}</Text>
      <Text style={styles.address}>{phone}</Text>
      <Text style={styles.address}>
        {address?.street}, {address?.landmark ? `${address?.landmark},` : ''}
        {address?.city}, {address?.state}
      </Text>
      <Text>{address?.areaCode ? address?.areaCode : null}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  addressContainer: {marginTop: 20, flexShrink: 1},
  name: {fontSize: 18, fontWeight: '500', marginVertical: 4, flexShrink: 1},
  address: {marginBottom: 4},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default Address;
