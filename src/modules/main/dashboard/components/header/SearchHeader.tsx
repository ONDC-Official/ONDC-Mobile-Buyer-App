import React from 'react';
import {Searchbar} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from '../../../../../utils/theme';
import {useTranslation} from 'react-i18next';

type SearchHeaderProps = {
  onSearch: (query: string) => void;
  backIconPress?: () => void;
};

const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  backIconPress,
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={backIconPress}
          style={styles.backIconContainer}>
          <Icon name={'arrow-back'} size={24} color={'#fff'} />
        </TouchableOpacity>
        <Searchbar
          iconColor={theme.colors.primary}
          rippleColor={theme.colors.primary}
          inputStyle={styles.searchInput}
          style={styles.search}
          placeholderTextColor={theme.colors.primary}
          placeholder={t('Home.Search')}
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
export default SearchHeader;
