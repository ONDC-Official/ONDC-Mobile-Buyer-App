import React, {useEffect, useState} from 'react';
import {Searchbar} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AddressTag from '../address/AddressTag';
import {useAppTheme} from '../../../../../utils/theme';
import AudioRecorder from './AudioRecorder';
import QRButton from './QRButton';
import {isIOS} from '../../../../../utils/constants';

type HeaderProps = {
  disableAddress?: boolean;
  onPress?: () => void;
  allowBack?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  disableAddress,
  onPress,
  allowBack = false,
}) => {
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

  const navigateToHome = () => {
    navigation.navigate('Dashboard');
  };

  useEffect(() => {
    if (isFocused) {
      setSearchQuery('');
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {!disableAddress && (
        <View style={styles.row}>
          <FastImage
            source={require('../../../../../assets/header_logo.png')}
            style={styles.headerImage}
            resizeMode={'contain'}
          />
          <AddressTag onPress={onPress} />
        </View>
      )}
      <View style={styles.searchContainer}>
        {isIOS && allowBack && (
          <TouchableOpacity onPress={navigateToHome} style={styles.backButton}>
            <Icon name={'arrow-left'} size={24} color={'#fff'} />
          </TouchableOpacity>
        )}
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
    headerTitle: {
      color: colors.white,
    },
    searchContainer: {
      width: '100%',
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      height: 60,
      gap: 15,
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
    micContainer: {
      marginLeft: 10,
    },
    headerImage: {
      width: 75,
      height: 25,
      objectFit: 'contain',
    },
  });
export default Header;
