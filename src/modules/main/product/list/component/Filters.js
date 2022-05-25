import React, {useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {CheckBox, Divider, Text, withTheme} from 'react-native-elements';
import RangeSlider from 'rn-range-slider';
import {appStyles} from '../../../../../styles/styles';
import {PRODUCT_SORTING} from '../../../../../utils/Constants';
import {cleanFormData} from '../../../../../utils/utils';
import useProductList from '../../hooks/useProductList';
import FilterCard from './SortOptionSelector';

//TODO: i18n is missing again.

const Filters = ({theme, filters, closeRBSheet}) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [providers, setProviders] = useState([]);

  const [selectedSortingOption, setSelectedSortingOption] = useState(
    PRODUCT_SORTING.RATINGS_LOW_TO_HIGH,
  );
  const [categories, setCategories] = useState([]);
  const {getProducts, requestInProgress, setRequestInProgress} =
    useProductList();

  const onApply = () => {
    setRequestInProgress(true);
    let sortField = 'desc';
    let sortOrder = 'price';

    switch (selectedSortingOption) {
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
    console.log(providers.toString());

    const filterData = cleanFormData({
      providerIds: providers.toString(),
      sortField: sortField,
      sortOrder: sortOrder,
      categoryIds: categories.toString(),
      priceMin: min,
      priceMax: max,
    });

    // getProducts(
    //   filters.message_id,
    //   filters.transaction_id,
    //   closeRBSheet,
    //   filterData,
    // );
  };

  const onProviderCheckBoxPress = (item, index) => {
    let providerlist = providers.slice();
    if (index > -1) {
      providerlist.splice(index, 1);
    } else {
      providerlist.push(item.id);
    }
    setProviders(providerlist);
  };
  const onCategoryCheckBoxPress = (item, index) => {
    let categorylist = categories.slice();
    if (index > -1) {
      categorylist.splice(index, 1);
    } else {
      categorylist.push(item.id);
    }
    setCategories(categorylist);
  };

  const {colors} = theme;
  return (
    <ScrollView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.applyButton} onPress={onApply}>
            <Text style={[styles.text, {color: colors.accentColor}]}>
              APPLY{'  '}
            </Text>
            {requestInProgress && (
              <ActivityIndicator
                show={requestInProgress}
                color={colors.accentColor}
                size={14}
                style={styles.activityIndicator}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={closeRBSheet}>
            <Text style={[styles.text, {color: colors.accentColor}]}>
              CLOSE
            </Text>
          </TouchableOpacity>
        </View>
        <Divider />

        {filters ? (
          <View style={styles.container}>
            {filters.providers && filters.providers.length > 0 && (
              <>
                <Text style={[styles.text]}>Providers</Text>

                {filters.providers.map(item => {
                  const index = providers.findIndex(one => one === item.id);
                  return (
                    <CheckBox
                      key={item.id}
                      title={item.name}
                      checked={index > -1}
                      onPress={() => onProviderCheckBoxPress(item, index)}
                    />
                  );
                })}
              </>
            )}
            {filters.categories && filters.categories.length > 0 && (
              <>
                <Text style={[styles.text]}>Categories</Text>
                {filters.categories.map(item => {
                  const index = categories.findIndex(one => one === item.id);
                  return (
                    <CheckBox
                      key={item.id}
                      title={item.name}
                      checked={index > -1}
                      onPress={() => onCategoryCheckBoxPress(item, index)}
                    />
                  );
                })}
              </>
            )}

            <Text style={styles.price}>Price Range</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.amount}>
                ₹{min} - ₹{max}
              </Text>
              <RangeSlider
                style={[styles.rangSlider]}
                gravity={'center'}
                min={filters.minPrice}
                max={filters.maxPrice}
                step={20}
                floatingLabel={true}
                onValueChanged={(low, high, fromUser) => {
                  setMin(low);
                  setMax(high);
                }}
                renderThumb={value => {
                  return (
                    <View
                      style={[
                        styles.thumb,
                        {
                          borderColor: colors.accentColor,
                          backgroundColor: colors.white,
                        },
                      ]}
                    />
                  );
                }}
                renderRail={() => {
                  return (
                    <View
                      style={[
                        appStyles.container,
                        styles.rail,
                        {
                          backgroundColor: colors.black,
                        },
                      ]}
                    />
                  );
                }}
                renderNotch={value => {}}
                renderLabel={value => {}}
                renderRailSelected={value => {
                  return (
                    <View
                      style={[
                        styles.railSelected,
                        {backgroundColor: colors.accentColor},
                      ]}
                    />
                  );
                }}
              />
            </View>
            <Text style={styles.price}>Sorting</Text>
            <View style={styles.sortContainer}>
              <FilterCard
                name={PRODUCT_SORTING.RATINGS_HIGH_TO_LOW}
                onPress={() => {
                  setSelectedSortingOption(PRODUCT_SORTING.RATINGS_HIGH_TO_LOW);
                }}
                selectedFilter={selectedSortingOption}
                card={PRODUCT_SORTING.RATINGS_HIGH_TO_LOW}
              />
              <FilterCard
                name={PRODUCT_SORTING.RATINGS_LOW_TO_HIGH}
                onPress={() => {
                  setSelectedSortingOption(PRODUCT_SORTING.RATINGS_LOW_TO_HIGH);
                }}
                selectedFilter={selectedSortingOption}
                card={PRODUCT_SORTING.RATINGS_LOW_TO_HIGH}
              />
              <FilterCard
                name={PRODUCT_SORTING.PRICE_HIGH_TO_LOW}
                onPress={() => {
                  setSelectedSortingOption(PRODUCT_SORTING.PRICE_HIGH_TO_LOW);
                }}
                selectedFilter={selectedSortingOption}
                card={PRODUCT_SORTING.PRICE_HIGH_TO_LOW}
              />
              <FilterCard
                name={PRODUCT_SORTING.PRICE_LOW_TO_HIGH}
                onPress={() => {
                  setSelectedSortingOption(PRODUCT_SORTING.PRICE_LOW_TO_HIGH);
                }}
                selectedFilter={selectedSortingOption}
                card={PRODUCT_SORTING.PRICE_LOW_TO_HIGH}
              />
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text>No filters available</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default withTheme(Filters);

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {fontSize: 16, fontWeight: '700', marginBottom: 8},
  container: {padding: 10},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  input: {width: 120},
  sortByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyContainer: {alignItems: 'center', justifyContent: 'center'},
  price: {fontSize: 18, fontWeight: '700', marginVertical: 8},
  amount: {fontSize: 16, fontWeight: '600', marginBottom: 8, marginLeft: 8},
  sliderContainer: {paddingHorizontal: 5},
  rangSlider: {width: 200},
  thumb: {width: 20, height: 20, borderRadius: 10, borderWidth: 2},
  rail: {height: 4, borderRadius: 2},
  railSelected: {height: 4, borderRadius: 2},
  sortContainer: {flexWrap: 'wrap', flexDirection: 'row'},
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {marginBottom: 8},
});
