import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider, SearchBar, Text, withTheme} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../../../../../locales/i18n';
import {appStyles} from '../../../../../styles/styles';
import {SEARCH_QUERY} from '../../../../../utils/Constants';
import Filters from './Filters';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import SortMenu from './SortMenu';

const search = strings('main.product.search_label');
const product = strings('main.product.product_label');
const provider = strings('main.product.provider_label');
const category = strings('main.product.category_label');
const filter = strings('main.product.filters.filter');
const detectLocation = strings('main.product.detecting_location');

/**
 * Component to header on products screen
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
  apiInProgress,
  onSearch,
  locationInProgress,
  location,
  filters,
  setCount,
}) => {
  const {colors} = theme;

  const [item, setItem] = useState(null);
  const [selectedCard, setSelectedCard] = useState(SEARCH_QUERY.PRODUCT);
  const [visible, setVisible] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState([]);
  const refRBSheet = useRef();
  const refSortSheet = useRef();

  const closeSortSheet = () => refSortSheet.current.close();

  const openSortSheet = () => refSortSheet.current.open();

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const closeRBSheet = () => refRBSheet.current.close();

  const openRBSheet = () => {
    setAppliedFilters([]);
    refRBSheet.current.open();
  };

  const onCardSelect = card => setSelectedCard(card);

  return (
    <>
      <View style={[styles.container, {backgroundColor: colors.white}]}>
        <View
          style={[styles.locationContainer, {backgroundColor: colors.white}]}>
          {locationInProgress ? (
            <View style={styles.subContainer}>
              <Text>
                {detectLocation} {'    '}
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
                <Text style={{color: colors.accentColor}}>
                  {location} <Icon name="angle-down" size={14} />
                </Text>
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
              {product}
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onPress={() => {
                onCardSelect(SEARCH_QUERY.PROVIDER);
                hideMenu();
              }}
              pressColor={colors.accentColor}>
              {provider}
            </MenuItem>
            <MenuDivider />

            <MenuItem
              onPress={() => {
                onCardSelect(SEARCH_QUERY.CATEGORY);
                hideMenu();
              }}
              pressColor={colors.accentColor}>
              {category}
            </MenuItem>
            <MenuDivider />
          </Menu>

          <SearchBar
            round={false}
            lightTheme={true}
            placeholder={`${search} ${selectedCard}`}
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
                setAppliedFilters([]);
                onSearch(item, selectedCard, closeRBSheet);
              }
            }}
            onChangeText={setItem}
            value={item}
          />
        </View>
      </View>
      {filters && (
        <>
          <Divider width={1} />
          <View
            style={[
              styles.sortFilterContainer,
              {backgroundColor: colors.white},
            ]}>
            <Text
              style={[styles.text, {color: colors.accentColor}]}
              onPress={openSortSheet}>
              Sort
            </Text>
            <RBSheet
              ref={refSortSheet}
              height={Dimensions.get('window').height / 2}
              customStyles={{
                container: styles.rbSheet,
              }}>
              <SortMenu
                closeSortSheet={closeSortSheet}
                filters={filters}
                setCount={setCount}
              />
            </RBSheet>
            <Divider orientation="vertical" width={1} />
            <Text
              style={[styles.text, {color: colors.accentColor}]}
              onPress={openRBSheet}>
              {filter}
              {appliedFilters.length > 0
                ? `(${appliedFilters.length})`
                : null}{' '}
              <Icon name="filter" size={14} />
            </Text>
            <RBSheet
              ref={refRBSheet}
              height={Dimensions.get('window').height - 200}
              customStyles={{
                container: styles.rbSheet,
              }}>
              <Filters
                closeRBSheet={closeRBSheet}
                filters={filters}
                setCount={setCount}
                setAppliedFilters={setAppliedFilters}
                appliedFilters={appliedFilters}
              />
            </RBSheet>
          </View>
        </>
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
  textContainer: {marginLeft: 8, flexShrink: 1},
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
