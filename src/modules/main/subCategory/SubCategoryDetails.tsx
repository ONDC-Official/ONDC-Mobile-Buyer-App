import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Header from '../dashboard/components/Header';
import {appStyles} from '../../../styles/styles';
import SubCategories from './components/SubCategories';
import Products from '../../../components/products/Products';

interface SubCategoryDetails {
  route: any;
}

const SubCategoryDetails: React.FC<SubCategoryDetails> = ({
  route: {params},
}) => {
  const [currentSubCategory, setCurrentSubCategory] = useState(
    params.subCategory,
  );

  useEffect(() => {
    setCurrentSubCategory(params.subCategory);
  }, [params]);

  return (
    <View style={[appStyles.container, styles.container]}>
      <Header />
      <SubCategories
        currentSubCategory={currentSubCategory}
        category={params.category}
        setCurrentSubCategory={setCurrentSubCategory}
      />
      <Products providerId={null} customMenu={null} subCategories={[currentSubCategory]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
});

export default SubCategoryDetails;
