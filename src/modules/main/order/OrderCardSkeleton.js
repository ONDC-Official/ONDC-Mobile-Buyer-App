import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card} from 'react-native-elements';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const OrderCardSkeleton = () => {
  return (
    <Card containerStyle={styles.card}>
      <SkeletonPlaceholder>
        <View style={styles.name}/>
        <View style={styles.date}/>
        <View style={styles.price}/>
        <View style={styles.address}/>
        <View styles={styles.street}/>
        <View style={styles.pin}/>
        <View style={styles.status}>
          <View style={styles.radioButton}/>
          <View style={styles.progressBar}/>
          <View style={styles.radioButton}/>
          <View style={styles.progressBar}/>
          <View style={styles.radioButton}/>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}/>
          <View style={styles.button}/>
        </View>
      </SkeletonPlaceholder>
    </Card>
  );
};

export default OrderCardSkeleton;

const styles = StyleSheet.create({
  name: {height: 15, marginBottom: 5, width: '100%'},
  date: {height: 15, marginBottom: 5, width: '80%'},
  price: {height: 15, marginBottom: 25, width: '30%'},
  address: {height: 15, marginBottom: 5, width: '40%'},
  street: {height: 15, marginBottom: 5, width: '90%'},
  pin: {height: 15, marginBottom: 25, width: 100},
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 15,
  },
  radioButton: {height: 20, width: 20, borderRadius: 20},
  progressBar: {height: 10, width: 100, marginHorizontal: 10, borderRadius: 5},
  button: {height: 30, width: 100, borderRadius: 15, marginHorizontal: 10},
  card: {marginHorizontal: 0, elevation: 4, borderRadius: 10},
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
