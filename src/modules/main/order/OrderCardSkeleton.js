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
            <View style={styles.status} />
          </SkeletonPlaceholder>
        </View>
      </View>
  </Card>
);


export default OrderCardSkeleton;

const styles = StyleSheet.create({
  row: {flexDirection: 'row', flex: 1},
  details: {flex: 1},
  statusContainer: {width: 100},
  status: {width: 100, height: 40},
  name: {height: 25, marginBottom: 5, flex: 1},
  date: {height: 15, width: 180},
  card: {elevation: 4, borderRadius: 10},
});
