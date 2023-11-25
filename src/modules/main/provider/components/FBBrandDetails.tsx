import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import BrandSkeleton from '../../../../components/skeleton/BrandSkeleton';

interface FBBrandDetails {
  provider: any;
  apiRequested: boolean;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const FBBrandDetails: React.FC<FBBrandDetails> = ({provider, apiRequested}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  if (apiRequested) {
    return <BrandSkeleton />;
  }
  return (
    <View style={styles.container}>
      <FastImage
        style={styles.brandImage}
        source={
          provider?.descriptor?.symbol
            ? {uri: provider?.descriptor?.symbol}
            : NoImageAvailable
        }
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.brandDetails}>
        <Text variant={'titleMedium'}>{provider?.descriptor?.name}</Text>
        <View style={styles.borderBottom} />
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    brandImage: {
      height: 268,
    },
    brandDetails: {
      padding: 16,
    },
    borderBottom: {
      backgroundColor: '#E0E0E0',
      height: 1,
      marginVertical: 24,
    },
  });

export default FBBrandDetails;
