import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Card} from 'react-native-paper';

/**
 * Component to show skeleton of address card
 * @returns {JSX.Element}
 */
const AddressSkeleton = () => (
  <Card style={styles.container}>
    <View style={styles.skeletonContainer}>
      <SkeletonPlaceholder>
        <View style={styles.radioButton} />
      </SkeletonPlaceholder>
      <View style={styles.details}>
        <SkeletonPlaceholder>
          <>
            <View style={styles.text} />
            <View style={styles.text} />
            <View style={styles.text} />
            <View style={styles.text} />
          </>
        </SkeletonPlaceholder>
      </View>
    </View>
  </Card>
);

export default AddressSkeleton;

const styles = StyleSheet.create({
  container: {
    margin: 8,
    backgroundColor: 'white',
  },
  skeletonContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  details: {
    flexGrow: 1,
    marginLeft: 10,
  },
  radioButton: {height: 24, width: 24, borderRadius: 12},
  text: {height: 15, width: '90%', marginBottom: 5},
});
