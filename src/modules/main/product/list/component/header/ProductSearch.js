import React, {useState} from 'react';
import {Menu, MenuDivider, MenuItem} from 'react-native-material-menu';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Searchbar, Text, TextInput, withTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

import {SEARCH_QUERY} from '../../../../../../utils/Constants';

const ProductSearch = ({theme, onSearch, viewOnly = false}) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState(SEARCH_QUERY.PRODUCT);
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const onSearchTypeChange = type => {
    if (query && query.trim().length > 0) {
      onSearch(query, type);
    }
    setSearchType(type);
    hideMenu();
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
                {searchType} <Icon name="angle-down" size={14} />
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
      <Menu
        visible={visible}
        anchor={
          <TouchableOpacity
            style={[styles.menu, {backgroundColor: theme.colors.primary}]}
            activeOpacity={0.8}
            onPress={showMenu}>
            <Text style={{color: theme.colors.surface}}>
              {searchType} <Icon name="angle-down" size={14} />
            </Text>
          </TouchableOpacity>
        }>
        <MenuItem
          onPress={() => onSearchTypeChange(SEARCH_QUERY.PRODUCT)}
          pressColor={theme.colors.primary}>
          Product
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onPress={() => onSearchTypeChange(SEARCH_QUERY.PROVIDER)}
          pressColor={theme.colors.primary}>
          Provider
        </MenuItem>
      </Menu>

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
});

export default withTheme(ProductSearch);
