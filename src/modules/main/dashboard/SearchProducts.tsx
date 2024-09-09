import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import SearchProductList from '../../../components/products/SearchProductList';
import SearchHeader from './components/header/SearchHeader';
import {useAppTheme} from '../../../utils/theme';
import SearchProviders from '../../../components/provider/SearchProviders';
import SafeAreaPage from '../../../components/header/SafeAreaPage';

interface SearchProductsProps {
  route: any;
}

const SearchProducts: React.FC<SearchProductsProps> = ({route: {params}}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState<string | ''>(
    params?.query ?? '',
  );
  const [searchType, setSearchType] = useState<string>('Products');

  const onSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaPage>
      <View style={styles.container}>
        <SearchHeader
          onSearch={onSearch}
          defaultQuery={params?.query ?? ''}
          backIconPress={() => navigation.goBack()}
        />
        {searchQuery.length > 0 && (
          <>
            <View style={styles.switchRow}>
              <View style={styles.switchContainer}>
                <TouchableOpacity
                  onPress={() => setSearchType('Products')}
                  style={[
                    styles.button,
                    searchType === 'Products' ? styles.activeButton : {},
                  ]}>
                  <Text
                    variant={'bodyMedium'}
                    style={
                      searchType === 'Products'
                        ? styles.activeButtonText
                        : styles.buttonText
                    }>
                    {t('Search.Products')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSearchType('Stores')}
                  style={[
                    styles.button,
                    searchType === 'Stores' ? styles.activeButton : {},
                  ]}>
                  <Text
                    variant={'bodyMedium'}
                    style={
                      searchType === 'Stores'
                        ? styles.activeButtonText
                        : styles.buttonText
                    }>
                    {t('Search.Stores')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {searchType === 'Products' ? (
              <SearchProductList searchQuery={searchQuery} />
            ) : (
              <SearchProviders searchQuery={searchQuery} />
            )}
          </>
        )}
      </View>
    </SafeAreaPage>
  );
};

export default SearchProducts;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    switchRow: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
    },
    switchContainer: {
      borderRadius: 24,
      backgroundColor: colors.primary50,
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeButton: {
      backgroundColor: colors.primary,
      borderRadius: 24,
    },
    activeButtonText: {
      color: colors.white,
    },
    buttonText: {
      color: colors.neutral400,
    },
  });
