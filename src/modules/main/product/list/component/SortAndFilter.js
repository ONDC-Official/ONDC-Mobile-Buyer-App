import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BASE_URL, GET_PRODUCTS} from '../../../../../utils/apiUtilities';
import {strings} from '../../../../../locales/i18n';
import {PRODUCT_SORTING} from '../../../../../utils/Constants';
import Filters from './Filters';
import SortMenu from './SortMenu';
import {cleanFormData, half, threeForth} from '../../../../../utils/utils';
import {getData} from '../../../../../utils/api';
import {Context as AuthContext} from '../../../../../context/Auth';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {useDispatch} from 'react-redux';
import {saveProducts} from '../../../../../redux/product/actions';

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
  const [selectedSortMethod, setSelectedSortMethod] = useState(
    PRODUCT_SORTING.RATINGS_HIGH_TO_LOW,
  );
  const [providers, setProviders] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [categories, setCategories] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const refRBSheet = useRef();
  const refSortSheet = useRef();
  const dispatch = useDispatch();
  const {
    state: {token},
  } = useContext(AuthContext);

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {handleApiError} = useNetworkErrorHandling();
  const filtersLength = Object.keys(appliedFilters).length;

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
    console.log(sortMethod);
    let sortField = 'price';
    let sortOrder = 'desc';

    switch (sortMethod) {
      case PRODUCT_SORTING.RATINGS_HIGH_TO_LOW:
        sortOrder = 'desc';
        sortField = 'rating';
        break;

      case PRODUCT_SORTING.RATINGS_LOW_TO_HIGH:
        sortOrder = 'asc';
        sortField = 'rating';
        break;

      case PRODUCT_SORTING.PRICE_LOW_TO_HIGH:
        sortOrder = 'asc';
        sortField = 'price';
        break;
    }
    const filterData = cleanFormData({
      priceMin: filters.minPrice ? min : null,
      priceMax: filters.maxPrice ? max : null,
    });
    appliedFilters.range = {priceMin: min, priceMax: max};

    let params;

    let filterParams = [];
    Object.keys(filterData).forEach(key =>
      filterParams.push(`&${key}=${filterData[key]}`),
    );
    params = filterParams.toString().replace(/,/g, '');

    if (providers && providers.length > 0) {
      params = params + `&providerIds=${providers.toString()}`;
      appliedFilters.providers = providers;
    } else {
      delete appliedFilters.providers;
    }

    if (categories && categories.length > 0) {
      params = params + `&categoryIds=${categories.toString()}`;
      appliedFilters.categories = categories;
    } else {
      delete appliedFilters.categories;
    }

    const url = `${BASE_URL}${GET_PRODUCTS}${filters.message_id}${params}&sortField=${sortField}&sortOrder=${sortOrder}`;
    try {
      const {data} = await getData(`${url}`, options);
      setCount(data.message.count);
      const productsList = data.message.catalogs.map(item => {
        return Object.assign({}, item, {
          quantity: 0,
          transaction_id: filters.transaction_id,
        });
      });

      dispatch(saveProducts(productsList));
    } catch (e) {
      handleApiError(e);
    }
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
            filters={filters}
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
            {filtersLength > 0 ? `(${filtersLength})` : null}{' '}
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
            filters={filters}
            setCount={setCount}
            setAppliedFilters={setAppliedFilters}
            appliedFilters={appliedFilters}
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
