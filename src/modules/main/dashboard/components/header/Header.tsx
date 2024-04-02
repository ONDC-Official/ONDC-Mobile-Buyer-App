import React from 'react';
import {Searchbar} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import AddressTag from '../address/AddressTag';
import {useAppTheme} from '../../../../../utils/theme';

type HeaderProps = {
  disableAddress?: boolean;
};

const Header: React.FC<HeaderProps> = ({disableAddress}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToSearch = () => navigation.navigate('SearchProducts');

  return (
    <View style={styles.container}>
      {!disableAddress && (
        <View style={styles.row}>
          <FastImage
            source={require('../../../../../assets/app_logo.png')}
            style={styles.headerImage}
          />
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
            placeholder={t('Home.Search')}
            value={''}
            traileringIcon={'microphone'}
            traileringIconColor={theme.colors.primary}
          />
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
      paddingVertical: 9,
    },
    searchContainer: {
      width: '100%',
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      height: 60,
    },
    searchButton: {
      flex: 1,
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
    headerImage: {
      width: 75,
      height: 30,
    },
  });
export default Header;
