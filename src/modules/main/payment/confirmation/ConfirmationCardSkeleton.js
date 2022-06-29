import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card} from 'react-native-elements';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {appStyles} from '../../../../styles/styles';

/**
 * Component to show skeleton of confirmation card
 * @returns {JSX.Element}
 */
const ConfirmationCardSkeleton = () => (
  <Card>
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.image}/>
        <View style={appStyles.container}>
          <View style={styles.name}/>
          <View style={styles.description}/>
          <View style={styles.priceContainer}>
            <View style={styles.price}/>
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  </Card>
);

export default ConfirmationCardSkeleton;

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  image: {width: 80, height: 80, marginRight: 10},
  name: {width: '100%', height: 15, marginBottom: 10},
  button: {width: 80, height: 30, borderRadius: 15},
  priceContainer: {flexDirection: 'row', alignItems: 'center'},
  price: {width: '35%', height: 15, marginBottom: 10},
  description: {width: '70%', height: 15, marginBottom: 10},
});
