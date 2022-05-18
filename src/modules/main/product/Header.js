import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import {SearchBar, Text, withTheme} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from '../../../locales/i18n';
import {appStyles} from '../../../styles/styles';
import {SEARCH_QUERY} from '../../../utils/Constants';
import Filters from './Filters';

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
  filters,
}) => {
  const {colors} = theme;

  const [item, setItem] = useState(null);
  const refRBSheet = useRef();

  const openRBSheet = () => refRBSheet.current.open();
  const closeRBSheet = () => refRBSheet.current.close();

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

      <View style={styles.subContainer}>
        <SearchBar
          round={false}
          lightTheme={true}
          placeholder={search}
          containerStyle={[appStyles.container, styles.containerStyle]}
          showLoading={apiInProgress}
          inputContainerStyle={[
            styles.inputContainerStyle,
            {
              backgroundColor: colors.white,
            },
          ]}
          loadingProps={{color: colors.accentColor}}
          cancelIcon={false}
          onSubmitEditing={() => {
            if (item !== null && item.trim().length > 2) {
              onSearch(item, SEARCH_QUERY.PRODUCT);
            }
          }}
          onChangeText={setItem}
          value={item}
        />

        <TouchableOpacity
          style={[styles.filter, {borderColor: colors.accentColor}]}>
          <Text
            style={{color: colors.accentColor}}
            activeOpacity={0.7}
            onPress={openRBSheet}>
            Filter <Icon name="filter" size={14} />
          </Text>
        </TouchableOpacity>
        <RBSheet ref={refRBSheet} height={Dimensions.get('window').height / 2}>
          <Filters closeRBSheet={closeRBSheet} filters={filters} />
        </RBSheet>
      </View>
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
  inputContainerStyle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRadius: 10,
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
  },
  cardContainer: {flexDirection: 'row', marginBottom: 10},
  space: {marginHorizontal: 5},
  filter: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 5,
  },
});
