import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SearchBar, Text, withTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../../../locales/i18n';
import {SEARCH_QUERY} from '../../../utils/Constants';
import FilterButton from './FilterButton';

const product = strings('main.product.product_label');
const provider = strings('main.product.provider_label');
const category = strings('main.product.category_label');
const search = strings('main.product.search_label');

/**
 * Component to header on products screen
 * @param openSheet: function to open rb sheet when user wants to select location
 * @param location:location of user or location selected by user
 * @param onSearch:function handles onEndEditing event of searchbar
 * @constructor
 * @returns {JSX.Element}
 */
const Header = ({
  theme,
  openSheet,
  apiInProgress,
  onSearch,
  locationInProgress,
  location,
}) => {
  const {colors} = theme;
  const [selectedCard, setSelectedCard] = useState(product);
  const [item, setItem] = useState(null);

  /**
   * function handles click event of filter button
   * @param card :filter button selected by user
   */
  const onCardSelect = card => setSelectedCard(card);

  return (
    <View style={[styles.container, {backgroundColor: colors.white}]}>
      <View style={styles.locationContainer}>
        {locationInProgress ? (
          <View style={styles.subContainer}>
            <Text>Detecting location {'    '}</Text>
            <ActivityIndicator
              showLoading={locationInProgress}
              color={colors.accentColor}
              size={14}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.subContainer} onPress={openSheet}>
            <Icon name="map-marker" size={20} color={colors.accentColor} />
            <View style={styles.textContainer}>
              <Text style={{color: colors.accentColor}}>
                {location} <Icon name="angle-down" size={14} />
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.cardContainer}>
        <FilterButton
          name={product}
          onPress={() => {
            onCardSelect(SEARCH_QUERY.PRODUCT);
          }}
          selectedCard={selectedCard}
        />
        <View style={styles.space} />
        <FilterButton
          name={provider}
          onPress={() => {
            onCardSelect(SEARCH_QUERY.PROVIDER);
          }}
          selectedCard={selectedCard}
        />
        <View style={styles.space} />

        <FilterButton
          name={category}
          onPress={() => {
            onCardSelect(SEARCH_QUERY.CATEGORY);
          }}
          selectedCard={selectedCard}
        />
      </View>
      <SearchBar
        round={true}
        lightTheme={true}
        placeholder={`${search} ${selectedCard}`}
        containerStyle={[
          styles.containerStyle,
          {backgroundColor: colors.white},
        ]}
        showLoading={apiInProgress}
        inputContainerStyle={[
          styles.inputContainerStyle,
          {backgroundColor: colors.white},
        ]}
        cancelIcon={false}
        onSubmitEditing={() => {
          if (item !== null && item.trim().length > 2) {
            onSearch(item, selectedCard);
          }
        }}
        onChangeText={setItem}
        value={item}
      />
    </View>
  );
};

export default withTheme(Header);

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  subContainer: {flexDirection: 'row', alignItems: 'center'},
  locationContainer: {marginBottom: 10},
  textContainer: {marginLeft: 8, flexShrink: 1},
  containerStyle: {padding: 0, borderRadius: 15},
  cardContainer: {flexDirection: 'row', marginBottom: 10},
  space: {marginHorizontal: 5},
  inputContainerStyle: {elevation: 10, borderRadius: 15},
});
