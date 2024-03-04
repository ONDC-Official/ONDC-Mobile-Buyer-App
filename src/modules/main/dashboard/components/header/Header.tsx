import React from 'react';
import {Searchbar, useTheme} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import ONDCLogo from '../../../../../assets/ondc_logo.svg';
import AddressTag from '../address/AddressTag';
import Icon from 'react-native-vector-icons/MaterialIcons';

type HeaderProps = {
  disableAddress?: boolean;
};

const Header: React.FC<HeaderProps> = ({disableAddress}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToSearch = () => navigation.navigate('SearchProducts');

  return (
    <View style={styles.container}>
      {!disableAddress && (
        <View style={styles.row}>
          <ONDCLogo />
          <AddressTag />
        </View>
      )}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={navigateToSearch}>
          <Searchbar
            editable={false}
            iconColor={theme.colors.primary}
            rippleColor={theme.colors.primary}
            inputStyle={styles.searchInput}
            style={styles.search}
            placeholderTextColor={theme.colors.primary}
            placeholder="Search"
            value={''}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToSearch}
          style={styles.micContainer}>
          <Icon name={'mic'} size={24} color={'#fff'} />
        </TouchableOpacity>
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
      backgroundColor: colors.primary,
      height: 68,
    },
    searchButton: {
      width: '90%',
    },
    searchInput: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: 44,
    },
    search: {
      flex: 1,
      height: 44,
      backgroundColor: colors.white,
    },
    micContainer: {
      marginLeft: 10,
    },
  });
export default Header;
