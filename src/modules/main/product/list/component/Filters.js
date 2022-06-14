import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, {memo, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {CheckBox, Divider, Text, useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import ClearButton from '../../../../../components/button/ClearButton';
import ContainButton from '../../../../../components/button/ContainButton';
import InputField from '../../../../../components/input/InputField';
import {appStyles} from '../../../../../styles/styles';

/**
 * Component to render filters screen
 * @param setCount:function to set items count
 * @param closeRBSheet:function used to close filters sheet
 * @param providers:list of providers selected by user
 * @param setProviders:function to set providers selected by user
 * @param categories:list of providers selected by user
 * @param setCategories:function to set providers selected by user
 * @constructor
 * @returns {JSX.Element}
 */
const Filters = ({
  selectedSortMethod,
  closeRBSheet,
  apiInProgress,
  providers,
  setProviders,
  categories,
  setCategories,
  min,
  max,
  setMin,
  setMax,
  onApply,
}) => {
  const {theme} = useTheme();

  const {colors} = theme;

  const {t} = useTranslation();

  const {filters} = useSelector(({filterReducer}) => filterReducer);

  /**
   * function handles click event of checkbox in providers list
   */
  const onProviderCheckBoxPress = (item, index) => {
    let providerlist = providers.slice();
    index > -1 ? providerlist.splice(index, 1) : providerlist.push(item.id);
    setProviders(providerlist);
  };

  /**
   * function handles click event of checkbox in category list
   */
  const onCategoryCheckBoxPress = (item, index) => {
    let categorylist = categories.slice();
    index > -1 ? categorylist.splice(index, 1) : categorylist.push(item.id);
    setCategories(categorylist);
  };

  const handleValueChange = val => {
    setMax(val[1]);
    setMin(val[0]);
  };

  useEffect(() => {
    if (filters) {
      if (filters.minPrice && filters.maxPrice) {
        setMax(max === 0 ? filters.maxPrice : max);
        setMin(min === 0 ? filters.minPrice : min);
      }
    }
  }, [filters]);

  return (
    <View style={appStyles.container}>
      <View style={styles.header}>
        <ClearButton
          title={t('main.product.filters.close')}
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
                <Text style={styles.text}>
                  {t('main.product.filters.providers')}
                </Text>

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
                <Text style={styles.text}>
                  {t('main.product.filters.categories')}
                </Text>
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
                    <Text style={styles.price}>
                      {t('main.product.filters.price_range')}
                    </Text>

                    <View style={styles.applyButton}>
                      <View style={styles.amountContainer}>
                        <InputField
                          label={t('main.product.filters.min')}
                          value={`${min}`}
                          renderErrorMessage={false}
                        />
                      </View>
                      <View style={styles.amountContainer}>
                        <InputField
                          label={t('main.product.filters.max')}
                          value={`${max}`}
                          renderErrorMessage={false}
                        />
                      </View>
                    </View>

                    <MultiSlider
                      selectedStyle={{
                        backgroundColor: colors.accentColor,
                      }}
                      containerStyle={styles.sliderContainer}
                      markerStyle={[
                        styles.markerStyle,
                        {backgroundColor: colors.accentColor},
                      ]}
                      trackStyle={styles.trackStyle}
                      values={[min, max]}
                      sliderLength={Dimensions.get('window').width - 40}
                      onValuesChange={handleValueChange}
                      min={filters.minPrice}
                      max={filters.maxPrice}
                      step={1}
                    />
                  </>
                )}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <ContainButton
              title={t('main.product.filters.apply_title')}
              loading={apiInProgress}
              onPress={() => {
                onApply(selectedSortMethod);
              }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text>{t('main.product.filters.no_filters_message')}</Text>
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
  sortByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  amountContainer: {
    width: 100,
  },
  emptyContainer: {alignItems: 'center', justifyContent: 'center'},
  price: {fontSize: 18, fontWeight: '700', marginVertical: 8},
  amount: {fontSize: 16, fontWeight: '600', marginBottom: 8},
  sliderContainer: {paddingHorizontal: 10, alignSelf: 'center'},
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  trackStyle: {height: 5, borderRadius: 4},
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
  markerStyle: {height: 21, width: 21},
});
