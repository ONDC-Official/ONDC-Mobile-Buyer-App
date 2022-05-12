import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import InputField from '../../../components/input/InputField';
import {SORT_BY_PRICE, SORT_BY_RATING} from '../../../utils/Constants';
import FilterCard from './FilterCard';

const Filters = ({theme, closeRBSheet}) => {
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(
    SORT_BY_PRICE.LOW_TO_HIGH,
  );
  const [selectedRating, setSelectedRating] = useState(
    SORT_BY_RATING.HIGH_TO_LOW,
  );
  const {colors} = theme;
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={closeRBSheet}>
          <Text style={[styles.text, {color: colors.accentColor}]}>Close</Text>
        </TouchableOpacity>
      </View>
      <Divider />
      <View style={styles.container}>
        <Text style={[styles.text]}>Price</Text>
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <InputField placeholder={'₹ Min'} />
          </View>
          <View style={styles.input}>
            <InputField placeholder={'₹ Max'} />
          </View>
        </View>
        <Text style={styles.text}>Sort By</Text>
        <Text>Price</Text>
        <View style={styles.sortByContainer}>
          <FilterCard
            selectedPriceFilter={selectedPriceFilter}
            name={'Low to High'}
            card={SORT_BY_PRICE.LOW_TO_HIGH}
            onPress={() => {
              setSelectedPriceFilter(SORT_BY_PRICE.LOW_TO_HIGH);
            }}
          />
          <FilterCard
            selectedPriceFilter={selectedPriceFilter}
            name={'High to Low'}
            card={SORT_BY_PRICE.HIGH_TO_LOW}
            onPress={() => {
              setSelectedPriceFilter(SORT_BY_PRICE.HIGH_TO_LOW);
            }}
          />
        </View>
        <Text>Ratings</Text>
        <View style={styles.sortByContainer}>
          <FilterCard
            selectedPriceFilter={selectedRating}
            name={'Low to High'}
            card={SORT_BY_RATING.LOW_TO_HIGH}
            onPress={() => {
              setSelectedRating(SORT_BY_RATING.LOW_TO_HIGH);
            }}
          />
          <FilterCard
            selectedPriceFilter={selectedRating}
            name={'High to Low'}
            card={SORT_BY_RATING.HIGH_TO_LOW}
            onPress={() => {
              setSelectedRating(SORT_BY_RATING.HIGH_TO_LOW);
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default withTheme(Filters);

const styles = StyleSheet.create({
  header: {padding: 10, alignItems: 'flex-end'},
  text: {fontSize: 18, fontWeight: '700'},
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
});
