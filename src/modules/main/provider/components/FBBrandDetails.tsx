import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import BrandSkeleton from '../../../../components/skeleton/BrandSkeleton';
import FBProducts from './FBProducts';
import {useAppTheme} from '../../../../utils/theme';
import OutletDetails from './OutletDetails';

interface FBBrandDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
}

const FBBrandDetails: React.FC<FBBrandDetails> = ({
  provider,
  outlet,
  apiRequested,
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

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
        />
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
  });

export default FBBrandDetails;
