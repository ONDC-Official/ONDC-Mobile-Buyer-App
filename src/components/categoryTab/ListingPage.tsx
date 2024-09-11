import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '../../utils/theme';
import CategoryTab from './CategoryTab';
import Products from '../products/Products';
import SearchProviders from '../provider/SearchProviders';

interface ListingPage {
  searchQuery: string;
  subCategories: string;
}

const ListingPage: React.FC<ListingPage> = ({searchQuery, subCategories}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [searchType, setSearchType] = useState<string>('Stores');

  return (
    <View style={styles.pageContainer}>
      <CategoryTab searchType={searchType} setSearchType={setSearchType} />
      {searchType === 'Products' ? (
        <Products
          providerId={null}
          subCategories={[subCategories]}
          SearchText={searchQuery}
          search
          provider={null}
          isOpen
        />
      ) : (
        <SearchProviders
          searchQuery={searchQuery}
          currentSubCategory={subCategories}
        />
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
    },
  });

export default ListingPage;
