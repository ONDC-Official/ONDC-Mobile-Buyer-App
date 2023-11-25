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
          <View style={styles.row}>
            <View style={styles.amount} />
            <View style={styles.button} />
          </View>
        </>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
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
  amount: {
    height: 16,
    width: 80,
  },
  button: {
    height: 32,
    width: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductSkeleton;
