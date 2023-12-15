import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

/**
 * Component to show skeleton of order card
 * @returns {JSX.Element}
 */
const OrderSkeleton = () => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View>
        <View style={styles.marginBottom}>
          <SkeletonPlaceholder>
            <View style={styles.name} />
          </SkeletonPlaceholder>
        </View>
        <SkeletonPlaceholder>
          <View style={styles.name} />
        </SkeletonPlaceholder>
      </View>
      <SkeletonPlaceholder>
        <View style={styles.tag} />
      </SkeletonPlaceholder>
    </View>
    <View style={styles.imageContainer}>
      <SkeletonPlaceholder>
        <View style={styles.image} />
      </SkeletonPlaceholder>
    </View>
  </View>
);

export default OrderSkeleton;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {height: 18, width: 150},
  tag: {height: 25, width: 100},
  imageContainer: {marginTop: 12},
  image: {
    padding: 10,
    borderRadius: 8,
    width: 50,
    height: 50,
    marginRight: 8,
  },
  marginBottom: {
    marginBottom: 3,
  },
});
