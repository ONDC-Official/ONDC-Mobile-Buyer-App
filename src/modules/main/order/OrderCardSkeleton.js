import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card} from 'react-native-elements';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

/**
 * Component to show skeleton of order card
 * @returns {JSX.Element}
 */
const OrderCardSkeleton = () => (
  <Card containerStyle={styles.card}>
    <SkeletonPlaceholder>
      <View style={styles.name}/>
      <View style={styles.status}>
        <View style={styles.date}/>
        <View style={styles.price}/>
      </View>
    </SkeletonPlaceholder>
  </Card>
);


export default OrderCardSkeleton;

const styles = StyleSheet.create({
  name: {height: 15, marginBottom: 5, width: '100%'},
  date: {height: 15, width: 180},
  price: {height: 15, width: 90},
  card: {elevation: 4, borderRadius: 10},
});
