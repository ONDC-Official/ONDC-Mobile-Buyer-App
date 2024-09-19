import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

import Products from '../../../../components/products/Products';
import {useAppTheme} from '../../../../utils/theme';
import OutletDetails from './OutletDetails';

interface OtherBrandDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
}

const OtherBrandDetails: React.FC<OtherBrandDetails> = React.memo(
  ({provider, outlet, apiRequested}) => {
    const {t} = useTranslation();
    const {colors} = useAppTheme();
    const styles = makeStyles(colors);

    if (provider) {
      return (
        <View style={styles.container}>
          <OutletDetails
            provider={provider}
            outlet={outlet}
            apiRequested={apiRequested}
          />
          <Products
            providerId={provider.id}
            providerDomain={provider.domain}
            provider={provider}
            searchText={''}
            subCategories={[]}
            isOpen={outlet?.isOpen || false}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.providerNotFound}>
          <Text variant={'bodyLarge'}>{t('Global.Details not available')}</Text>
        </View>
      );
    }
  },
);

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    providerNotFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default OtherBrandDetails;
