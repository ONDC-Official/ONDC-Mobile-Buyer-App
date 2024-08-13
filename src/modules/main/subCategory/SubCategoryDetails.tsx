import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {appStyles} from '../../../styles/styles';
import SubCategories from './components/SubCategories';
import Products from '../../../components/products/Products';
import useSubCategoryName from '../../../hooks/useSubCategoryName';

interface SubCategoryDetails {
  route: any;
  navigation: any;
}

const SubCategoryDetails: React.FC<SubCategoryDetails> = ({
  route: {params},
  navigation,
}) => {
  const {getSubcategoryName} = useSubCategoryName();
  const [currentSubCategory, setCurrentSubCategory] = useState(
    params.subCategory,
  );

  useEffect(() => {
    setCurrentSubCategory(params.subCategory);
  }, [params]);

  useEffect(() => {
    const name = getSubcategoryName(currentSubCategory, currentSubCategory);

    navigation.setOptions({
      title: name,
    });
  }, [navigation, currentSubCategory]);

  return (
    <View style={[appStyles.container, styles.container]}>
      <SubCategories
        currentCategory={params.category}
        currentSubCategory={currentSubCategory}
        categoryDomain={params.categoryDomain}
        setCurrentSubCategory={setCurrentSubCategory}
      />
      <Products
        providerId={null}
        subCategories={[currentSubCategory]}
        search
        provider={null}
        isOpen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
});

export default SubCategoryDetails;
