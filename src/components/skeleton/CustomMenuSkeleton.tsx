import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const CustomMenuSkeleton = () => (
  <View style={styles.container}>
    <SkeletonPlaceholder>
      <>
        <View style={styles.image} />
        <View style={styles.title} />
      </>
    </SkeletonPlaceholder>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 56,
    marginRight: 24,
  },
  image: {
    width: 56,
    height: 56,
    marginBottom: 6,
  },
  title: {
    height: 16,
    width: 56,
  },
});

export default CustomMenuSkeleton;
