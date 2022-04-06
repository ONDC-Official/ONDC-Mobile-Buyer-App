import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';
import SearchBar from './SearchBar';

const selectLocationLabel = strings('main.product.select_location_label');

const SetLocation = ({closeSheet, setLocation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={appStyles.container}>
          <Text>{selectLocationLabel}</Text>
        </View>
        <Icon
          type="material-community"
          name="close-thick"
          onPress={closeSheet}
        />
      </View>
      <SearchBar setLocation={setLocation} closeSheet={closeSheet} />
    </View>
  );
};

export default SetLocation;

const styles = StyleSheet.create({
  container: {padding: 10},
  header: {flexDirection: 'row', alignItems: 'center', marginVertical: 10},
});
