import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';
import SearchBar from './SearchBar';
import Logo from '../../../assets/logo.svg';

const selectLocationLabel = strings('main.product.select_location_label');
const poweredByLabel = strings('main.product.powered_by_label');

/**
 * Component to show address picker screen when user wants to select location
 * @param closeSheet:function which close the rb sheet
 * @param setLocation:function to set location selected by user
 * @param setEloc:function set eloc of selected location
 * @constructor
 * @returns {JSX.Element}
 */
const AddressPicker = ({closeSheet, setLocation, setEloc}) => {
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
        <Text>{poweredByLabel}</Text>
        <Logo />
      </View>
      <SearchBar
        setLocation={setLocation}
        closeSheet={closeSheet}
        setEloc={setEloc}
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
