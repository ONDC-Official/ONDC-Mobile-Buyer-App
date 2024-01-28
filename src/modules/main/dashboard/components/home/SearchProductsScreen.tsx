import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Header from '../Header';
import SearchProducts from '../../../../../components/products/SearchProducts';

interface SearchProductsProps {
  route: any;
}

const SearchProductsScreen: React.FC<SearchProductsProps> = ({}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [searchQuery, setSearchQuery] = useState<string | ''>('');

  const onSearch = (query: string) => {
    setSearchQuery(query);
  };
  return (
    <View style={styles.container}>
      <Header
        disableAddress={true}
        onSearch={onSearch}
        backIcon={true}
        backIconPress={() => navigation.goBack()}
      />
      <SearchProducts searchQuery={searchQuery} />
    </View>
  );
};

export default SearchProductsScreen;

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
