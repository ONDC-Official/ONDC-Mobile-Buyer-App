import React from 'react';
import {StyleSheet, View} from 'react-native';
import Header from '../addressPicker/Header';
import {Text, withTheme} from 'react-native-elements';
import {appStyles} from '../../../../styles/styles';
import ContainButton from '../../../../components/button/ContainButton';
import OutlineButton from '../../../../components/button/OutlineButton';

const Payment = ({navigation, theme, route: {params}}) => {
  const {colors} = theme;
  const {selectedAddress} = params;
  return (
    <View
      style={[appStyles.container, {backgroundColor: colors.backgroundColor}]}>
      <Header title="Checkout" navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.text}>Address</Text>
        <View style={styles.addressContainer}>
          <Text>
            {selectedAddress.address.street}, {selectedAddress.address.locality}
            , {selectedAddress.address.city}, {selectedAddress.address.state} -{' '}
            {selectedAddress.address.area_code}
          </Text>
        </View>

        <Text style={styles.text}>Payment</Text>
        <View style={styles.addressContainer}>
          <OutlineButton title={'JustPay'} type="outline" />
        </View>
        <Text style={styles.text}>Cash On Delivery</Text>
        <View style={styles.addressContainer}>
          <OutlineButton title={'Cash On Delivery'} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ContainButton title="Next" />
      </View>
    </View>
  );
};

export default withTheme(Payment);

const styles = StyleSheet.create({
  container: {padding: 15},
  text: {fontSize: 18, fontWeight: '600'},
  buttonContainer: {width: 300, alignSelf: 'center'},
  addressContainer: {marginVertical: 15},
});
