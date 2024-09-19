import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import React from 'react';
import {screenWidth} from '../../../../utils/constants';

const StoreSkeleton = () => {
  const styles = makeStyles();
  return (
    <View style={styles.brand}>
      <SkeletonPlaceholder>
        <View style={styles.image} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder>
        <View style={styles.name} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder>
        <View style={styles.description} />
      </SkeletonPlaceholder>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    brand: {
      width: (screenWidth - 54) / 3,
      marginBottom: 15,
    },
    image: {
      width: '100%',
      height: 64,
    },
    name: {
      width: 70,
      height: 14,
      marginTop: 8,
      marginBottom: 4,
    },
    description: {
      width: 70,
      height: 14,
    },
  });

export default StoreSkeleton;
