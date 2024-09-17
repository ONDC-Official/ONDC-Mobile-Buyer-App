import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {appStyles} from '../../../styles/styles';
import SubCategories from './components/SubCategories';
import Header from '../../../components/header/Header';
import ListingPage from '../../../components/categoryTab/ListingPage';
import SafeAreaPage from '../../../components/header/SafeAreaPage';
import AnimationPage from '../../../components/category/AnimationPage';

interface SubCategoryDetails {
  route: any;
  navigation: any;
}

const SubCategoryDetails: React.FC<SubCategoryDetails> = ({
  route: {params},
}) => {
  const [currentSubCategory, setCurrentSubCategory] = useState(
    params.subCategory,
  );
  const styles = useMemo(() => makeStyles(), []);

  useEffect(() => {
    setCurrentSubCategory(params.subCategory);
  }, [params]);

  return (
    <SafeAreaPage>
      <View
        style={[
          appStyles.container,
          styles.container,
          appStyles.backgroundWhite,
        ]}>
        <Header label={currentSubCategory} search wishlist cart />
        <AnimationPage
          list={
            <SubCategories
              currentCategory={params.category}
              currentSubCategory={currentSubCategory}
              categoryDomain={params.categoryDomain}
              setCurrentSubCategory={setCurrentSubCategory}
            />
          }>
          <ListingPage searchQuery={''} subCategories={currentSubCategory} />
        </AnimationPage>
      </View>
    </SafeAreaPage>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      paddingBottom: 16,
    },
  });

export default SubCategoryDetails;
