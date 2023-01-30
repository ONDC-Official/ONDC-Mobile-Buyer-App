import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, {memo, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Divider, Text, withTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import ClearButton from '../../../../../components/button/ClearButton';
import {appStyles} from '../../../../../styles/styles';
import {
  clearFiltersOnly,
  updateFilters,
} from '../../../../../redux/filter/actions';
import OutlineButton from '../../../../../components/button/OutlineButton';

/**
 * Component to render filters screen
 * @param setCount:function to set items count
 * @constructor
 * @returns {JSX.Element}
 */
const Filters = ({closeRBSheet, apiInProgress, theme, updateFilterCount}) => {
  const dispatch = useDispatch();
  const {colors} = theme;

  const {filters, selectedProviders, selectedCategories, maxPrice, minPrice} =
    useSelector(({filterReducer}) => filterReducer);

  const [providers, setProviders] = useState(selectedProviders);
  const [categories, setCategories] = useState(selectedCategories);
  const [rangeMax, setRangeMax] = useState(maxPrice);
  const [rangeMin, setRangeMin] = useState(minPrice);

  const applyFilters = () => {
    const payload = {
      selectedProviders: providers,
      selectedCategories: categories,
      maxPrice: rangeMax,
      minPrice: rangeMin,
    };

    dispatch(updateFilters(payload));
    updateFilterCount();
    closeRBSheet();
  };

  const clearFilter = () => {
    dispatch(clearFiltersOnly());
    updateFilterCount();
    closeRBSheet();
  };

  /**
   * function handles click event of checkbox in providers list
   * @param item: selected provider
   * @param index:index of  selected provider
   */
  const onProviderUpdated = (item, index) => {
    let providerList = providers.slice();
    if (index > -1) {
      providerList.splice(index, 1);
    } else {
      providerList.push(item.id);
    }
    setProviders(providerList);
  };

  /**
   * function handles click event of checkbox in category list
   * @param item: selected category
   * @param index:index of  selected category
   */
  const onCategoryUpdated = (item, index) => {
    let categoryList = categories.slice();
    if (index > -1) {
      categoryList.splice(index, 1);
    } else {
      categoryList.push(item.id);
    }
    setCategories(categoryList);
  };

  /**
   * function handles change event of slider
   * @param val: selected range
   */
  const handleValueChange = val => {
    setRangeMax(val[1]);
    setRangeMin(val[0]);
  };

  return (
    <View style={appStyles.container}>
      <View style={styles.header}>
        <ClearButton
          title={'Close'}
          onPress={closeRBSheet}
          textColor={colors.primary}
        />
      </View>
      <Divider />

      {filters.providers.length > 0 ||
      filters.categories.length > 0 ||
      filters.minPrice ||
      filters.maxPrice ? (
        <View style={appStyles.container}>
          <ScrollView>
            {filters?.providers?.length > 0 && (
              <>
                <Text style={styles.text}>Providers</Text>

                {filters?.providers?.map(item => {
                  const index = providers.findIndex(one => one === item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.button,
                        index > -1 ? styles.buttonActive : styles.normal,
                      ]}
                      onPress={() => onProviderUpdated(item, index)}>
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            {filters?.categories?.length > 0 && (
              <>
                <Text style={styles.text}>Categories</Text>
                {filters?.categories?.map(item => {
                  const index = categories.findIndex(one => one === item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.button,
                        index > -1 ? styles.buttonActive : styles.normal,
                      ]}
                      onPress={() => onCategoryUpdated(item, index)}>
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
            <View style={styles.container}>
              {filters.hasOwnProperty('minPrice') &&
                filters.hasOwnProperty('maxPrice') &&
                filters.minPrice !== filters.maxPrice && (
                  <>
                    <Text style={styles.price}>Price Range</Text>

                    <MultiSlider
                      selectedStyle={{
                        backgroundColor: colors.primary,
                      }}
                      containerStyle={styles.sliderContainer}
                      markerStyle={[
                        styles.markerStyle,
                        {backgroundColor: colors.primary},
                      ]}
                      trackStyle={styles.trackStyle}
                      values={[rangeMin, rangeMax]}
                      sliderLength={Dimensions.get('window').width - 60}
                      onValuesChange={handleValueChange}
                      min={Math.floor(filters.minPrice)}
                      max={Math.ceil(filters.maxPrice)}
                      step={Math.round(
                        (filters.maxPrice - filters.minPrice) / 100,
                      )}
                    />
                    <View style={styles.sliderText}>
                      <Text>{rangeMin}</Text>
                      <Text>{rangeMax}</Text>
                    </View>
                  </>
                )}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <OutlineButton
              onPress={clearFilter}
              disabled={apiInProgress}
              label="Clear"
            />
            <Button
              mode="contained"
              loading={apiInProgress}
              disabled={apiInProgress}
              onPress={applyFilters}>
              Apply
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text>No filters available</Text>
        </View>
      )}
    </View>
  );
};

export default memo(withTheme(Filters));

const styles = StyleSheet.create({
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {fontSize: 18, fontWeight: '700', marginVertical: 8, marginLeft: 10},
  container: {padding: 10},
  emptyContainer: {alignItems: 'center', justifyContent: 'center'},
  price: {fontSize: 18, fontWeight: '700', marginVertical: 8},
  sliderText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 16,
  },
  sliderContainer: {marginHorizontal: 24, alignSelf: 'center'},
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  trackStyle: {height: 5, borderRadius: 4},
  containerStyle: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  markerStyle: {height: 21, width: 21},
  button: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 8,
  },
  buttonActive: {
    backgroundColor: '#C3E1F6FF',
  },
  normal: {
    backgroundColor: 'white',
  },
});
