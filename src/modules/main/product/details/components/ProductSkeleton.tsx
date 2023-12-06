import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ProductSkeleton = () => {
  const styles = makeStyles();
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder>
        <>
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={300}
            marginBottom={40}
          />
          <SkeletonPlaceholder.Item width={100} height={20} marginBottom={10} />
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={48}
            marginBottom={12}
          />
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={100}
              height={20}
              marginRight={16}
            />
            <SkeletonPlaceholder.Item width={100} height={20} />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={100}
              height={20}
              marginRight={16}
            />
            <SkeletonPlaceholder.Item width={100} height={20} />
          </SkeletonPlaceholder.Item>
        </>
      </SkeletonPlaceholder>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });

export default ProductSkeleton;
