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
const AddressCard = ({item, theme, selectedAddress, setSelectedAddress}) => {
  const {colors} = theme;

  const isSelected = selectedAddress ? item.id === selectedAddress.id : null;
  const separator = ',';

  const onPressHandler = () => setSelectedAddress(item);

  return (
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
            <Text style={styles.address}>
              {item.address.building ? item.address.building : null}
              {item.address.building ? separator : null} {item.address.street},{' '}
              {item.address.city} {item.address.state}
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
  name: {textTransform: 'capitalize', fontSize: 16, fontWeight: 'bold'},
  address: {textTransform: 'capitalize'},
});
