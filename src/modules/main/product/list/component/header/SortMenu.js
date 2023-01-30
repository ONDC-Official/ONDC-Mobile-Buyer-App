import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, Divider, withTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import ClearButton from '../../../../../../components/button/ClearButton';
import {updateSortOption} from '../../../../../../redux/filter/actions';
import {appStyles} from '../../../../../../styles/styles';

/**
 * Component to render filters screen
 * @param theme
 * @param sortOptions
 * @param closeSortSheet:function used to close sort sheet
 * @param apiInProgress
 * @param updateFilterCount
 * @constructor
 * @returns {JSX.Element}
 */
const SortMenu = ({
  theme,
  sortOptions,
  closeSortSheet,
  apiInProgress,
  updateFilterCount,
}) => {
  const dispatch = useDispatch();
  const {colors} = theme;
  const {selectedSortOption} = useSelector(({filterReducer}) => filterReducer);

  const [sortingMethod, setSortingMethod] = useState(null);

  const applyFilters = () => {
    dispatch(updateSortOption(sortingMethod));
    updateFilterCount();
    closeSortSheet();
  };

  const clearFilter = () => {
    dispatch(updateSortOption(null));
    closeSortSheet();
  };

  useEffect(() => {
    setSortingMethod(selectedSortOption);
  }, [selectedSortOption]);

  return (
    <View>
      <View style={styles.header}>
        <ClearButton
          title={'Close'}
          onPress={closeSortSheet}
          textColor={colors.primary}
        />
      </View>
      <Divider style={styles.divider} />
      <View>
        {sortOptions.map(item => {
          return (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.button,
                sortingMethod === item.value
                  ? styles.buttonActive
                  : styles.normal,
              ]}
              onPress={() => setSortingMethod(item.value)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actionContainer}>
        {(sortingMethod || selectedSortOption) && (
          <View style={styles.buttonContainer}>
            <Button
              contentStyle={appStyles.containedButtonContainer}
              labelStyle={appStyles.containedButtonLabel}
              mode="outlined"
              disabled={apiInProgress}
              onPress={clearFilter}>
              Clear
            </Button>
          </View>
        )}

        {sortingMethod && (
          <View style={styles.buttonContainer}>
            <Button
              contentStyle={appStyles.containedButtonContainer}
              labelStyle={appStyles.containedButtonLabel}
              mode="contained"
              disabled={apiInProgress}
              loading={apiInProgress}
              onPress={applyFilters}>
              Apply
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default withTheme(SortMenu);

const styles = StyleSheet.create({
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  divider: {marginBottom: 10},
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    width: 120,
    marginHorizontal: 10,
  },
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
