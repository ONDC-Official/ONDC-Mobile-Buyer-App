import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SearchBar, Text, withTheme} from 'react-native-elements';
import {Menu, MenuDivider, MenuItem} from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {appStyles} from '../../../../../styles/styles';
import {SEARCH_QUERY} from '../../../../../utils/Constants';
import SortAndFilter from './SortAndFilter';

/**
 * Component to render header on products screen
 * @param theme
 * @param openSheet: function to open rb sheet when user wants to select location
 * @param apiInProgress
 * @param locationInProgress
 * @param location:location of user or location selected by user
 * @param onSearch:function handles onEndEditing event of searchbar
 * @param filters
 * @constructor
 * @returns {JSX.Element}
 */
const Header = ({
  theme,
  openSheet,
  onSearch,
  apiInProgress,
  locationInProgress,
  location,
  setCount,
  appliedFilters,
  setAppliedFilters,
  latLongInProgress,
}) => {
  const {colors} = theme;

  const {t} = useTranslation();

  const [item, setItem] = useState(null);

  const [selectedCard, setSelectedCard] = useState(SEARCH_QUERY.PRODUCT);

  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const onCardSelect = card => setSelectedCard(card);

  const {filters} = useSelector(({filterReducer}) => filterReducer);

  const {products} = useSelector(({productReducer}) => productReducer);

  return (
    <>
      <View style={[styles.container, {backgroundColor: colors.white}]}>
        <View
          style={[styles.locationContainer, {backgroundColor: colors.white}]}>
          {locationInProgress ? (
            <View style={styles.subContainer}>
              <Text>
                {t('main.product.detecting_location')} {'    '}
              </Text>
              <ActivityIndicator
                showLoading={locationInProgress}
                color={colors.accentColor}
                size={14}
              />
            </View>
          ) : (
            <TouchableOpacity style={styles.subContainer} onPress={openSheet}>
              <Icon name="map-marker" size={20} color={colors.accentColor} />
              <View style={styles.textContainer}>
                <Text style={{color: colors.accentColor}}>{location} </Text>
                {latLongInProgress ? (
                  <ActivityIndicator
                    showLoading={latLongInProgress}
                    color={colors.accentColor}
                    size={12}
                  />
                ) : (
                  <Icon
                    name="angle-down"
                    color={colors.accentColor}
                    size={14}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.subContainer}>
          <Menu
            visible={visible}
            anchor={
              <TouchableOpacity
                style={[styles.menu, {backgroundColor: colors.accentColor}]}
                activeOpacity={0.8}
                onPress={showMenu}>
                <Text style={{color: colors.white}}>
                  {selectedCard} <Icon name="angle-down" size={14} />
                </Text>
              </TouchableOpacity>
            }>
            <MenuItem
              onPress={() => {
                onCardSelect(SEARCH_QUERY.PRODUCT);
                hideMenu();
              }}
              pressColor={colors.accentColor}>
              {t('main.product.product_label')}
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onPress={() => {
                onCardSelect(SEARCH_QUERY.PROVIDER);
                hideMenu();
              }}
              pressColor={colors.accentColor}>
              {t('main.product.provider_label')}
            </MenuItem>
            <MenuDivider />

            <MenuItem
              onPress={() => {
                onCardSelect(SEARCH_QUERY.CATEGORY);
                hideMenu();
              }}
              pressColor={colors.accentColor}>
              {t('main.product.category_label')}
            </MenuItem>
            <MenuDivider />
          </Menu>

          <SearchBar
            round={false}
            lightTheme={true}
            placeholder={`${t('main.product.search_label')} ${selectedCard}`}
            containerStyle={[appStyles.container, styles.containerStyle]}
            showLoading={apiInProgress}
            inputStyle={styles.inputStyle}
            inputContainerStyle={[
              styles.inputContainerStyle,
              {
                backgroundColor: colors.white,
              },
            ]}
            loadingProps={{color: colors.accentColor}}
            cancelIcon={false}
            onSubmitEditing={() => {
              if (item !== null && item.trim().length > 2) {
                onSearch(item, selectedCard);
              }
            }}
            editable={!latLongInProgress}
            onChangeText={setItem}
            value={item}
          />
        </View>
      </View>
      {filters && products.length > 0 && (
        <SortAndFilter
          setCount={setCount}
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
        />
      )}
    </>
  );
};

export default withTheme(Header);

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  subContainer: {flexDirection: 'row', alignItems: 'center'},
  locationContainer: {paddingBottom: 10},
  textContainer: {
    marginLeft: 8,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  filter: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 5,
  },
  rbSheet: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
  inputStyle: {fontSize: 16},
  menu: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  sortFilterContainer: {flexDirection: 'row', justifyContent: 'space-evenly'},
  text: {paddingVertical: 8, fontWeight: '700'},
});
