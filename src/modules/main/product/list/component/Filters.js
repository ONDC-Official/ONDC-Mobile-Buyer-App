import React, {useState, useContext} from 'react';
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
import {BASE_URL, GET_PRODUCTS} from '../../../../../utils/apiUtilities';
import {PRODUCT_SORTING} from '../../../../../utils/Constants';
import {cleanFormData} from '../../../../../utils/utils';
import FilterCard from './SortOptionSelector';
import {Context as AuthContext} from '../../../../../context/Auth';
import {getData} from '../../../../../utils/api';
import {useDispatch} from 'react-redux';
import {saveProducts} from '../../../../../redux/product/actions';
import {strings} from '../../../../../locales/i18n';
import useNetworkErrorHandling from '../../../../../hooks/useNetworkErrorHandling';
import ClearButton from '../../../../../components/button/ClearButton';

const applyTitle = strings('main.product.filters.apply_title');
const close = strings('main.product.filters.close');
const noFiltersMessage = strings('main.product.filters.no_filters_message');
const provider = strings('main.product.filters.providers');
const category = strings('main.product.filters.categories');
const priceRange = strings('main.product.filters.price_range');
const sorting = strings('main.product.filters.sorting');

const Filters = ({theme, setCount, filters, closeRBSheet}) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [providers, setProviders] = useState([]);
  const dispatch = useDispatch();
  const {
    state: {token},
  } = useContext(AuthContext);
  const [selectedSortingOption, setSelectedSortingOption] = useState(
    PRODUCT_SORTING.RATINGS_LOW_TO_HIGH,
  );
  const [categories, setCategories] = useState([]);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const {handleApiError} = useNetworkErrorHandling();

  const onApply = async () => {
    setRequestInProgress(true);
    let sortField = 'price';
    let sortOrder = 'desc';

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

    const filterData = cleanFormData({
      sortField: sortField,
      sortOrder: sortOrder,
      priceMin: filters.minPrice ? min : null,
      priceMax: filters.maxPrice ? max : null,
    });

    let params;

    let filterParams = [];
    Object.keys(filterData).forEach(key =>
      filterParams.push(`&${key}=${filterData[key]}`),
    );
    params = filterParams.toString().replace(/,/g, '');

    params =
      providers && providers.length > 0
        ? params + `&providerIds=${providers.toString()}`
        : params;
    params =
      categories && categories.length > 0
        ? params + `&categoryIds=${categories.toString()}`
        : params;

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
          <ClearButton
            title={applyTitle}
            loading={requestInProgress}
            onPress={onApply}
            textColor={colors.accentColor}
          />
          <ClearButton
            title={close}
            onPress={closeRBSheet}
            textColor={colors.accentColor}
          />
        </View>
        <Divider />

        {filters ? (
          <View style={styles.container}>
            {filters.providers && filters.providers.length > 0 && (
              <>
                <Text style={[styles.price]}>{provider}</Text>

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
                <Text style={[styles.price]}>{category}</Text>
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

            {filters.minPrice && filters.maxPrice && (
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
            <Text style={styles.price}>{sorting}</Text>
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
            <Text>{noFiltersMessage}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default withTheme(Filters);

const styles = StyleSheet.create({
  header: {
    padding: 15,
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
  wrapperStyle: {margin: 0},
  containerStyle: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
  },
});
