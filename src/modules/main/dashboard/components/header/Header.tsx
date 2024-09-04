import React, {useEffect, useState} from 'react';
import {Searchbar} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import AddressTag from '../address/AddressTag';
import {useAppTheme} from '../../../../../utils/theme';
import AudioRecorder from './AudioRecorder';
import QRButton from './QRButton';
import WishListAction from './WishListAction';
import CartAction from './CartAction';

type HeaderProps = {
  onPress?: () => void;
};

const Header: React.FC<HeaderProps> = ({onPress}) => {
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const onSubmitEditing = () => {
    if (searchQuery.trim().length > 0) {
      navigation.navigate('SearchProducts', {query: searchQuery});
      setSearchQuery('');
    }
  };

  const onAudioSearchComplete = (query: string) => {
    if (query.length > 0) {
      navigation.navigate('SearchProducts', {query});
      setSearchQuery('');
    }
  };

  useEffect(() => {
    if (isFocused) {
      setSearchQuery('');
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AddressTag onPress={onPress} />
        <View style={styles.actionButtonContainer}>
          <WishListAction />
          <CartAction />
        </View>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchButton}>
          <Searchbar
            editable
            iconColor={theme.colors.primary}
            rippleColor={theme.colors.primary}
            inputStyle={styles.searchInput}
            style={styles.search}
            placeholderTextColor={theme.colors.primary}
            placeholder={t('Home.Search')}
            onChangeText={onChangeSearch}
            onSubmitEditing={onSubmitEditing}
            value={searchQuery}
          />
        </View>
        <AudioRecorder
          setSearchQuery={setSearchQuery}
          onSearchComplete={onAudioSearchComplete}
        />
        <QRButton />
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
      gap: 15,
      marginBottom: 8,
    },
    backButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      marginRight: 10,
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
    headerImage: {
      width: 32,
      height: 32,
      objectFit: 'contain',
    },
    actionButtonContainer: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
    },
  });
export default Header;
