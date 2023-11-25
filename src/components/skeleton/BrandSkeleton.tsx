import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import React from 'react';

const BrandSkeleton = () => {
  return (
    <View>
      <SkeletonPlaceholder>
        <>
          <View style={styles.brandImage} />
          <View style={styles.brandDetails}>
            <View style={styles.title} />
          </View>
        </>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  brandImage: {
    height: 268,
  },
  brandDetails: {
    padding: 16,
  },
  title: {
    height: 32,
    width: 200,
  },
});

export default BrandSkeleton;
