import React, {useRef, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../../../../../locales/i18n';
import Filters from './Filters';
import SortMenu from './SortMenu';

const filter = strings('main.product.filters.filter');

/**
 * Component to show sort and filter on header of products screen
 * @param theme
 * @param setCount:function to set items count
 * @param filters:object containing filter parameters
 * @constructor
 * @returns {JSX.Element}
 */
const SortAndFilter = ({theme, filters, setCount}) => {
  const {colors} = theme;

  const [selectedSortMethod, setSelectedSortMethod] = useState(null);
  const [providers, setProviders] = useState([]);

  const [categories, setCategories] = useState([]);

  const [appliedFilters, setAppliedFilters] = useState([]);
  const refRBSheet = useRef();
  const refSortSheet = useRef();

  /**
   * function to close sort sheet
   */
  const closeSortSheet = () => refSortSheet.current.close();

  /**
   * function to open sort sheet
   */
  const openSortSheet = () => refSortSheet.current.open();

  /**
   * function to close filters sheet
   */
  const closeRBSheet = () => refRBSheet.current.close();

  /**
   * function to open filters sheet
   */
  const openRBSheet = () => {
    setAppliedFilters([]);
    refRBSheet.current.open();
  };

  return (
    <>
      <Divider width={1} />
      <View
        style={[styles.sortFilterContainer, {backgroundColor: colors.white}]}>
        <TouchableOpacity onPress={openSortSheet}>
          <Text style={[styles.text, {color: colors.accentColor}]}>
            {selectedSortMethod ? selectedSortMethod : 'Sort'}
          </Text>
        </TouchableOpacity>
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
            selectedSortMethod={selectedSortMethod}
            setSelectedSortMethod={setSelectedSortMethod}
          />
        </RBSheet>
        <Divider orientation="vertical" width={1} />
        <TouchableOpacity onPress={openRBSheet}>
          <Text style={[styles.text, {color: colors.accentColor}]}>
            {filter}
            {appliedFilters.length > 0
              ? `(${appliedFilters.length})`
              : null}{' '}
            <Icon name="filter" size={14} />
          </Text>
        </TouchableOpacity>
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
            providers={providers}
            setProviders={setProviders}
            setCategories={setCategories}
            categories={categories}
          />
        </RBSheet>
      </View>
    </>
  );
};

export default withTheme(SortAndFilter);

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
