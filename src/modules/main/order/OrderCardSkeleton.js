import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card} from 'react-native-elements';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

/**
 * Component to show skeleton of order card
 * @returns {JSX.Element}
 */
const OrderCardSkeleton = ({item}) => {
  return (
    <Card containerStyle={styles.card}>
      <SkeletonPlaceholder>
        <View style={styles.name} />
        <View style={styles.status}>
          <View style={styles.date} />
          <View style={styles.price} />
        </View>
      </SkeletonPlaceholder>
    </Card>
  );
};

export default OrderCardSkeleton;

const styles = StyleSheet.create({
  name: {height: 15, marginBottom: 5, width: '100%'},
  date: {height: 15, width: 180},
  price: {height: 15, width: 90},
  address: {height: 15, marginBottom: 5, width: '40%'},
  street: {height: 15, marginBottom: 5, width: '90%'},
  pin: {height: 15, marginBottom: 25, width: 100},
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  radioButton: {height: 20, width: 20, borderRadius: 20},
  progressBar: {height: 10, width: 100, marginHorizontal: 10, borderRadius: 5},
  button: {height: 30, width: 100, borderRadius: 15, marginHorizontal: 10},
  card: {elevation: 4, borderRadius: 10},
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
