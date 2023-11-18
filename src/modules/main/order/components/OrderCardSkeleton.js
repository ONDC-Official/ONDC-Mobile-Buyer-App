import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Card} from 'react-native-paper';

/**
 * Component to show skeleton of order card
 * @returns {JSX.Element}
 */
const OrderCardSkeleton = () => (
  <Card style={styles.card}>
    <View style={styles.row}>
      <View style={styles.details}>
        <SkeletonPlaceholder>
          <View style={styles.name}/>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <View style={styles.date}/>
        </SkeletonPlaceholder>
      </View>
      <View style={styles.statusContainer}>
        <SkeletonPlaceholder>
          <View style={styles.label}/>
        </SkeletonPlaceholder>
      </View>
    </View>
  </Card>
);

export default OrderCardSkeleton;

const styles = StyleSheet.create({
  row: {flexDirection: 'row', flex: 1},
  details: {flex: 1},
  statusContainer: {width: 100, justifyContent: 'center'},
  label: {width: 100, height: 30, marginBottom: 5},
  name: {height: 25, width: 180, marginBottom: 5},
  date: {height: 15, width: 180},
  card: {
    elevation: 4,
    borderRadius: 10,
    margin: 8,
    backgroundColor: 'white',
    padding: 8,
  },
});
