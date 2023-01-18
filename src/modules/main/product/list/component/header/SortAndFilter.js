import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';

import Filters from '../Filters';
import SortMenu from './SortMenu';
import {PRODUCT_SORTING} from '../../../../../../utils/Constants';

const sortOptions = [
  {
    name: 'main.product.filters.price_high_to_low',
    value: PRODUCT_SORTING.PRICE_HIGH_TO_LOW,
  },
  {
    name: 'main.product.filters.price_low_to_high',
    value: PRODUCT_SORTING.PRICE_LOW_TO_HIGH,
  },
  {
    name: 'main.product.filters.ratings_high_to_low',
    value: PRODUCT_SORTING.RATINGS_HIGH_TO_LOW,
  },
  {
    name: 'main.product.filters.ratings_low_to_high',
    value: PRODUCT_SORTING.RATINGS_LOW_TO_HIGH,
  },
];

const windowHeight = Dimensions.get('window').height;

/**
 * Component to show sort and filter on header of products screen
 * @param theme
 * @param setCount:function to set items count
 * @param filters:object containing filter parameters
 * @constructor
 * @returns {JSX.Element}
 */
const SortAndFilter = ({theme, setCount, appliedFilters, getProductsList}) => {
  const {colors} = theme;
  const {t} = useTranslation();

  const [apiInProgress, setApiInProgress] = useState(false);

  const refRBSheet = useRef();
  const refSortSheet = useRef();

  const {messageId, transactionId, filters, selectedSortOption} = useSelector(
    ({filterReducer}) => filterReducer,
  );

  const filtersLength = appliedFilters
    ? Object.keys(appliedFilters).length
    : null;

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

  /**
   * function handles click event of apply button
   * it request list of products with selected filter params
   * @returns {Promise<void>}
   */
  const onApply = async () => {
    setApiInProgress(true);
    getProductsList(messageId, transactionId)
      .then(() => {
        setApiInProgress(false);
        closeRBSheet();
        closeSortSheet();
      })
      .catch(() => {
        setApiInProgress(false);
        closeRBSheet();
        closeSortSheet();
      });
  };

  let sheetHeight =
    (filters.providers.length + filters.categories.length) * 40 + 350;

  if (windowHeight < sheetHeight) {
    sheetHeight = windowHeight - 100;
  }

  return (
    <>
      <Divider width={1} />
      <View
        style={[styles.sortFilterContainer, {backgroundColor: colors.white}]}>
        <TouchableOpacity onPress={openSortSheet}>
          <View style={styles.row}>
            <Text style={[styles.text, {color: colors.accentColor}]}>
              {selectedSortOption
                ? selectedSortOption
                : t('main.product.sort_products_label')}
            </Text>
            <Icon name="sort" size={14} color={colors.accentColor} />
          </View>
        </TouchableOpacity>
        <Divider orientation="vertical" width={1} />
        <TouchableOpacity onPress={openRBSheet}>
          <View style={styles.row}>
            <Text style={[styles.text, {color: colors.accentColor}]}>
              {t('main.product.filters.filter')}
              {filtersLength && filtersLength > 1
                ? `(${filtersLength - 1})`
                : null}
            </Text>
            <Icon name="filter" size={14} color={colors.accentColor} />
          </View>
        </TouchableOpacity>
      </View>

      <RBSheet
        ref={refSortSheet}
        height={sortOptions.length * 40 + 180}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <SortMenu
          sortOptions={sortOptions}
          closeSortSheet={closeSortSheet}
          apiInProgress={apiInProgress}
          setCount={setCount}
        />
      </RBSheet>
      <RBSheet
        ref={refRBSheet}
        height={sheetHeight}
        customStyles={{
          container: styles.rbSheet,
        }}>
        <Filters
          closeRBSheet={closeRBSheet}
          apiInProgress={apiInProgress}
        />
      </RBSheet>
    </>
  );
};

export default withTheme(SortAndFilter);

const styles = StyleSheet.create({
  rbSheet: {borderTopLeftRadius: 15, borderTopRightRadius: 15},
  sortFilterContainer: {flexDirection: 'row', justifyContent: 'space-evenly'},
  text: {paddingVertical: 8, fontWeight: '700', marginRight: 8},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
