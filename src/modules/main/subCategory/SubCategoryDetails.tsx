import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import {appStyles} from '../../../styles/styles';
import SubCategories from './components/SubCategories';
import Products from '../../../components/products/Products';
import {useAppTheme} from '../../../utils/theme';
import SearchProviders from '../../../components/provider/SearchProviders';
import Header from '../../../components/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CategoryTab from '../../../components/products/CategoryTab';

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
  const theme = useAppTheme();
  const [searchType, setSearchType] = useState<string>('Products');
  const widthAnim = useRef(new Animated.Value(80)).current;
  const [expanded, setExpanded] = useState<boolean>(false);

  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);

  const toggleWidth = useCallback(() => {
    Animated.timing(widthAnim, {
      toValue: expanded ? 0 : 80,
      duration: 500,
      useNativeDriver: false, // Cannot use native driver for width animation
    }).start();
    setExpanded(prev => !prev);
  }, [expanded, widthAnim]);

  useEffect(() => {
    setCurrentSubCategory(params.subCategory);
  }, [params]);

  return (
    <>
      <View
        style={[
          appStyles.container,
          styles.container,
          appStyles.backgroundWhite,
        ]}>
        <Header
          label={currentSubCategory}
          search={true}
          wishlist={true}
          cart={true}
        />
        <View style={styles.subContainer}>
          <Animated.View style={[styles.categoryView, {width: widthAnim}]}>
            <SubCategories
              currentCategory={params.category}
              currentSubCategory={currentSubCategory}
              categoryDomain={params.categoryDomain}
              setCurrentSubCategory={setCurrentSubCategory}
            />
          </Animated.View>
          <View style={styles.pageContainer}>
            <CategoryTab
              searchType={searchType}
              setSearchType={setSearchType}
            />
            {searchType === 'Products' ? (
              <Products
                providerId={null}
                subCategories={[currentSubCategory]}
                search
                provider={null}
                isOpen
              />
            ) : (
              <SearchProviders searchQuery={''} />
            )}
            <TouchableOpacity
              style={styles.collapsibleButton}
              onPress={toggleWidth}>
              <Icon
                name={'keyboard-arrow-left'}
                size={20}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingBottom: 16,
    },
    pageContainer: {
      flex: 1,
    },
    subContainer: {flex: 1, flexDirection: 'row'},
    categoryView: {
      borderRightWidth: 1,
      borderRightColor: colors.neutral100,
    },
    collapsibleButton: {
      position: 'absolute',
      height: 32,
      width: 24,
      backgroundColor: colors.neutral400,
      bottom: 50,
      borderTopRightRadius: 27,
      borderBottomRightRadius: 27,
      alignItems: 'center',
      justifyContent: 'center',
    },
    switchRow: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    switchContainer: {
      height: 28,
      width: 168,
      borderRadius: 39,
      backgroundColor: colors.primary50,
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      width: 84,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeButton: {
      backgroundColor: colors.primary,
      borderRadius: 39,
    },
    activeButtonText: {
      color: colors.white,
    },
    buttonText: {
      color: colors.neutral400,
    },
  });

export default SubCategoryDetails;
