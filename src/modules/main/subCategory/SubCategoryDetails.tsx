import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {appStyles} from '../../../styles/styles';
import SubCategories from './components/SubCategories';
import Header from '../../../components/header/HeaderWithActions';
import ListingPage from '../../../components/categoryTab/ListingPage';
import SafeAreaPage from '../../../components/page/SafeAreaPage';
import AnimationPage from '../../../components/category/AnimationPage';

interface SubCategoryDetails {
  route: any;
  navigation: any;
}

const SubCategoryDetails: React.FC<SubCategoryDetails> = ({
  route: {params},
}) => {
  const {t} = useTranslation();
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
        <Header
          label={t(`Featured Categories.${params.category}`)}
          search
          wishlist
          cart
        />
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
