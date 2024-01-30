import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import SearchProductList from '../../../components/products/SearchProductList';
import SearchHeader from './components/header/SearchHeader';

interface SearchProductsProps {
  route: any;
}

const SearchProducts: React.FC<SearchProductsProps> = ({}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState<string | ''>('');

  const onSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <SearchHeader
        onSearch={onSearch}
        backIconPress={() => navigation.goBack()}
      />
      <SearchProductList searchQuery={searchQuery} />
    </View>
  );
};

export default SearchProducts;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
