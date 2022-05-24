import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {CheckBox, Divider, Text, withTheme} from 'react-native-elements';
import RangeSlider from 'rn-range-slider';
import {appStyles} from '../../../styles/styles';
import {SORTINGLIST} from '../../../utils/Constants';
import {cleanFormData} from '../../../utils/utils';
import useProductList from './component/hooks/useProductList';
import FilterCard from './FilterCard';

const Filters = ({theme, filters, closeRBSheet}) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [providers, setProviders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(
    SORTINGLIST.RATINGS_LOW_TO_HIGH,
  );
  const [category, setCategory] = useState(null);
  const {getProducts, requstInProgress, setRequestInProgress} =
    useProductList();

  const onPressHandler = () => {
    setRequestInProgress(true);
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
      providerId: providers.toString(),
      sortField: sortField,
      sortOrder: sortOrder,
      // priceMin: min,
      // priceMax: max,
    });

    getProducts(
      filters.message_id,
      filters.transaction_id,
      closeRBSheet,
      filterData,
    );
  };

  const {colors} = theme;
  return (
    <ScrollView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.applyButton} onPress={onPressHandler}>
            <Text style={[styles.text, {color: colors.accentColor}]}>
              APPLY{'  '}
            </Text>
            {requstInProgress && (
              <ActivityIndicator
                show={requstInProgress}
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
        <Divider/>

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
                      onPress={() => {
                        let providerlist = providers.slice();
                        if (index > -1) {
                          providerlist.splice(index, 1);
                        } else {
                          providerlist.push(item.id);
                        }
                        setProviders(providerlist);
                      }}
                    />
                  );
                })}
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
