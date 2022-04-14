import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';
import SearchBar from './SearchBar';

const selectLocationLabel = strings('main.product.select_location_label');

const AddressPicker = ({
  closeSheet,
  setLocation,
  setLatitude,
  setLongitude,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={appStyles.container}>
          <Text>{selectLocationLabel}</Text>
        </View>
        <Icon
          type="material-community"
          name="close-circle"
          onPress={closeSheet}
        />
      </View>
      <View style={styles.header}>
        <Text>Powered by </Text>
        <Image
          source={require('../../../assets/logo-m.png')}
          style={styles.image}
          resizeMode={'contain'}
        />
      </View>
      <SearchBar
        setLocation={setLocation}
        closeSheet={closeSheet}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
      />
    </View>
  );
};

export default AddressPicker;

const styles = StyleSheet.create({
  container: {padding: 10},
  image: {height: 33, width: 138},
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
});
