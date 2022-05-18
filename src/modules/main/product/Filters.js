import React, {useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CheckBox, Divider, Text, withTheme} from 'react-native-elements';
import RangeSlider from 'rn-range-slider';
import useProductList from './component/hooks/useProductList';

const Filters = ({theme, filters, closeRBSheet}) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const {getProducts} = useProductList();

  const {colors} = theme;
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={closeRBSheet}>
          <Text style={[styles.text, {color: colors.accentColor}]}>Close</Text>
        </TouchableOpacity>
      </View>
      <Divider />
      {filters ? (
        <View style={styles.container}>
          {filters.providers && filters.providers.length > 0 && (
            <>
              <Text style={[styles.text]}>Providers</Text>
              <FlatList
                data={filters.providers}
                renderItem={({item}) => (
                  <CheckBox
                    key={item.id}
                    title={item.name}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={styles.containerStyle}
                  />
                )}
              />
            </>
          )}
          {filters.categories && filters.categories.length > 0 && (
            <>
              <Text style={[styles.text]}>Categories</Text>
              <FlatList
                data={filters.categories}
                renderItem={({item}) => (
                  <CheckBox
                    key={item.id}
                    title={item.name}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={styles.containerStyle}
                  />
                )}
              />
            </>
          )}
          {filters.fulfillment && filters.fulfillment.length > 0 && (
            <>
              <Text style={[styles.text]}>Fulfillment</Text>
              <FlatList
                data={filters.fulfillment}
                renderItem={({item}) => (
                  <CheckBox
                    key={item.id}
                    title={item.name}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={styles.containerStyle}
                  />
                )}
              />
            </>
          )}
          <Text style={styles.price}>Price Range</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.amount}>
              ₹{min} - ₹{max}
            </Text>
            <RangeSlider
              style={{width: 200}}
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
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: colors.accentColor,
                      backgroundColor: '#ffffff',
                    }}
                  />
                );
              }}
              renderRail={() => {
                return (
                  <View
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: colors.primary,
                    }}
                  />
                );
              }}
              renderNotch={value => {}}
              renderLabel={value => {}}
              renderRailSelected={value => {
                return (
                  <View
                    style={{
                      height: 4,
                      backgroundColor: colors.accentColor,
                      borderRadius: 2,
                    }}
                  />
                );
              }}
            />
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
});
