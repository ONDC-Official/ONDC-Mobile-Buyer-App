import React, {useRef} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';

import Filters from '../Filters';
import SortMenu from './SortMenu';
import {PRODUCT_SORTING} from '../../../../../../utils/Constants';

const sortOptions = [
  {
    name: 'Price: High To Low',
    value: PRODUCT_SORTING.PRICE_HIGH_TO_LOW,
  },
  {
    name: 'Price: Low To High',
    value: PRODUCT_SORTING.PRICE_LOW_TO_HIGH,
  },
  {
    name: 'Ratings: High To Low',
    value: PRODUCT_SORTING.RATINGS_HIGH_TO_LOW,
  },
  {
    name: 'Ratings: Low To High',
    value: PRODUCT_SORTING.RATINGS_LOW_TO_HIGH,
  },
];

const windowHeight = Dimensions.get('window').height;

const SortIcon = ({value, color}) => {
  switch (value) {
    case PRODUCT_SORTING.RATINGS_HIGH_TO_LOW:
      return (
        <>
          <Text style={[styles.text, {color: color}]}>Rating</Text>
          <Icon name="sort-amount-up-alt" size={14} color={color} />
        </>
      );

    case PRODUCT_SORTING.RATINGS_LOW_TO_HIGH:
      return (
        <>
          <Text style={[styles.text, {color: color}]}>Rating</Text>
          <Icon name="sort-amount-down" size={14} color={color} />
        </>
      );

    case PRODUCT_SORTING.PRICE_LOW_TO_HIGH:
      return (
        <>
          <Text style={[styles.text, {color: color}]}>Price</Text>
          <Icon name="sort-numeric-down" size={14} color={color} />
        </>
      );

    case PRODUCT_SORTING.PRICE_HIGH_TO_LOW:
      return (
        <>
          <Text style={[styles.text, {color: color}]}>Price</Text>
          <Icon name="sort-numeric-up-alt" size={14} color={color} />
        </>
      );

    default:
      return (
        <>
          <Text style={[styles.text, {color: color}]}>Sort</Text>
          <Icon name="sort" size={14} color={color} />
        </>
      );
  }
};

/**
 * Component to show sort and filter on header of products screen
 * @param theme
 * @param setCount:function to set items count
 * @constructor
 * @returns {JSX.Element}
 */
const SortAndFilter = ({theme}) => {
  const {colors} = theme;

  const refRBSheet = useRef();
  const refSortSheet = useRef();

  const {filters, selectedSortOption, selectedProviders, selectedCategories} =
    useSelector(({filterReducer}) => filterReducer);

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
  const openRBSheet = () => refRBSheet.current.open();

  let sheetHeight =
    (filters?.providers?.length + filters?.categories?.length) * 40 + 350;

  if (windowHeight < sheetHeight) {
    sheetHeight = windowHeight - 100;
  }

  const appliedFilters = selectedProviders.length + selectedCategories.length;
  return (
    <>
      <View
        style={[styles.sortFilterContainer, {backgroundColor: colors.surface}]}>
        <TouchableOpacity
          style={[
            {borderColor: appliedFilters > 0 ? colors.primary : colors.accent},
            styles.row,
          ]}
          onPress={openRBSheet}>
          <Text style={[styles.text, {color: colors.primary}]}>Filters</Text>
          <Icon name="filter" size={14} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {borderColor: selectedSortOption ? colors.primary : colors.accent},
            styles.row,
          ]}
          onPress={openSortSheet}>
          <SortIcon value={selectedSortOption} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <RBSheet
        ref={refSortSheet}
        height={sortOptions.length * 40 + 180}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <SortMenu sortOptions={sortOptions} closeSortSheet={closeSortSheet} />
      </RBSheet>
      <RBSheet
        ref={refRBSheet}
        height={sheetHeight}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <Filters closeRBSheet={closeRBSheet} />
      </RBSheet>
    </>
  );
};

export default withTheme(SortAndFilter);

const styles = StyleSheet.create({
  rbSheet: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
  sortFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  text: {paddingVertical: 8, fontWeight: '700', marginRight: 8},
  row: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 5,
    marginEnd: 12,
    width: 100,
  },
});
