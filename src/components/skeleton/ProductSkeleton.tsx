import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import React from 'react';

const ProductSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder>
        <>
          <View style={styles.image} />
          <View style={styles.title} />
          <View style={styles.brand} />
        </>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 8,
    flex: 1,
    marginBottom: 20,
  },
  image: {
    height: 180,
    width: '100%',
    marginBottom: 10,
  },
  title: {
    height: 32,
    width: '100%',
    marginBottom: 8,
  },
  brand: {
    height: 12,
    width: '100%',
    marginBottom: 8,
  },
});

export default ProductSkeleton;
