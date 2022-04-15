import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-elements';
import {Context as AuthContext} from '../../../../context/Auth';
import {RadioButtonInput} from 'react-native-simple-radio-button';
import {appStyles} from '../../../../styles/styles';

const AddressCard = ({item, selectedAddress, setSelectedAddress}) => {
  const {
    state: {token},
  } = useContext(AuthContext);
  const isSelected = selectedAddress ? item.id === selectedAddress.id : null;
  return (
    <Card containerStyle={styles.card}>
      <View style={styles.container}>
        <View style={[appStyles.container, styles.textContainer]}>
          <Text>
            {item.address.street} {item.address.building}, {item.address.city},{' '}
            {item.address.state}- {item.address.area_code}
          </Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButtonInput
            obj={item}
            borderWidth={1}
            index={item.id}
            buttonSize={10}
            buttonOuterSize={18}
            isSelected={isSelected}
            onPress={value => {
              setSelectedAddress(item);
            }}
          />
        </View>
      </View>
    </Card>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  card: {margin: 0, elevation: 4, marginTop: 15, borderRadius: 8},
  radioButton: {marginLeft: 10},
  textContainer: {flexShrink: 1, flexDirection: 'row'},
});
