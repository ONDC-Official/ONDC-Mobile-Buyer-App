import React from 'react';
import {Searchbar, useTheme} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ONDCLogo from '../../../../assets/ondc_logo.svg';
import AddressTag from './address/AddressTag';
import Icon from 'react-native-vector-icons/MaterialIcons';

type HeaderProps = {
  onSearchFocus?: () => void;
  disableAddress?: boolean;
  onSearch?: (query: string) => void;
  backIcon?: boolean;
  backIconPress?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  onSearchFocus,
  disableAddress,
  onSearch,
  backIcon,
  backIconPress,
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    onSearch && onSearch(query);
  };
  const onFocus = () => {
    onSearchFocus && onSearchFocus();
  };

  return (
    <View style={styles.container}>
      {!disableAddress && (
        <View style={styles.row}>
          <ONDCLogo />
          <AddressTag />
        </View>
      )}
      <View style={styles.searchContainer}>
        {backIcon && (
          <TouchableOpacity
            onPress={backIconPress}
            style={styles.backIconContainer}>
            <Icon name={'arrow-back'} size={24} color={'#fff'} />
          </TouchableOpacity>
        )}
        <Searchbar
          iconColor={theme.colors.primary}
          rippleColor={theme.colors.primary}
          inputStyle={styles.searchInput}
          style={styles.search}
          placeholderTextColor={theme.colors.primary}
          placeholder="Search"
          onFocus={onFocus}
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    searchContainer: {
      width: '100%',
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInput: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      color: colors.primary,
      minHeight: 44,
    },
    search: {
      flex: 1,
      height: 44,
      backgroundColor: colors.white,
    },
    backIconContainer: {
      marginRight: 12,
    },
  });
export default Header;
