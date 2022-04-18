import React, {useContext, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {withTheme, Text} from 'react-native-elements';
import {Context as AuthContext} from '../../../context/Auth';
import useNetworkErrorHandling from '../../../hooks/useNetworkErrorHandling';
import {strings} from '../../../locales/i18n';
import {getData} from '../../../utils/api';
import {BASE_URL, GET_LOCATION} from '../../../utils/apiUtilities';

const search = strings('main.product.search_label');

/**
 * Component to show searchbar to select location in addresspicker
 * @param closeSheet:function which close the rb sheet
 * @param setLocation:function to set location selected by user
 * @param setEloc:function set eloc of selected location
 * @constructor
 * @returns {JSX.Element}
 */
const SearchBar = ({theme, setLocation, closeSheet, setEloc}) => {
  const {colors} = theme;
  const [filteredLocations, setFilteredLocations] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);

  const {handleApiError} = useNetworkErrorHandling();
  const {
    state: {token},
  } = useContext(AuthContext);

  /**
   * Function is used to get list of location
   * @returns {Promise<void>}
   **/
  const findLocation = async value => {
    if (value.length > 3) {
      try {
        const {data} = await getData(`${BASE_URL}${GET_LOCATION}${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFilteredLocations(data);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Autocomplete
        data={filteredLocations ? filteredLocations : []}
        icon="camera"
        containerStyle={{borderColor: colors.primary}}
        inputContainerStyle={{borderColor: colors.primary}}
        flatListProps={{
          keyboardShouldPersistTaps: 'always',
          style: {margin: 5, borderColor: colors.primary},
          keyExtractor: (_, id) => id,
          renderItem: ({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setFilteredLocations(null);
                  setEloc(item.eLoc);
                  setLocation(`${item.placeName} ${item.placeAddress}`);
                  closeSheet();
                }}
                style={styles.itemContainer}>
                <Text>
                  {item.placeName} {item.placeAddress}
                </Text>
              </TouchableOpacity>
            );
          },
        }}
        value={selectedValue}
        onChangeText={value => {
          findLocation(value)
            .then(() => {})
            .catch(() => {});
          setSelectedValue(value);
        }}
        placeholder={search}
      />
    </View>
  );
};

export default withTheme(SearchBar);

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
  },
  container: {
    padding: 10,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 80,
    zIndex: 1,
  },
});
