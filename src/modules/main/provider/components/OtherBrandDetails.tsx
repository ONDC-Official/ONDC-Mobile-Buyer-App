import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import CustomMenu from './CustomMenu';
import Products from '../../../../components/products/Products';
import {useAppTheme} from '../../../../utils/theme';
import OutletDetails from './OutletDetails';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

interface OtherBrandDetails {
  provider: any;
  outlet: any;
  apiRequested: boolean;
}

const OtherBrandDetails: React.FC<OtherBrandDetails> = ({
  provider,
  outlet,
  apiRequested,
}) => {
  const {t} = useTranslation();
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  if (provider) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <OutletDetails
            provider={provider}
            outlet={outlet}
            apiRequested={apiRequested}
          />
          <CustomMenu
            providerId={provider.id}
            providerDomain={provider.domain}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
          <Products
            providerId={provider.id}
            customMenu={selectedMenu}
            subCategories={[]}
          />
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.providerNotFound}>
        <Text variant={'bodyLarge'}>{t('Global.Details not available')}</Text>
      </View>
    );
  }
};

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
