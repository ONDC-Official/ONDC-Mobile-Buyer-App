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

  const onClearIconPress = () => {
    onSearch('');
  };

  const onAudioSearchComplete = (query: string) => {
    if (query.length > 0) {
      onSearch(query);
      setSearchQuery(query);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <Searchbar
        editable
        iconColor={theme.colors.primary}
        rippleColor={theme.colors.primary50}
        inputStyle={styles.searchInput}
        style={styles.search}
        placeholderTextColor={theme.colors.neutral300}
        placeholder={t('Home.Search')}
        onChangeText={onChangeSearch}
        onBlur={onSearchComplete}
        onClearIconPress={onClearIconPress}
        value={searchQuery}
        icon={() => (
          <Icon name="arrow-back" size={20} color={theme.colors.primary} />
        )}
        onIconPress={backIconPress}
      />
      <AudioRecorder
        color={theme.colors.primary}
        setSearchQuery={setSearchQuery}
        onSearchComplete={onAudioSearchComplete}
      />
      <QRButton color={theme.colors.primary} />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    searchContainer: {
      width: '100%',
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      paddingHorizontal: 16,
      gap: 15,
    },
    searchInput: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: 44,
      fontFamily: 'Inter-Regular',
      fontWeight: '400',
    },
    search: {
      flex: 1,
      height: 44,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: '#196AAB',
    },
    backIconContainer: {
      marginRight: 4,
    },
  });
export default SearchHeader;
