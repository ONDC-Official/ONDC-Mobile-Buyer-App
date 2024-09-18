import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ListingTab from './ListingTab';
import Products from '../products/Products';
import SearchProviders from '../provider/SearchProviders';

interface ListingPage {
  searchQuery: string;
  subCategories: string;
}

const ListingPage: React.FC<ListingPage> = ({searchQuery, subCategories}) => {
  const styles = makeStyles();
  const [searchType, setSearchType] = useState<string>('Stores');

  return (
    <View style={styles.pageContainer}>
      <ListingTab
        isStore={searchType === 'Stores'}
        setSearchType={setSearchType}
      />
      {searchType === 'Products' ? (
        <Products
          providerId={null}
          subCategories={[subCategories]}
          searchText={searchQuery}
          provider={null}
          isOpen={true}
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

const makeStyles = () =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
    },
  });

export default ListingPage;
