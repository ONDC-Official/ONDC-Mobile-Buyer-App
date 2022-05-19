import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CheckBox, Divider, Text, withTheme} from 'react-native-elements';
import RangeSlider from 'rn-range-slider';
import {SORTINGLIST} from '../../../utils/Constants';
import {cleanFormData} from '../../../utils/utils';
import useProductList from './component/hooks/useProductList';
import FilterCard from './FilterCard';

const Filters = ({theme, filters, closeRBSheet}) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [provider, setProvider] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(
    SORTINGLIST.RATINGS_LOW_TO_HIGH,
  );
  const [category, setCategory] = useState(null);
  const {getProducts} = useProductList();

  const onPressHandler = () => {
    let sortField;
    let sortOrder;
    if (selectedFilter === SORTINGLIST.RATINGS_HIGH_TO_LOW) {
      sortOrder = 'desc';
      sortField = 'rating';
    } else if (selectedFilter === SORTINGLIST.RATINGS_LOW_TO_HIGH) {
      sortOrder = 'asc';
      sortField = 'rating';
    } else if (selectedFilter === SORTINGLIST.PRICE_LOW_TO_HIGH) {
      sortOrder = 'asc';
      sortField = 'price';
    } else {
      sortOrder = 'desc';
      sortField = 'price';
    }

    const filterData = cleanFormData({
      providerId: provider,
      sortField: sortField,
      sortOrder: sortOrder,
      // priceMin: min,
      // priceMax: max,
    });
    getProducts(filters.message_id, filters.transaction_id, filterData);
  };

  const {colors} = theme;
  return (
    <ScrollView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={closeRBSheet}>
            <Text style={[styles.text, {color: colors.accentColor}]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
        <Divider />

        {filters ? (
          <View style={styles.container}>
            {filters.providers && filters.providers.length > 0 && (
              <>
                <Text style={[styles.text]}>Providers</Text>

                {filters.providers.map(item => (
                  <CheckBox
                    key={item.id}
                    title={item.name}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={item.id === provider}
                    onPress={() => setProvider(item.id)}
                  />
                ))}
              </>
            )}
            {filters.categories && filters.categories.length > 0 && (
              <>
                <Text style={[styles.text]}>Categories</Text>
                {filters.categories.map(item => (
                  <CheckBox
                    key={item.id}
                    title={item.name}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={item.id === category}
                    onPress={() => setCategory(item.id)}
                  />
                ))}
              </>
            )}

            <Text style={styles.price}>Price Range</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.amount}>
                ₹{min} - ₹{max}
              </Text>
              <RangeSlider
                style={styles.rangSlider}
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
                      style={[styles.rail, {backgroundColor: colors.primary}]}
                    />
                  );
                }}
                renderNotch={value => {}}
                renderLabel={value => {}}
                renderRailSelected={value => {
                  return (
                    <View
                      style={[
                        styles.rail,
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
                name={SORTINGLIST.RATINGS_HIGH_TO_LOW}
                onPress={() => {
                  setSelectedFilter(SORTINGLIST.RATINGS_HIGH_TO_LOW);
                }}
                selectedFilter={selectedFilter}
                card={SORTINGLIST.RATINGS_HIGH_TO_LOW}
              />
              <FilterCard
                name={SORTINGLIST.RATINGS_LOW_TO_HIGH}
                onPress={() => {
                  setSelectedFilter(SORTINGLIST.RATINGS_LOW_TO_HIGH);
                }}
                selectedFilter={selectedFilter}
                card={SORTINGLIST.RATINGS_LOW_TO_HIGH}
              />
              <FilterCard
                name={SORTINGLIST.PRICE_HIGH_TO_LOW}
                onPress={() => {
                  setSelectedFilter(SORTINGLIST.PRICE_HIGH_TO_LOW);
                }}
                selectedFilter={selectedFilter}
                card={SORTINGLIST.PRICE_HIGH_TO_LOW}
              />
              <FilterCard
                name={SORTINGLIST.PRICE_LOW_TO_HIGH}
                onPress={() => {
                  setSelectedFilter(SORTINGLIST.PRICE_LOW_TO_HIGH);
                }}
                selectedFilter={selectedFilter}
                card={SORTINGLIST.PRICE_LOW_TO_HIGH}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.applyButton,
                {
                  backgroundColor: colors.accentColor,
                },
              ]}
              onPress={onPressHandler}>
              <Text style={{color: colors.white}}>APPLY</Text>
            </TouchableOpacity>
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
  header: {padding: 10, alignItems: 'flex-end'},
  text: {fontSize: 18, fontWeight: '700', marginBottom: 8},
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
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginVertical: 20,
  },
  sortContainer: {flexWrap: 'wrap', flexDirection: 'row'},
});
