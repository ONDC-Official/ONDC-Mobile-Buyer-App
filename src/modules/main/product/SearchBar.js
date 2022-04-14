import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import Config from 'react-native-config';
import {withTheme, Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';
import {postData, getData} from '../../../utils/api';
import {BASE_URL, GET_LATLONG, GET_LOCATION} from '../../../utils/apiUtilities';

const search = strings('main.product.search_label');

const SearchBar = ({
  theme,
  setLocation,
  closeSheet,
  setLatitude,
  setLongitude,
}) => {
  const {colors} = theme;
  const [filteredLocations, setFilteredLocations] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const getToken = async () => {
    try {
      const {data} = await postData(Config.GET_TOKEN, {});
      setAccessToken(data.access_token);
    } catch (error) {
      console.log(error);
    }
  };

  const findLocation = async value => {
    if (value.length > 3) {
      try {
        const {data} = await getData(`${BASE_URL}${GET_LOCATION}${value}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFilteredLocations(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getLatLong = async eLoc => {
    try {
      const {data} = await getData(`${BASE_URL}${GET_LATLONG}${eLoc}`);
      setLatitude(data.latitude);
      setLongitude(data.longitude);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

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
                  getLatLong(item.eLoc)
                    .then(() => {})
                    .catch(() => {});

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
