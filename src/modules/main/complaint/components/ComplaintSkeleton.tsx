import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

/**
 * Component to show skeleton of complaint
 * @returns {JSX.Element}
 */
const ComplaintSkeleton = () => (
  <View style={styles.container}>
    <SkeletonPlaceholder>
      <View style={styles.image} />
    </SkeletonPlaceholder>
    <SkeletonPlaceholder>
      <View style={styles.details} />
    </SkeletonPlaceholder>
  </View>
);

export default ComplaintSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 52,
    height: 52,
    marginRight: 8,
  },
  details: {
    width: 200,
    height: 100,
  },
});
