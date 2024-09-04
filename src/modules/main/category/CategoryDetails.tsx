import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Categories from './components/Categories';
import SubCategories from './components/SubCategories';
import {appStyles} from '../../../styles/styles';
import {useAppTheme} from '../../../utils/theme';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

interface CategoryDetails {
  route: any;
}

let saveMenuStatus = true;

const screenWidth = Dimensions.get('window').width;

const CategoryDetails: React.FC<CategoryDetails> = ({route: {params}}) => {
  const theme = useAppTheme();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const styles = makeStyles(theme.colors);
  const [openMenu, setOpenMenu] = useState(false);

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
  }, [navigation, params.category]);

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
            {t('Featured Categories.Categories')}
          </Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Animated.View
            style={[
              styles.categoryView,
              {width: screenWidth * 0.22, transform: [{translateX: animated}]},
            ]}>
            <Categories currentCategory={params.category} />
          </Animated.View>
          <Animated.View
            style={{
              width: screenWidth,
              transform: [
                {scaleX: animatedWidthCollapse},
                {translateX: animated1},
              ],
            }}>
            {params.category !== 'F&B' && (
              <SubCategories
                currentCategory={params.category}
                categoryDomain={params.domain}
              />
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

export default CategoryDetails;
