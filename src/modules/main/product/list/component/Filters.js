import React, {useState, useContext, memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {CheckBox, Divider, Text, useTheme} from 'react-native-elements';
import RangeSlider from 'rn-range-slider';
import {appStyles} from '../../../../../styles/styles';
import {BASE_URL, GET_PRODUCTS} from '../../../../../utils/apiUtilities';
import {cleanFormData} from '../../../../../utils/utils';

import {Context as AuthContext} from '../../../../../context/Auth';
import {getData} from '../../../../../utils/api';
import {useDispatch} from 'react-redux';
import {saveProducts} from '../../../../../redux/product/actions';
import {strings} from '../../../../../locales/i18n';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import ClearButton from '../../../../../components/button/ClearButton';
import ContainButton from '../../../../../components/button/ContainButton';

const applyTitle = strings('main.product.filters.apply_title');
const close = strings('main.product.filters.close');
const noFiltersMessage = strings('main.product.filters.no_filters_message');
const provider = strings('main.product.filters.providers');
const category = strings('main.product.filters.categories');
const priceRange = strings('main.product.filters.price_range');

/**
 * Component to render filters screen
 * @param setCount:function to set items count
 * @param appliedFilters:data containing filters selected by user
 * @param setAppliedFilters:function to set filters selected by user
 * @param filters:object containing filter parameters
 * @param closeRBSheet:function used to close filters sheet
 * @param providers:list of providers selected by user
 * @param setProviders:function to set providers selected by user
 * @param categories:list of providers selected by user
 * @param setCategories:function to set providers selected by user
 * @constructor
 * @returns {JSX.Element}
 */
const Filters = ({
  setCount,
  appliedFilters,
  setAppliedFilters,
  filters,
  closeRBSheet,
  providers,
  setProviders,
  categories,
  setCategories,
}) => {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {colors} = theme;

  const {
    state: {token},
  } = useContext(AuthContext);

  const [requestInProgress, setRequestInProgress] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {handleApiError} = useNetworkErrorHandling();

  /**
   * function handles click event of apply button
   * it request list of products with selected filter params
   * @returns {Promise<void>}
   */
  const onApply = async () => {
    setRequestInProgress(true);

    const filterData = cleanFormData({
      priceMin: filters.minPrice ? min : null,
      priceMax: filters.maxPrice ? max : null,
    });

    let params;

    let filterParams = [];
    Object.keys(filterData).forEach(key =>
      filterParams.push(`&${key}=${filterData[key]}`),
    );
    params = filterParams.toString().replace(/,/g, '');

    if (providers && providers.length > 0) {
      params = params + `&providerIds=${providers.toString()}`;
      let filteredData = appliedFilters.slice();
      filteredData.push(providers);
      setAppliedFilters(filteredData);
    }

    if (categories && categories.length > 0) {
      params = params + `&categoryIds=${categories.toString()}`;
      let filteredData = appliedFilters.slice();
      filteredData.push(categories);
      setAppliedFilters(filteredData);
    }

    const url = `${BASE_URL}${GET_PRODUCTS}${filters.message_id}${params}`;
    try {
      const {data} = await getData(`${url}`, options);
      setCount(data.message.count);
      const productsList = data.message.catalogs.map(item => {
        return Object.assign({}, item, {
          quantity: 0,
          transaction_id: filters.transaction_id,
        });
      });

      dispatch(saveProducts(productsList));
      closeRBSheet();
    } catch (e) {
      handleApiError(e);
    }
  };

  /**
   * function handles click event of checkbox in providers list
   */
  const onProviderCheckBoxPress = (item, index) => {
    let providerlist = providers.slice();
    if (index > -1) {
      providerlist.splice(index, 1);
    } else {
      providerlist.push(item.id);
    }
    setProviders(providerlist);
  };

  /**
   * function handles click event of checkbox in category list
   */
  const onCategoryCheckBoxPress = (item, index) => {
    let categorylist = categories.slice();
    if (index > -1) {
      categorylist.splice(index, 1);
    } else {
      categorylist.push(item.id);
    }
    setCategories(categorylist);
  };

  return (
    <View style={appStyles.container}>
      <View style={styles.header}>
        <ClearButton
          title={close}
          onPress={closeRBSheet}
          textColor={colors.accentColor}
        />
      </View>
      <Divider />

      {filters ? (
        <View style={appStyles.container}>
          <ScrollView>
            {filters.providers && filters.providers.length > 0 && (
              <>
                <Text style={styles.text}>{provider}</Text>

                {filters.providers.map(item => {
                  const index = providers.findIndex(one => one === item.id);
                  return (
                    <CheckBox
                      key={item.id}
                      title={item.name}
                      checked={index > -1}
                      onPress={() => onProviderCheckBoxPress(item, index)}
                      containerStyle={[
                        styles.containerStyle,
                        {
                          backgroundColor: colors.backgroundColor,
                        },
                      ]}
                      wrapperStyle={styles.wrapperStyle}
                    />
                  );
                })}
              </>
            )}
            {filters.categories && filters.categories.length > 0 && (
              <>
                <Text style={styles.text}>{category}</Text>
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
            <View style={styles.container}>
              {filters.minPrice &&
                filters.maxPrice &&
                filters.minPrice !== filters.maxPrice && (
                  <>
                    <Text style={styles.price}>{priceRange}</Text>
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
                  </>
                )}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <ContainButton
              title={applyTitle}
              loading={requestInProgress}
              onPress={onApply}
            />
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text>{noFiltersMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default memo(Filters);

const styles = StyleSheet.create({
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {fontSize: 18, fontWeight: '700', marginVertical: 8, marginLeft: 10},
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
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {marginBottom: 8},
  wrapperStyle: {margin: 0},
  containerStyle: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    marginVertical: 20,
    width: 120,
    marginHorizontal: 10,
  },
});