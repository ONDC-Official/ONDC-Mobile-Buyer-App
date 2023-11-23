import React from 'react';
import {ScrollView} from 'react-native';
import {withTheme} from 'react-native-paper';
import Categories from './components/Categories';
import Header from '../dashboard/components/Header';
import SubCategories from './components/SubCategories';
import StoresNearMe from './components/StoresNearMe';

interface CategoryDetails {
  route: any;
}

const CategoryDetails: React.FC<CategoryDetails> = ({route: {params}}) => {
  return (
    <>
      <Header />
      <ScrollView>
        <Categories currentCategory={params.category} />
        <SubCategories currentCategory={params.category} />
        <StoresNearMe domain={params.domain} />
      </ScrollView>
    </>
  );
};

export default withTheme(CategoryDetails);
