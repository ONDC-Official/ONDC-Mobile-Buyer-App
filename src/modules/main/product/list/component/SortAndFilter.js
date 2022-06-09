import React, {useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../../../../../locales/i18n';
import {PRODUCT_SORTING} from '../../../../../utils/Constants';
import Filters from './Filters';
import SortMenu from './SortMenu';
import {cleanFormData, half, threeForth} from '../../../../../utils/utils';
import {useSelector} from 'react-redux';
import useProductList from '../../hook/useProductList';

const filter = strings('main.product.filters.filter');

/**
 * Component to show sort and filter on header of products screen
 * @param theme
 * @param setCount:function to set items count
 * @param filters:object containing filter parameters
 * @constructor
 * @returns {JSX.Element}
 */
const SortAndFilter = ({
  theme,
  setCount,
  appliedFilters,
  setAppliedFilters,
  setPageNumber,
}) => {
  const {colors} = theme;
  const [selectedSortMethod, setSelectedSortMethod] = useState(
    PRODUCT_SORTING.RATINGS_HIGH_TO_LOW,
  );
  const [providers, setProviders] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [categories, setCategories] = useState([]);
  const refRBSheet = useRef();
  const refSortSheet = useRef();
  const [apiInProgress, setApiInProgress] = useState(false);
  const {getProductsList} = useProductList();
  const {messageId, transactionId} = useSelector(
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
  const onApply = async sortMethod => {
    setApiInProgress(true);
    const filterObject = cleanFormData({
      sortMethod: sortMethod,
      range: {priceMin: min, priceMax: max},
      providers: providers,
      categories: categories,
    });
    setAppliedFilters(filterObject);
    getProductsList(setCount, messageId, transactionId, 1, filterObject)
      .then(() => {
        setApiInProgress(false);
        closeRBSheet();
        closeSortSheet();
        setPageNumber(1);
      })
      .catch(() => {
        setApiInProgress(false);
        closeRBSheet();
        closeSortSheet();
      });
    setSelectedSortMethod(sortMethod);
  };

  return (
    <>
      <Divider width={1} />
      <View
        style={[styles.sortFilterContainer, {backgroundColor: colors.white}]}>
        <TouchableOpacity onPress={openSortSheet}>
          <Text style={[styles.text, {color: colors.accentColor}]}>
            {selectedSortMethod ? selectedSortMethod : 'Sort'}
            {'   '}
            <Icon name="pencil-square" size={14} />
          </Text>
        </TouchableOpacity>
        <RBSheet
          ref={refSortSheet}
          height={half}
          customStyles={{
            container: styles.rbSheet,
          }}>
          <SortMenu
            closeSortSheet={closeSortSheet}
            apiInProgress={apiInProgress}
            setCount={setCount}
            selectedSortMethod={selectedSortMethod}
            setSelectedSortMethod={setSelectedSortMethod}
            onApply={onApply}
          />
        </RBSheet>
        <Divider orientation="vertical" width={1} />
        <TouchableOpacity onPress={openRBSheet}>
          <Text style={[styles.text, {color: colors.accentColor}]}>
            {filter}
            {filtersLength ? `(${filtersLength - 1})` : null}{' '}
            <Icon name="filter" size={14} />
          </Text>
        </TouchableOpacity>
        <RBSheet
          ref={refRBSheet}
          height={threeForth}
          customStyles={{
            container: styles.rbSheet,
          }}>
          <Filters
            closeRBSheet={closeRBSheet}
            apiInProgress={apiInProgress}
            providers={providers}
            setProviders={setProviders}
            setCategories={setCategories}
            categories={categories}
            selectedSortMethod={selectedSortMethod}
            min={min}
            setMin={setMin}
            max={max}
            setMax={setMax}
            onApply={onApply}
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
