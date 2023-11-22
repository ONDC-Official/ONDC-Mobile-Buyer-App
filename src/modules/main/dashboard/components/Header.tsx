import React from 'react';
import {Searchbar, useTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import ONDCLogo from '../../../../assets/ondc_logo.svg';
import AddressTag from './AddressTag';

const Header = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ONDCLogo />
        <AddressTag />
      </View>
      <View style={styles.searchContainer}>
        <Searchbar
          iconColor={theme.colors.primary}
          rippleColor={theme.colors.primary}
          inputStyle={styles.searchInput}
          style={styles.search}
          placeholderTextColor={theme.colors.primary}
          placeholder="Search"
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
      paddingVertical: 12,
    },
    searchInput: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      color: colors.primary,
      minHeight: 44,
    },
    search: {
      height: 44,
    },
  });
export default Header;
