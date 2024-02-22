import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomMenu from './CustomMenu';
import Products from '../../../../components/products/Products';
import {useAppTheme} from '../../../../utils/theme';

interface OtherBrandDetails {
  provider: any;
}

const OtherBrandDetails: React.FC<OtherBrandDetails> = ({provider}) => {
  const {colors} = useAppTheme();
  const styles = makeStyles();
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  return (
    <View style={styles.container}>
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
