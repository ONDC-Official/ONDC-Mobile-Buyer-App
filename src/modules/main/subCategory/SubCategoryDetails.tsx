import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Easing, StyleSheet, TouchableOpacity, View} from 'react-native';
import {appStyles} from '../../../styles/styles';
import SubCategories from './components/SubCategories';
import Products from '../../../components/products/Products';
import useSubCategoryName from '../../../hooks/useSubCategoryName';
import FastImage from 'react-native-fast-image';
import {useAppTheme} from '../../../utils/theme';

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
  const {getSubcategoryName} = useSubCategoryName();
  const [currentSubCategory, setCurrentSubCategory] = useState(
    params.subCategory,
  );
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  const animated = new Animated.Value(0);
  const animated1 = new Animated.Value(0);
  const duration = 500;

  const animationExpand = useRef(
    new Animated.Value(screenWidth),
  ).current;

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
    Animated.timing(animated1, {
      toValue: -screenWidth * 0.22,
      duration: duration,
      useNativeDriver: true,
    })
  },[])

  const openCloseMenu = async () => {
    console.log('openMenu : ', saveMenuStatus);
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
          toValue: -screenWidth * 0.11,
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

  useEffect(() => {
    const name = getSubcategoryName(currentSubCategory, currentSubCategory);

    navigation.setOptions({
      title: name,
    });
  }, [navigation, currentSubCategory]);

  return (
    <>
      <View
        style={[
          appStyles.container,
          styles.container,
          appStyles.backgroundWhite,
        ]}>
        {/* <StatusBar
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
            Categories
          </Text>
        </View> */}
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
              width: screenWidth * 0.96,
              transform: [
                {scaleX: animatedWidthCollapse},
                {translateX: animated1},
              ],
            }}>
            <Products
              providerId={null}
              subCategories={[currentSubCategory]}
              search
              provider={null}
              isOpen
            />
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
    // <View style={[appStyles.container, styles.container]}>
    //   <SubCategories
    //     currentCategory={params.category}
    //     currentSubCategory={currentSubCategory}
    //     categoryDomain={params.categoryDomain}
    //     setCurrentSubCategory={setCurrentSubCategory}
    //   />
    //   <Products
    //     providerId={null}
    //     subCategories={[currentSubCategory]}
    //     search
    //     provider={null}
    //     isOpen
    //   />
    // </View>
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
});

export default SubCategoryDetails;
