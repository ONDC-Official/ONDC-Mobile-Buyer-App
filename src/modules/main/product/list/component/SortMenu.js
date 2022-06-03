import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {PRODUCT_SORTING} from '../../../../../utils/Constants';
import {CheckBox, Divider, withTheme} from 'react-native-elements';
import ClearButton from '../../../../../components/button/ClearButton';
import {strings} from '../../../../../locales/i18n';
import {Context as AuthContext} from '../../../../../context/Auth';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import {useDispatch} from 'react-redux';
import {BASE_URL, GET_PRODUCTS} from '../../../../../utils/apiUtilities';
import {saveProducts} from '../../../../../redux/product/actions';
import {getData} from '../../../../../utils/api';
import ContainButton from '../../../../../components/button/ContainButton';

const applyTitle = strings('main.product.filters.apply_title');
const close = strings('main.product.filters.close');

const list = [
  {name: 'Price: High To Low', value: PRODUCT_SORTING.PRICE_HIGH_TO_LOW},
  {name: 'Price: Low To High', value: PRODUCT_SORTING.PRICE_LOW_TO_HIGH},
  {name: 'Ratings: High To Low', value: PRODUCT_SORTING.RATINGS_HIGH_TO_LOW},
  {name: 'Ratings: Low To High', value: PRODUCT_SORTING.RATINGS_LOW_TO_HIGH},
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
const SortMenu = ({theme, setSelectedSortMethod, closeSortSheet, onApply}) => {
  const {colors} = theme;

  const [requestInProgress, setRequestInProgress] = useState(false);
  const [sortingMethod, setSortingMethod] = useState(
    PRODUCT_SORTING.RATINGS_HIGH_TO_LOW,
  );

  return (
    <View>
      <View style={styles.header}>
        <ClearButton
          title={close}
          onPress={closeSortSheet}
          textColor={colors.accentColor}
        />
      </View>
      <Divider style={styles.divider} />
      <View>
        {list.map(item => (
          <CheckBox
            key={item.value}
            title={item.name}
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
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <ContainButton
          title={applyTitle}
          loading={requestInProgress}
          onPress={() => {
            setRequestInProgress(true);
            onApply(sortingMethod)
              .then(() => {
                setRequestInProgress(false);
                setSelectedSortMethod(sortingMethod);
                closeSortSheet();
              })
              .catch(() => {
                setRequestInProgress(false);
              });
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
