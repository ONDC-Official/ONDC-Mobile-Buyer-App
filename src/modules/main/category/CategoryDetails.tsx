import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Categories from './components/Categories';
import SubCategories from './components/SubCategories';
import {appStyles} from '../../../styles/styles';
import Header from '../../../components/header/HeaderWithActions';
import ListingPage from '../../../components/productsLists/ListingPage';
import SafeAreaPage from '../../../components/page/SafeAreaPage';
import AnimationPage from '../../../components/category/AnimationPage';

interface CategoryDetails {
  route: any;
}

const CategoryDetails: React.FC<CategoryDetails> = ({route: {params}}) => {
  const {t} = useTranslation();

  const styles = useMemo(() => makeStyles(), []);

  return (
    <SafeAreaPage>
      <View
        style={[
          appStyles.container,
          styles.container,
          appStyles.backgroundWhite,
        ]}>
        <Header label={t('Featured Categories.Categories')} />
        <AnimationPage list={<Categories currentCategory={params.category} />}>
          {params.category !== 'F&B' ? (
            <SubCategories
              currentCategory={params.category}
              categoryDomain={params.domain}
            />
          ) : (
            <ListingPage searchQuery={''} subCategories={params.category} />
          )}
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

export default CategoryDetails;
