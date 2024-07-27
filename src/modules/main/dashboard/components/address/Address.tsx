import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RadioButton, Text} from 'react-native-paper';
import {useAppTheme} from '../../../../../utils/theme';
import {setStoredData} from '../../../../../utils/storage';
import {setAddress} from '../../../../../toolkit/reducer/address';

interface Address {
  detectAddressNavigation?: () => void | null;
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
  detectAddressNavigation = null,
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

  const setDefaultAddress = async () => {
    if (params?.navigateToNext) {
      onAddressSelect(item);
    } else {
      await addAddressToStore();
    }
  };

  const addAddressToStore = async () => {
    await setStoredData('address', JSON.stringify(item));
    dispatch(setAddress(item));
    if (params?.navigateToDashboard) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
    } else {
      navigation.goBack();
    }
  };

  const editAddress = () => {
    navigation.navigate('UpdateAddress', {address: item});
    if (detectAddressNavigation) {
      detectAddressNavigation();
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
            <Text
              variant="bodyLarge"
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {item?.descriptor?.name}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.editButton} onPress={editAddress}>
          <Icon name={'pencil'} color={theme.colors.primary} size={16} />
        </TouchableOpacity>
      </View>
      <Text variant={'bodyMedium'} style={styles.description}>
        {street}, {landmark ? `${landmark},` : ''} {city}, {state}, {areaCode}
      </Text>
    </TouchableOpacity>
  );
};

export default Address;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.neutral100,
      borderRadius: 8,
      paddingLeft: 8,
      paddingRight: 16,
      paddingVertical: 16,
      backgroundColor: colors.white,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    name: {
      marginHorizontal: 8,
      color: colors.neutral400,
      flex: 1,
    },
    description: {
      color: colors.neutral300,
      paddingLeft: 8,
    },
    editButton: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
