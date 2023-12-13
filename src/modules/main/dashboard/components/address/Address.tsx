import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RadioButton, Text, useTheme} from 'react-native-paper';
import {alertWithTwoButtons} from '../../../../../utils/alerts';
import {clearCart} from '../../../../../redux/actions';
import {saveAddress} from '../../../../../redux/address/actions';

interface Address {
  item: any;
  isCurrentAddress: boolean;
  params: any;
  onAddressSelect: (item: any) => void;
}

/**
 * Component to render single address card in select address screen
 * @param selectedAddress: address selected by user
 * @param item:object which contains address details
 * @constructor
 * @returns {JSX.Element}
 */
const Address: React.FC<Address> = ({
  item,
  isCurrentAddress,
  params,
  onAddressSelect,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {street, landmark, city, state, areaCode} = item.address;
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const setDefaultAddress = async () => {
    if (params?.navigateToNext) {
      onAddressSelect(item);
    } else if (cartItems.length > 0 && !isCurrentAddress) {
      alertWithTwoButtons(
        'Address Updated',
        'You want update the address, it will clear your existing cart. Please confirm if you want to go ahead with this?',
        'Yes',
        () => {
          dispatch(clearCart());
          addAddressToStore();
        },
        'No',
        () => {},
      );
    } else {
      addAddressToStore();
    }
  };

  const addAddressToStore = () => {
    dispatch(saveAddress(item));
    if (params?.navigateToDashboard) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={setDefaultAddress}>
      <View style={styles.header}>
        <RadioButton.Android
          onPress={setDefaultAddress}
          value={item?.descriptor?.name}
          status={isCurrentAddress ? 'checked' : 'unchecked'}
        />
        {item?.descriptor?.name && (
          <Text variant="titleMedium" style={styles.name}>
            {item?.descriptor?.name}
          </Text>
        )}
      </View>
      <Text variant={'bodySmall'} style={styles.description}>
        {street}, {landmark ? `${landmark},` : ''} {city}, {state}, {areaCode}{' '}
        {item?.descriptor?.phone ? `phone: ${item?.descriptor?.phone}` : ''}
      </Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('UpdateAddress', {address: item})}>
        <Icon name={'pencil-outline'} color={theme.colors.primary} size={17} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Address;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: 'white',
      margin: 8,
      borderWidth: 1,
      borderColor: '#196AAB',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      marginLeft: 8,
    },
    description: {
      color: '#4F4F4F',
      marginBottom: 20,
    },
    editButton: {
      borderColor: colors.primary,
      borderWidth: 1,
      width: 27,
      height: 27,
      borderRadius: 14,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
