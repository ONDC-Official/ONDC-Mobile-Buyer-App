import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {appStyles} from '../../../styles/styles';
import SubCategories from './components/SubCategories';
import Products from '../../../components/products/Products';
import FastImage from 'react-native-fast-image';
import {useAppTheme} from '../../../utils/theme';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import SearchProviders from '../../../components/provider/SearchProviders';
import Header from '../../../components/header/Header';
import SafeAreaPage from '../../../components/header/SafeAreaPage';

interface SubCategoryDetails {
  route: any;
  navigation: any;
}

let saveMenuStatus = true;
const screenWidth = Dimensions.get('window').width;

const SubCategoryDetails: React.FC<SubCategoryDetails> = ({
  route: {params},
  navigation,
}) => {
  const [currentSubCategory, setCurrentSubCategory] = useState(
    params.subCategory,
  );
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [searchType, setSearchType] = useState<string>('Products');

  const animated = new Animated.Value(0);
  const animated1 = new Animated.Value(0);
  const duration = 500;

  const animationExpand = useRef(new Animated.Value(screenWidth)).current;

  const inputRange = [0, screenWidth];
  const outputRange = [0, 1];
  const animatedWidthCollapse = animationExpand.interpolate({
    inputRange,
    outputRange,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animated1, {
        toValue: -screenWidth * 0.14,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(animationExpand, {
        toValue: screenWidth * 0.78,
        duration: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {});
  }, [navigation, currentSubCategory, searchType]);

  const openCloseMenu = async () => {
    if (saveMenuStatus) {
      Animated.parallel([
        Animated.timing(animated, {
          toValue: -screenWidth * 0.22,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(animated1, {
          toValue: -screenWidth * 0.22,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(animationExpand, {
          toValue: screenWidth,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => {
        saveMenuStatus = false;
      });
    } else {
      Animated.parallel([
        Animated.timing(animated, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(animated1, {
          toValue: -screenWidth * 0.14,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(animationExpand, {
          toValue: screenWidth * 0.78,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => {
        saveMenuStatus = true;
      });
    }
  };

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
          label={currentSubCategory}
          search={true}
          wishlist={true}
          cart={true}
        />
        <View style={styles.subContainer}>
          <Animated.View
            style={[
              styles.categoryView,
              {width: screenWidth * 0.22, transform: [{translateX: animated}]},
            ]}>
            <SubCategories
              currentCategory={params.category}
              currentSubCategory={currentSubCategory}
              categoryDomain={params.categoryDomain}
              setCurrentSubCategory={setCurrentSubCategory}
            />
          </Animated.View>
          <Animated.View
            style={{
              width: screenWidth,
              transform: [
                {scaleX: animatedWidthCollapse},
                {translateX: animated1},
              ],
            }}>
            <View style={styles.switchRow}>
              <View style={styles.switchContainer}>
                <TouchableOpacity
                  onPress={() => setSearchType('Products')}
                  style={[
                    styles.button,
                    searchType === 'Products' ? styles.activeButton : {},
                  ]}>
                  <Text
                    variant={'bodyMedium'}
                    style={
                      searchType === 'Products'
                        ? styles.activeButtonText
                        : styles.buttonText
                    }>
                    {t('Search.Products')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSearchType('Stores')}
                  style={[
                    styles.button,
                    searchType === 'Stores' ? styles.activeButton : {},
                  ]}>
                  <Text
                    variant={'bodyMedium'}
                    style={
                      searchType === 'Stores'
                        ? styles.activeButtonText
                        : styles.buttonText
                    }>
                    {t('Search.Stores')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
          </Animated.View>
        </View>
        <TouchableOpacity
          onPress={() => openCloseMenu()}
          style={{transform: [{translateX: animated}]}}>
          <FastImage
            source={require('../../../assets/Frame.png')}
            style={[styles.flotingButton, {marginLeft: screenWidth * 0.22}]}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaPage>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingBottom: 16,
    },
    subContainer: {flex: 1, flexDirection: 'row'},
    categoryView: {
      borderRightWidth: 1,
      borderRightColor: colors.neutral100,
    },
    flotingButton: {
      position: 'absolute',
      height: 32,
      width: 24,
      tintColor: 'red',
      bottom: 50,
    },
    switchRow: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    switchContainer: {
      borderRadius: 24,
      backgroundColor: colors.primary50,
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeButton: {
      backgroundColor: colors.primary,
      borderRadius: 24,
    },
    activeButtonText: {
      color: colors.white,
    },
    buttonText: {
      color: colors.neutral400,
    },
  });

export default SubCategoryDetails;
