import React, {useState} from 'react';
import {Menu, MenuDivider, MenuItem} from 'react-native-material-menu';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SearchBar, Text, useTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {SEARCH_QUERY} from '../../../../../../utils/Constants';
import {appStyles} from '../../../../../../styles/styles';
import useProductList from '../../../hook/useProductList';
import SortAndFilter from './SortAndFilter';

const ProductSearch = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {products} = useSelector(({productReducer}) => productReducer);
  const {filters} = useSelector(({filterReducer}) => filterReducer);

  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState(SEARCH_QUERY.PRODUCT);
  const [visible, setVisible] = useState(false);

  const {onSearch, getProductsList} = useProductList();

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const onSearchTypeChange = card => {
    setSearchType(card);
    hideMenu();
  };

  return (
    <>
      <View style={styles.container}>
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity
              style={[styles.menu, {backgroundColor: theme.colors.accentColor}]}
              activeOpacity={0.8}
              onPress={showMenu}>
              <Text style={{color: theme.colors.white}}>
                {searchType} <Icon name="angle-down" size={14} />
              </Text>
            </TouchableOpacity>
          }>
          <MenuItem
            onPress={() => onSearchTypeChange(SEARCH_QUERY.PRODUCT)}
            pressColor={theme.colors.accentColor}>
            {t('main.product.product_label')}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onPress={() => onSearchTypeChange(SEARCH_QUERY.PROVIDER)}
            pressColor={theme.colors.accentColor}>
            {t('main.product.provider_label')}
          </MenuItem>
          <MenuDivider />

          <MenuItem
            onPress={() => onSearchTypeChange(SEARCH_QUERY.CATEGORY)}
            pressColor={theme.colors.accentColor}>
            {t('main.product.category_label')}
          </MenuItem>
          <MenuDivider />
        </Menu>

        <SearchBar
          round={false}
          lightTheme
          placeholder={t('main.product.search_label', {type: searchType})}
          containerStyle={[appStyles.container, styles.containerStyle]}
          inputStyle={styles.inputStyle}
          inputContainerStyle={[
            styles.inputContainerStyle,
            {
              backgroundColor: theme.colors.white,
            },
          ]}
          loadingProps={{color: theme.colors.accentColor}}
          onSubmitEditing={() => {
            if (query && query.trim().length > 0) {
              onSearch(query, searchType);
            }
          }}
          onChangeText={setQuery}
          value={query}
          clearIcon={null}
          closeIcon={null}
        />
      </View>
      {filters && products.length > 0 && (
        <SortAndFilter getProductsList={getProductsList} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  inputContainerStyle: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    zIndex: -1,
  },
  inputStyle: {fontSize: 16},
  menu: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});

export default ProductSearch;
