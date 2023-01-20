import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

/**
 * Component to show skeleton of address card
 * @returns {JSX.Element}
 */
const AddressSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.radioButton} />
        <View>
          <View style={styles.name} />
          <View style={styles.email} />
          <View style={styles.address} />
          <View style={styles.pin} />
        </View>
      </View>
    </SkeletonPlaceholder>
  </View>
);

export default AddressSkeleton;

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 12,
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
  },
  radioButton: {height: 24, width: 24, borderRadius: 20},
  name: {height: 15, width: 100, marginBottom: 5},
  email: {height: 15, width: 200, marginBottom: 5},
  address: {height: 15, width: '90%', marginBottom: 5},
  pin: {height: 15, width: 100, marginBottom: 5},
});
