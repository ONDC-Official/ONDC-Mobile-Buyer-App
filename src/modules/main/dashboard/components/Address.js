import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setStoredData} from '../../../../utils/storage';
import {useNavigation} from '@react-navigation/native';
import {Card, Text, withTheme} from 'react-native-paper';
import {alertWithTwoButtons} from '../../../../utils/alerts';
import {clearCart} from '../../../../redux/actions';

/**
 * Component to render single address card in select address screen
 * @param theme
 * @param selectedAddress:address selected by user
 * @param item:object which contains address details
 * @constructor
 * @returns {JSX.Element}
 */
const Address = ({item, theme, isCurrentAddress, params}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {colors} = theme;
  const {street, landmark, city, state, areaCode, tag} = item.address;
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const setDefaultAddress = () => {
    if (cartItems.length > 0 && !isCurrentAddress) {
      alertWithTwoButtons(
        'Address Updated',
        'You want update the address, it will clear your existing cart. Please confirm if you want to go ahead with this?',
        'Yes',
        () => {
          dispatch(clearCart());
          addAddressTostore();
        },
        'No',
        () => {},
      );
    } else {
      addAddressTostore();
    }
  };

  const addAddressTostore = () => {
    setStoredData('address', JSON.stringify(item)).then(response => {
      if (params?.navigateToDashboard) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
      } else {
        navigation.goBack();
      }
    });
  };

  return (
    <Card style={styles.card} onPress={setDefaultAddress}>
      <View style={styles.container}>
        <View style={styles.emptyCheckbox}>
          {isCurrentAddress && (
            <Icon name={'check-circle'} color={colors.primary} size={24} />
          )}
        </View>

        <View style={styles.addressContainer}>
          {tag && (
            <View style={styles.textContainer}>
              <Text variant="titleMedium">{tag}</Text>
            </View>
          )}
          {item?.descriptor?.name && (
            <View style={styles.textContainer}>
              <Text variant="titleMedium">{item?.descriptor?.name}</Text>
            </View>
          )}
          {item?.descriptor?.email && (
            <View style={styles.textContainer}>
              <Text>{item?.descriptor?.email}</Text>
            </View>
          )}
          {item?.descriptor?.phone && (
            <View style={styles.textContainer}>
              <Text>{item?.descriptor?.phone}</Text>
            </View>
          )}
          <Text>
            {street}, {landmark ? `${landmark},` : ''} {city}, {state},{' '}
            {areaCode}
          </Text>
        </View>
        <View style={styles.editContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UpdateAddress', {address: item})
            }>
            <Icon name="pencil-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default withTheme(Address);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    margin: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
  },
  addressContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  emptyCheckbox: {
    width: 24,
    height: 24,
  },
  editContainer: {
    width: 24,
    height: 24,
    marginEnd: 8,
  },
  textContainer: {
    marginBottom: 8,
  },
});
