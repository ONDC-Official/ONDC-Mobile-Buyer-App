import React, {useRef} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Categories from './components/Categories';
import Header from '../dashboard/components/header/Header';
import SubCategories from './components/SubCategories';
import StoresNearMe from './components/StoresNearMe';
import {appStyles} from '../../../styles/styles';
import AddressSheet from '../dashboard/components/address/AddressSheet';

interface CategoryDetails {
  route: any;
}

const CategoryDetails: React.FC<CategoryDetails> = ({route: {params}}) => {
  const addressSheet = useRef<any>();

  const openAddressList = () => {
    addressSheet.current.open();
  };

  return (
    <>
      <View style={[appStyles.container, styles.container]}>
        <Header onPress={openAddressList} allowBack />
        <ScrollView style={appStyles.container}>
          <Categories currentCategory={params.category} />
          {params.category !== 'F&B' && (
            <SubCategories
              currentCategory={params.category}
              categoryDomain={params.domain}
            />
          )}
          <StoresNearMe domain={params.domain} />
        </ScrollView>
      </View>
      <AddressSheet addressSheet={addressSheet} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
});

export default CategoryDetails;
