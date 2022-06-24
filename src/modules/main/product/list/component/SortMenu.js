import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {CheckBox, Divider, withTheme} from 'react-native-elements';
import ClearButton from '../../../../../components/button/ClearButton';
import ContainButton from '../../../../../components/button/ContainButton';
import {PRODUCT_SORTING} from '../../../../../utils/Constants';

const list = [
  {
    name: 'main.product.filters.price_high_to_low',
    value: PRODUCT_SORTING.PRICE_HIGH_TO_LOW,
  },
  {
    name: 'main.product.filters.price_low_to_high',
    value: PRODUCT_SORTING.PRICE_LOW_TO_HIGH,
  },
  {
    name: 'main.product.filters.ratings_high_to_low',
    value: PRODUCT_SORTING.RATINGS_HIGH_TO_LOW,
  },
  {
    name: 'main.product.filters.ratings_low_to_high',
    value: PRODUCT_SORTING.RATINGS_LOW_TO_HIGH,
  },
];

/**
 * Component to render filters screen
 * @param setCount:function to set items count
 * @param filters:object containing filter parameters
 * @param closeSortSheet:function used to close sort sheet
 * @param selectedSortMethod:sort method selected by user
 * @param setSelectedSortMethod:function to set selected sort method
 * @constructor
 * @returns {JSX.Element}
 */
const SortMenu = ({
  theme,
  closeSortSheet,
  selectedSortMethod,
  apiInProgress,
  onApply,
}) => {
  const {colors} = theme;

  const {t} = useTranslation();

  const [sortingMethod, setSortingMethod] = useState(
    PRODUCT_SORTING.PRICE_LOW_TO_HIGH,
  );

  useEffect(() => {
    setSortingMethod(selectedSortMethod);
  }, []);

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
        {list.map(item => {
          return (
            <CheckBox
              key={item.value}
              title={t(item.name)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={item.value === sortingMethod}
              containerStyle={[
                styles.containerStyle,
                {
                  backgroundColor: colors.backgroundColor,
                },
              ]}
              onPress={() => {
                setSortingMethod(item.value);
              }}
            />
          );
        })}
      </View>
      <View style={styles.buttonContainer}>
        <ContainButton
          title={t('main.product.filters.apply_title')}
          loading={apiInProgress}
          onPress={() => {
            onApply(sortingMethod);
          }}
        />
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
  buttonContainer: {
    alignSelf: 'flex-end',
    marginVertical: 20,
    width: 120,
    marginHorizontal: 10,
  },
  containerStyle: {borderWidth: 0, margin: 0},
});
