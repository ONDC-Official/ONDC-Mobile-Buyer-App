import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import SearchHeader from './components/header/SearchHeader';
import {useAppTheme} from '../../../utils/theme';
import ListingPage from '../../../components/productsLists/ListingPage';
import SafeAreaPage from '../../../components/page/SafeAreaPage';

interface SearchProductsProps {
  route: any;
}

const SearchProducts: React.FC<SearchProductsProps> = ({route: {params}}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState<string | ''>(
    params?.query ?? '',
  );

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
          <ListingPage searchQuery={searchQuery} subCategories={''} />
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
