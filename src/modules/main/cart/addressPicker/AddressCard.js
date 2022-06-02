import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, CheckBox, Text, withTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {appStyles} from '../../../../styles/styles';

/**
 * Component to render single address card in select address screen
 * @param theme
 * @param selectedAddress:address selected by user
 * @param setSelectedAddress:function to set selected address
 * @param item:object which contains address details
 * @constructor
 * @returns {JSX.Element}
 */
const AddressCard = ({
  item,
  theme,
  onEdit,
  selectedAddress,
  setSelectedAddress,
}) => {
  const {colors} = theme;

  const isSelected = selectedAddress ? item.id === selectedAddress.id : null;

  const {street, city, state} = item.address;

  const onPressHandler = () => setSelectedAddress(item);

  return item.descriptor ? (
    <Card containerStyle={styles.card}>
      <CheckBox
        key={item.id}
        checked={isSelected}
        onPress={onPressHandler}
        containerStyle={[
          styles.containerStyle,
          {
            backgroundColor: colors.backgroundColor,
          },
        ]}
        title={
          <View style={[styles.title, appStyles.container]}>
            <View style={styles.iconContainer}>
              {item.descriptor.name ? (
                <Text style={styles.name}>{item.descriptor.name}</Text>
              ) : null}
              <TouchableOpacity onPress={onEdit}>
                <Icon name="pencil" size={14} color={colors.accentColor} />
              </TouchableOpacity>
            </View>
            {item.descriptor.email ? (
              <Text style={[styles.text, {color: colors.grey}]}>
                {item.descriptor.email}
              </Text>
            ) : null}
            {item.descriptor.phone ? (
              <Text style={[styles.text, {color: colors.grey}]}>
                {item.descriptor.phone}
              </Text>
            ) : null}
            <Text style={[styles.address, {color: colors.grey}]}>
              {street} {city} {state}
            </Text>
            <Text style={{color: colors.grey}}>{item.address.areaCode}</Text>
          </View>
        }
      />
    </Card>
  ) : (
    <Card containerStyle={styles.card}>
      <CheckBox
        key={item.id}
        checked={isSelected}
        onPress={onPressHandler}
        containerStyle={[
          styles.containerStyle,
          {
            backgroundColor: colors.backgroundColor,
          },
        ]}
        title={
          <View style={[styles.title, appStyles.container]}>
            <View style={styles.iconContainer}>
              {item.name ? <Text style={styles.name}>{item.name}</Text> : null}
              <TouchableOpacity onPress={onEdit}>
                <Icon name="pencil" size={14} color={colors.accentColor} />
              </TouchableOpacity>
            </View>

            {item.email ? (
              <Text style={[styles.text, {color: colors.grey}]}>
                {item.email}
              </Text>
            ) : null}
            {item.phone ? (
              <Text style={[styles.text, {color: colors.grey}]}>
                {item.phone}
              </Text>
            ) : null}
            <Text style={[styles.address, {color: colors.grey}]}>
              {street} {city} {state}
            </Text>
            <Text style={{color: colors.grey}}>{item.address.areaCode}</Text>
          </View>
        }
      />
    </Card>
  );
};

export default withTheme(AddressCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 5,
  },
  card: {
    margin: 0,
    elevation: 4,
    marginTop: 15,
    borderRadius: 8,
    padding: 0,
  },
  textContainer: {flexShrink: 1, flexDirection: 'row'},
  name: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    flexShrink: 1,
  },
  text: {marginBottom: 4},
  address: {textTransform: 'capitalize', marginBottom: 4},
  button: {
    marginTop: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  iconContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  title: {marginLeft: 5},
  containerStyle: {borderWidth: 0, margin: 0},
});
