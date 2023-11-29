import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomMenu from './CustomMenu';
import Products from '../../../../components/products/Products';

interface OtherBrandDetails {
  provider: any;
}

const OtherBrandDetails: React.FC<OtherBrandDetails> = ({provider}) => {
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

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });

export default OtherBrandDetails;
