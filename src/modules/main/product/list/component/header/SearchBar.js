import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {Text, withTheme} from 'react-native-elements';
import {Context as AuthContext} from '../../../../../../context/Auth';
import useNetworkErrorHandling from '../../../../../../hooks/useNetworkErrorHandling';
import {getData} from '../../../../../../utils/api';
import {BASE_URL, GET_LOCATION} from '../../../../../../utils/apiUtilities';

/**
 * Component to show searchbar to select location in addresspicker
 * @param theme
 * @param closeSheet:function which close the rb sheet
 * @param setLocation:function to set location selected by user
 * @param setEloc:function set eloc of selected location
 * @constructor
 * @returns {JSX.Element}
 */
const SearchBar = ({theme, setLocation, closeSheet, setEloc}) => {
  const {colors} = theme;

  const {t} = useTranslation();

  const [filteredLocations, setFilteredLocations] = useState(null);

  const [selectedValue, setSelectedValue] = useState(null);

  const {handleApiError} = useNetworkErrorHandling();

  const {
    state: {token},
  } = useContext(AuthContext);

  /**
   * Function is used to get list of location
   * @param value:location entered by user
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
    <View style={[styles.container, {borderColor: colors.accentColor}]}>
      <Autocomplete
        data={filteredLocations ? filteredLocations : []}
        icon="camera"
        inputContainerStyle={styles.inputContainerStyle}
        flatListProps={{
          keyboardShouldPersistTaps: 'always',
          style: {
            margin: 5,
            borderColor: colors.accentColor,
            maxHeight: 350,
          },
          keyExtractor: (_, id) => id,

          renderItem: ({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setFilteredLocations(null);
                  setEloc(item.eLoc);
                  setLocation(`${item.placeName}`);
                  closeSheet();
                }}
                style={styles.itemContainer}>
                <Text style={styles.placeName}>{item.placeName}</Text>
                {item.alternateName !== '' && (
                  <Text style={[styles.alternateName, {color: colors.primary}]}>
                    {item.alternateName}
                  </Text>
                )}
              </TouchableOpacity>
            );
          },
        }}
        value={selectedValue}
        scrollEnabled
        onChangeText={value => {
          findLocation(value)
            .then(() => {})
            .catch(() => {});
          setSelectedValue(value);
        }}
        placeholder={t('main.product.search_label')}
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 80,
    zIndex: 1,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'red',
    marginHorizontal: 10,
  },
  inputContainerStyle: {borderWidth: 0},
  placeName: {fontSize: 16},
  alternateName: {fontSize: 12},
});
