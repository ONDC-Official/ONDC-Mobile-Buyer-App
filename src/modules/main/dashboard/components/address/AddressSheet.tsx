import {Dimensions, StyleSheet, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import React from 'react';
import {useSelector} from 'react-redux';
import AddressList from '../../../cart/components/AddressList';
import CloseSheetContainer from '../../../../../components/bottomSheet/CloseSheetContainer';
import {useAppTheme} from '../../../../../utils/theme';

const screenHeight: number = Dimensions.get('screen').height;

const AddressSheet = ({addressSheet}: {addressSheet: any}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector((state: any) => state.address);

  const detectAddressNavigation = () => {
    addressSheet.current.close();
  };

  return (
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
            deliveryAddress={address}
            setDeliveryAddress={detectAddressNavigation}
            detectAddressNavigation={detectAddressNavigation}
          />
        </View>
      </CloseSheetContainer>
    </RBSheet>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
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

export default AddressSheet;
