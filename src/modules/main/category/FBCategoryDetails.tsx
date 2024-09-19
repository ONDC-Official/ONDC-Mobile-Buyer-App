import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {appStyles} from '../../../styles/styles';
import ListingPage from '../../../components/productsLists/ListingPage';
import SafeAreaPage from '../../../components/page/SafeAreaPage';
import {FB_SHORT_NAME} from '../../../utils/constants';
import HeaderWithActions from '../../../components/header/HeaderWithActions';
import CategoryMenu from '../dashboard/components/home/CategoryMenu';

interface FBCategoryDetails {}

const FBCategoryDetails: React.FC<FBCategoryDetails> = () => {
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
        <HeaderWithActions
          label={t('Featured Categories.Food & Beverage')}
          cart
          search
          wishlist
        />
        <ListingPage searchQuery={''} subCategories={FB_SHORT_NAME} />
        <CategoryMenu />
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

export default FBCategoryDetails;
