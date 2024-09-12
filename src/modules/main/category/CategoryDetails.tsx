import React, {useRef, useState, useMemo, useCallback} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Categories from './components/Categories';
import SubCategories from './components/SubCategories';
import {appStyles} from '../../../styles/styles';
import {useAppTheme} from '../../../utils/theme';
import Header from '../../../components/header/Header';
import ListingPage from '../../../components/categoryTab/ListingPage';

interface CategoryDetails {
  route: any;
}

const CategoryDetails: React.FC<CategoryDetails> = ({route: {params}}) => {
  const theme = useAppTheme();
  const {t} = useTranslation();
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

  return (
    <>
      <View
        style={[
          appStyles.container,
          styles.container,
          appStyles.backgroundWhite,
        ]}>
        <Header label={t('Featured Categories.Categories')} />
        <View style={styles.subContainer}>
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
            <SubCategories
              currentCategory={params.category}
              categoryDomain={params.domain}
            />
          ) : (
            <ListingPage searchQuery={''} subCategories={params.category} />
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
    subContainer: {
      flex: 1,
      flexDirection: 'row',
    },
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
  });

export default CategoryDetails;
