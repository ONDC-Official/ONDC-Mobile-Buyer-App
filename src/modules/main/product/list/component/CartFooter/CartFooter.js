import {StyleSheet, View} from 'react-native';
import {Button, Text, withTheme} from 'react-native-paper';
import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {appStyles} from '../../../../../../styles/styles';

const CartFooter = ({theme}) => {
  const navigation = useNavigation();
  const {cartItems, subTotal} = useSelector(({cartReducer}) => cartReducer);
  const cartLength = cartItems.length;

  if (cartLength > 0) {
    return (
      <View style={[styles.footer, {backgroundColor: theme.colors.footer}]}>
        <View style={appStyles.container}>
          <Text>{cartLength} Item</Text>
          <Text style={styles.totalAmount}>₹{subTotal}</Text>
        </View>
        <View style={appStyles.container}>
          <Button
            mode="contained"
            contentStyle={appStyles.containedButtonContainer}
            labelStyle={appStyles.containedButtonLabel}
            onPress={() => navigation.navigate('Cart')}>
            View Cart
          </Button>
        </View>
      </View>
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default withTheme(CartFooter);
