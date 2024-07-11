import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import BrandSkeleton from '../../../../components/skeleton/BrandSkeleton';
import FBProducts from './FBProducts';
import OutletDetails from './OutletDetails';

interface FBBrandDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
  minTimeToShipMinutes: number;
  setMinTimeToShipMinutes: (value: number) => void;
  maxTimeToShipMinutes: number;
  setMaxTimeToShipMinutes: (value: number) => void;
}

const FBBrandDetails: React.FC<FBBrandDetails> = ({
  provider,
  outlet,
  apiRequested,
  minTimeToShipMinutes,
  setMinTimeToShipMinutes,
  maxTimeToShipMinutes,
  setMaxTimeToShipMinutes,
}) => {
  const styles = makeStyles();

  if (apiRequested) {
    return <BrandSkeleton />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <OutletDetails
          provider={provider}
          outlet={outlet}
          apiRequested={apiRequested}
          minTimeToShipMinutes={minTimeToShipMinutes}
          maxTimeToShipMinutes={maxTimeToShipMinutes}
        />
        <FBProducts
          provider={provider?.id}
          domain={provider?.domain}
          setMinTimeToShipMinutes={setMinTimeToShipMinutes}
          setMaxTimeToShipMinutes={setMaxTimeToShipMinutes}
        />
      </View>
    </ScrollView>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });

export default FBBrandDetails;
