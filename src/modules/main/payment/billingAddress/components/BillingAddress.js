import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
const BillingAddress = ({
  item,
  theme,
  isCurrentAddress,
  setBillingAddress,
  onEdit,
}) => {
  const {colors} = theme;
  const {street, landmark, city, state, areaCode} = item.address;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setBillingAddress(item)}>
      <View style={styles.emptyCheckbox}>
        {isCurrentAddress && (
          <Icon name={'check-circle'} color={colors.primary} size={24} />
        )}
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.textContainer}>
          <Text>{item?.name}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text>{item?.email}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text>{item?.phone}</Text>
        </View>
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

export default withTheme(BillingAddress);

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
