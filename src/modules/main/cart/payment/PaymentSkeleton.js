import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PaymentSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.heading} />
        <View style={styles.address} />
        <View style={styles.paymentOptionsHeading} />
        <View style={styles.paymentOption}>
          <View style={styles.radioButton} />
          <View style={styles.label} />
        </View>
        <View style={styles.paymentOption}>
          <View style={styles.radioButton} />
          <View style={styles.label} />
        </View>
        <View style={styles.button} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default PaymentSkeleton;

const styles = StyleSheet.create({
  heading: {
    height: 20,
    marginBottom: 20,
    width: 100,
  },
  container: {padding: 15},
  address: {height: 15, marginBottom: 30, width: 300},
  paymentOptionsHeading: {height: 20, marginBottom: 20, width: 150},
  paymentOption: {flexDirection: 'row', marginBottom: 10, alignItems: 'center'},
  radioButton: {height: 20, width: 20, borderRadius: 20, marginRight: 20},
  label: {height: 15, width: 200},
  button: {height: 30, width: 300, marginVertical: 30, alignSelf: 'center'},
});
