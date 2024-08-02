import React, {useRef, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';

import Header from '../header/Header';
import Categories from '../home/Categories';
import {useAppTheme} from '../../../../../utils/theme';
import StoresNearMe from '../../../category/components/StoresNearMe';
import CloseSheetContainer from '../../../../../components/bottomSheet/CloseSheetContainer';
import AddressList from '../../../../main/cart/components/AddressList';

const screenHeight: number = Dimensions.get('screen').height;

const Home = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const addressSheet = useRef<any>();

  const {address} = useSelector((state: any) => state.address);
  const [deliveryAddress, setDeliveryAddress] = useState(address);

  const updateDeliveryAddress = (newAddress: any) => {
    setDeliveryAddress(newAddress);
    addressSheet.current.close();
  };

  const detectAddressNavigation = () => {
    addressSheet.current.close();
  };

  const openAddressList = () => {
    addressSheet.current.open();
  };

  return (
    <View style={styles.container}>
      <Header onPress={openAddressList} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Categories />
        <StoresNearMe />
      </ScrollView>
      <RBSheet
        closeOnPressMask={false}
        ref={addressSheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <CloseSheetContainer closeSheet={() => addressSheet.current.close()}>
          <View style={styles.addressContainer}>
            <AddressList
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={updateDeliveryAddress}
              detectAddressNavigation={detectAddressNavigation}
            />
          </View>
        </CloseSheetContainer>
      </RBSheet>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    rbSheet: {
      backgroundColor: 'rgba(47, 47, 47, 0.75)',
    },
    addressContainer: {
      backgroundColor: colors.white,
      flex: 1,
      paddingTop: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
  });

export default Home;
