import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Divider, withTheme} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';

import ClearButton from '../../../../../../components/button/ClearButton';
import ContainButton from '../../../../../../components/button/ContainButton';
import {theme} from '../../../../../../utils/theme';
import {updateSortOption} from '../../../../../../redux/filter/actions';
import OutlineButton from '../../../../../../components/button/OutlineButton';

/**
 * Component to render filters screen
 * @param setCount:function to set items count
 * @param closeSortSheet:function used to close sort sheet
 * @constructor
 * @returns {JSX.Element}
 */
const SortMenu = ({theme, sortOptions, closeSortSheet, apiInProgress}) => {
  const dispatch = useDispatch();
  const {colors} = theme;
  const {t} = useTranslation();
  const {selectedSortOption} = useSelector(({filterReducer}) => filterReducer);

  const [sortingMethod, setSortingMethod] = useState(null);

  const applyFilters = () => {
    dispatch(updateSortOption(sortingMethod));
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
          title={t('main.product.filters.close')}
          onPress={closeSortSheet}
          textColor={colors.accentColor}
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
              <Text>{t(item.name)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actionContainer}>
        {(sortingMethod || selectedSortOption) && (
          <View style={styles.buttonContainer}>
            <OutlineButton
              disabled={apiInProgress}
              onPress={clearFilter}
              title={t('main.product.filters.clear')}
            />
          </View>
        )}

        {sortingMethod && (
          <View style={styles.buttonContainer}>
            <ContainButton
              disabled={apiInProgress}
              title={t('main.product.filters.apply_title')}
              loading={apiInProgress}
              onPress={applyFilters}
            />
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
    borderColor: theme.colors.accentColor,
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
