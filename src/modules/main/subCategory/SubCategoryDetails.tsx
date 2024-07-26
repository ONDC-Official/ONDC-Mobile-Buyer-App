import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {appStyles} from '../../../styles/styles';
import SubCategories from './components/SubCategories';
import Products from '../../../components/products/Products';
import Page from '../../../components/page/Page';

interface SubCategoryDetails {
  route: any;
  navigation: any;
}

const SubCategoryDetails: React.FC<SubCategoryDetails> = ({
  route: {params},
  navigation,
}) => {
  const {t} = useTranslation();
  const [currentSubCategory, setCurrentSubCategory] = useState(
    params.subCategory,
  );

  useEffect(() => {
    setCurrentSubCategory(params.subCategory);
  }, [params]);

  useEffect(() => {
    navigation.setOptions({
      title: t(`Product SubCategories.${params.subCategory}`),
    });
  }, [navigation]);

  return (
    <Page>
      <View style={[appStyles.container, styles.container]}>
        <SubCategories
          currentSubCategory={currentSubCategory}
          category={params.category}
          setCurrentSubCategory={setCurrentSubCategory}
        />
        <Products
          providerId={null}
          subCategories={[currentSubCategory]}
          search
          provider={null}
        />
      </View>
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
});

export default SubCategoryDetails;
