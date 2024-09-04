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

  const goBack = () => {
    navigation.goBack();
  };

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
  }, [navigation, currentSubCategory]);

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
    <>
      <View
        style={[
          appStyles.container,
          styles.container,
          appStyles.backgroundWhite,
        ]}>
        <StatusBar
          backgroundColor={theme.colors.white}
          barStyle={'dark-content'}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <FastImage
              source={require('../../../assets/arrow_back.png')}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text variant={'titleLarge'} style={styles.pageTitle}>
            {currentSubCategory}
          </Text>
          <View style={styles.iconsView}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchProducts')}>
              <Image source={require('../../../assets/search_1.png')} />
            </TouchableOpacity>
            <Image source={require('../../../assets/favorite_1.png')} />
            <Image source={require('../../../assets/cart_1.png')} />
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
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
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingBottom: 16,
    },
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
    header: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      backgroundColor: colors.white,
    },
    pageTitle: {
      color: colors.neutral400,
    },
    backArrow: {
      height: 16,
      width: 16,
    },
    iconsView: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      justifyContent: 'flex-end',
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
