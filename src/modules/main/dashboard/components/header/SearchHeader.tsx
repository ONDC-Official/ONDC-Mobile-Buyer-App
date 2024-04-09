import React from 'react';
import {Searchbar} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

import {useAppTheme} from '../../../../../utils/theme';
import AudioRecorder from './AudioRecorder';
import QRButton from './QRButton';

type SearchHeaderProps = {
  onSearch: (query: string) => void;
  defaultQuery: string;
  backIconPress?: () => void;
};

const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  defaultQuery,
  backIconPress,
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>(defaultQuery);
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const onSearchComplete = () => {
    onSearch(searchQuery);
  };

  const onAudioSearchComplete = (query: string) => {
    if (query.length > 0) {
      onSearch(searchQuery);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity
        onPress={backIconPress}
        style={styles.backIconContainer}>
        <Icon name={'arrow-back'} size={24} color={'#fff'} />
      </TouchableOpacity>
      <Searchbar
        editable
        iconColor={theme.colors.primary}
        rippleColor={theme.colors.primary}
        inputStyle={styles.searchInput}
        style={styles.search}
        placeholderTextColor={theme.colors.primary}
        placeholder={t('Home.Search')}
        onChangeText={onChangeSearch}
        onBlur={onSearchComplete}
        value={searchQuery}
      />
      <AudioRecorder
        setSearchQuery={setSearchQuery}
        onSearchComplete={onAudioSearchComplete}
      />
      <QRButton />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
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
      paddingHorizontal: 16,
      gap: 15,
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
    backIconContainer: {
      marginRight: 4,
    },
  });
export default SearchHeader;
