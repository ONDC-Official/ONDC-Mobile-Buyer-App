import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RadioButton, Text} from 'react-native-paper';
import {alertWithTwoButtons} from '../../../../../utils/alerts';
import {clearCart} from '../../../../../redux/actions';
import {saveAddress} from '../../../../../redux/address/actions';
import {useAppTheme} from '../../../../../utils/theme';
import {setStoredData} from '../../../../../utils/storage';

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
  const theme = useAppTheme();
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

  const addAddressToStore = async () => {
    await setStoredData('address', JSON.stringify(item));
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
        <View style={styles.titleContainer}>
          <RadioButton.Android
            onPress={setDefaultAddress}
            value={item?.descriptor?.name}
            status={isCurrentAddress ? 'checked' : 'unchecked'}
          />
          {item?.descriptor?.name && (
            <Text variant="bodyLarge" style={styles.name}>
              {item?.descriptor?.name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('UpdateAddress', {address: item})}>
          <Icon name={'pencil'} color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </View>
      <Text variant={'bodyMedium'} style={styles.description}>
        {street}, {landmark ? `${landmark},` : ''} {city}, {state}, {areaCode}{' '}
        {item?.descriptor?.phone ? `phone: ${item?.descriptor?.phone}` : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default Address;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.neutral100,
      borderRadius: 8,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      marginLeft: 8,
      color: colors.neutral400,
    },
    description: {
      color: colors.neutral300,
    },
  });
