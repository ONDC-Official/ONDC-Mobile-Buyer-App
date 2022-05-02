import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card} from 'react-native-elements';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const AddressCardSkeleton = () => {
  return (
    <Card containerStyle={styles.card}>
      <SkeletonPlaceholder>
        <View style={styles.container}>
          <View>
            <View style={styles.name}/>
            <View style={styles.email}/>
            <View style={styles.address}/>
            <View style={styles.pin}/>
          </View>
          <View style={styles.radioButton}/>
        </View>
      </SkeletonPlaceholder>
    </Card>
  );
};

export default AddressCardSkeleton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {marginHorizontal: 0, borderRadius: 8, elevation: 4},
  radioButton: {height: 20, width: 20, borderRadius: 20},
  name: {height: 15, width: 100, marginBottom: 5},
  email: {height: 15, width: 200, marginBottom: 5},
  address: {height: 15, width: '90%', marginBottom: 5},
  pin: {height: 15, width: 100, marginBottom: 5},
});
