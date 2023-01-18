import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {setStoredData} from '../../../../utils/storage';
import {useNavigation} from '@react-navigation/native';
import {IconButton, Text, withTheme} from 'react-native-paper';

/**
 * Component to render single address card in select address screen
 * @param theme
 * @param selectedAddress:address selected by user
 * @param item:object which contains address details
 * @param onEdit:function handles click event of edit
 * @constructor
 * @returns {JSX.Element}
 */
const Address = ({item, theme, isCurrentAddress, onEdit}) => {
  const navigation = useNavigation();
  const {colors} = theme;
  const {street, landmark, city, state, areaCode} = item.address;
  const {cartItems} = useSelector(({cartReducer}) => cartReducer);

  const setDefaultAddress = () => {
    if (cartItems.length > 0 && !isCurrentAddress) {
      alert('Confirm if you want update the address?');
    } else {
      setStoredData('address', JSON.stringify(item)).then(response => {
        navigation.pop();
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setDefaultAddress()}>
      <View style={styles.emptyCheckbox}>
        {isCurrentAddress && (
          <Icon name={'check-circle'} color={colors.primary} size={24} />
        )}
      </View>

      <View style={styles.addressContainer}>
        {item?.descriptor?.name && (
          <View style={styles.textContainer}>
            <Text>{item?.descriptor?.name}</Text>
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
          {street} {landmark} {city} {state} {areaCode}
        </Text>
      </View>
      <View style={styles.editContainer}>
        <IconButton
          onPress={onEdit}
          icon="pencil"
          size={18}
          iconColor={colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default withTheme(Address);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    backgroundColor: 'white',
  },
  addressContainer: {
    flexGrow: 1,
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
