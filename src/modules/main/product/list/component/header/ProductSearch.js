import React, {useEffect, useState} from 'react';
import {Menu} from 'react-native-material-menu';
import {Pressable, StyleSheet, View} from 'react-native';
import {Text, TextInput, withTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

import {SEARCH_QUERY} from '../../../../../../utils/constants';
import SearchTypeMenu from '../../../../../../components/headerMenu/SearchTypeMenu';

const ProductSearch = ({theme, onSearch, viewOnly = false, address}) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState(SEARCH_QUERY.PRODUCT);

  useEffect(() => {
    address && setQuery('');
  }, [address]);

  const onSearchTypeChange = type => {
    if (query && query.trim().length > 0) {
      onSearch(query, type);
    }
    setSearchType(type);
  };

  if (viewOnly) {
    return (
      <Pressable
        style={styles.container}
        onPress={() => {
          navigation.navigate('SearchProductList');
        }}>
        <Menu
          anchor={
            <View
              style={[styles.menu, {backgroundColor: theme.colors.primary}]}
              activeOpacity={0.8}>
              <Text style={{color: theme.colors.surface}}>
                {searchType} <Icon name="angle-down" size={14}/>
              </Text>
            </View>
          }
        />
        <View style={styles.searchContainer}>
          <TextInput
            editable={false}
            mode="outlined"
            round={false}
            lightTheme
            placeholder={`Search ${searchType}`}
            style={styles.search}
            outlineStyle={styles.inputContainerStyle}
            onSubmitEditing={() => {
              if (query && query.trim().length > 0) {
                onSearch(query, searchType);
              }
            }}
            inputStyle={styles.inputStyle}
            onChangeText={setQuery}
            value={query}
          />
        </View>
      </Pressable>
    );
  }
  return (
    <View style={styles.container}>
      <SearchTypeMenu
        searchType={searchType}
        onProductSelect={() => onSearchTypeChange(SEARCH_QUERY.PRODUCT)}
        onProviderSelect={() => onSearchTypeChange(SEARCH_QUERY.PROVIDER)}
      />

      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          round={false}
          lightTheme
          placeholder={`Search ${searchType}`}
          style={styles.search}
          outlineStyle={styles.inputContainerStyle}
          onSubmitEditing={() => {
            if (query && query.trim().length > 0) {
              onSearch(query, searchType);
            }
          }}
          inputStyle={styles.inputStyle}
          onChangeText={setQuery}
          value={query}
          autoFocus={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  searchContainer: {
    flexGrow: 1,
  },
  search: {backgroundColor: 'white', marginTop: -5, marginStart: -2},
  inputContainerStyle: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  inputStyle: {
    paddingLeft: 12,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  menuOption: {
    padding: 16,
    width: 100,
  },
});

export default withTheme(ProductSearch);
