import React, {useMemo, useState} from 'react';
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

  const isStore = useMemo(() => {
    return searchType === 'Stores';
  }, [searchType]);

  return (
    <View style={styles.pageContainer}>
      <ListingTab isStore={isStore} setSearchType={setSearchType} />
      {isStore ? (
        <SearchProviders
          searchQuery={searchQuery}
          currentSubCategory={subCategories}
        />
      ) : (
        <Products
          providerId={null}
          subCategories={[subCategories]}
          searchText={searchQuery}
          provider={null}
          isOpen={true}
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
