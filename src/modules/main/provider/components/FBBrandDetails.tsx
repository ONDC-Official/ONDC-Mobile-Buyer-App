import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import BrandSkeleton from '../../../../components/skeleton/BrandSkeleton';
import FBProducts from './FBProducts';

interface FBBrandDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const FBBrandDetails: React.FC<FBBrandDetails> = ({
  provider,
  outlet,
  apiRequested,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  if (apiRequested) {
    return <BrandSkeleton />;
  }

  return (
    <ScrollView style={styles.container}>
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
          <Text variant={'titleMedium'} style={styles.title}>
            {provider?.descriptor?.name}
          </Text>
          {!!outlet?.description && (
            <Text variant={'titleSmall'} style={styles.description}>
              {outlet?.description}
            </Text>
          )}
          {!!outlet?.address && (
            <Text variant={'titleSmall'} style={styles.address}>
              {outlet?.address?.street || '-'}, {outlet?.address?.city || '-'}
            </Text>
          )}
          <Text variant={'bodyLarge'}>
            {outlet?.isOpen && (
              <>
                <Text variant={'titleSmall'} style={styles.open}>
                  Open now
                </Text>
                &nbsp;-&nbsp;
              </>
            )}
            {outlet?.timings}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.directionButton, styles.actionButton]}>
              <Text variant={'bodyMedium'} style={styles.directionText}>
                Get Direction
              </Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={[styles.callButton, styles.actionButton]}>
              <Text variant={'bodyMedium'} style={styles.callText}>
                Call Now
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.borderBottom} />
        </View>
        <FBProducts provider={provider?.id} domain={provider?.domain} />
      </View>
    </ScrollView>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    brandImage: {
      height: 268,
      backgroundColor: '#000',
    },
    brandDetails: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    borderBottom: {
      backgroundColor: '#E0E0E0',
      height: 1,
      marginTop: 24,
    },
    title: {
      marginBottom: 10,
    },
    description: {
      color: '#686868',
      marginBottom: 8,
    },
    address: {
      color: colors.error,
      marginBottom: 12,
    },
    open: {
      color: '#419E6A',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 28,
    },
    separator: {
      width: 16,
    },
    actionButton: {
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    directionButton: {
      borderColor: colors.error,
    },
    directionText: {
      color: colors.error,
    },
    callButton: {
      borderColor: colors.primary,
    },
    callText: {
      color: colors.primary,
    },
  });

export default FBBrandDetails;
