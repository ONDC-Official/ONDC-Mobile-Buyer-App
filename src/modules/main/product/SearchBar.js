import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import Config from 'react-native-config';
import {withTheme, Text} from 'react-native-elements';
import {strings} from '../../../locales/i18n';
import {postData, getData} from '../../../utils/api';

const search = strings('main.product.search_label');

const SearchBar = ({theme, setLocation, closeSheet}) => {
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
        const locationResponse = await getData(
          `${Config.GET_LOCATION}address=${value}&itemCount=5`,
          {
            headers: {
              Authorization: 'Bearer' + ' ' + accessToken,
            },
          },
        );
        setFilteredLocations(locationResponse.data.copResults);
      } catch (error) {
        console.log(error);
      }
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
                  setLocation(item.formattedAddress);
                  closeSheet();
                }}
                style={styles.itemContainer}>
                <Text>{item.formattedAddress}</Text>
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
    top: 50,
    zIndex: 1,
  },
});
