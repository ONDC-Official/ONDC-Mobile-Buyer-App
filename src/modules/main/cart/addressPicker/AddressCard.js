import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text, withTheme} from 'react-native-elements';
import {RadioButtonInput} from 'react-native-simple-radio-button';
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
      <TouchableOpacity activeOpacity={0.8} onPress={onPressHandler}>
        <View style={styles.container}>
          <View style={[appStyles.container]}>
            {item.descriptor.name ? (
              <Text style={styles.name}>{item.descriptor.name}</Text>
            ) : null}
            {item.descriptor.email ? (
              <Text style={{color: colors.grey}}>
                {item.descriptor.email} - {item.descriptor.phone}
              </Text>
            ) : null}
            <Text style={[styles.address, {color: colors.grey}]}>
              {street} {city} {state}
            </Text>
            <Text style={{color: colors.grey}}>{item.address.areaCode}</Text>
            <TouchableOpacity
              style={[styles.button, {borderColor: colors.accentColor}]}
              onPress={onEdit}>
              <Text style={{color: colors.accentColor}}>EDIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.radioButton}>
            <RadioButtonInput
              obj={item}
              borderWidth={1}
              index={item.id}
              buttonSize={10}
              buttonInnerColor={colors.accentColor}
              buttonOuterColor={colors.accentColor}
              buttonOuterSize={18}
              isSelected={isSelected}
              onPress={onPressHandler}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  ) : (
    <Card containerStyle={styles.card}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPressHandler}>
        <View style={styles.container}>
          <View style={[appStyles.container]}>
            {item.name ? <Text style={styles.name}>{item.name}</Text> : null}
            {item.email ? (
              <Text style={{color: colors.grey}}>
                {item.email} - {item.phone}
              </Text>
            ) : null}
            <Text style={[styles.address, {color: colors.grey}]}>
              {street} {city} {state}
            </Text>
            <Text style={{color: colors.grey}}>{item.address.area_code}</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButtonInput
              obj={item}
              borderWidth={1}
              index={item.id}
              buttonSize={10}
              buttonInnerColor={colors.accentColor}
              buttonOuterColor={colors.accentColor}
              buttonOuterSize={18}
              isSelected={isSelected}
              onPress={onPressHandler}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default withTheme(AddressCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  card: {margin: 0, elevation: 4, marginTop: 15, borderRadius: 8},
  radioButton: {marginLeft: 10},
  textContainer: {flexShrink: 1, flexDirection: 'row'},
  name: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {textTransform: 'capitalize', marginVertical: 4},
  button: {
    marginTop: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});
