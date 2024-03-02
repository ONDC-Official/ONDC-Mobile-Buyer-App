import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import CustomMenu from './CustomMenu';
import Products from '../../../../components/products/Products';
import {useAppTheme} from '../../../../utils/theme';
import OutletDetails from './OutletDetails';

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
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

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
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });

export default OtherBrandDetails;
