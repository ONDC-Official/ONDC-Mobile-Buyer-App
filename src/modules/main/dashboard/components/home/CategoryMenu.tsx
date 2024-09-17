import Draggable from 'react-native-draggable';
import React, {useCallback, useMemo} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CATEGORIES} from '../../../../../utils/categories';

const CategoryMenu = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const {screenWidth, screenHeight} = useMemo(() => {
    return {
      screenWidth: Dimensions.get('screen').width,
      screenHeight: Dimensions.get('screen').height,
    };
  }, []);

  const navigateToCategoryDetails = useCallback(() => {
    navigation.navigate('CategoryDetails', {
      category: CATEGORIES[0].shortName,
      domain: CATEGORIES[0].domain,
    });
  }, [navigation]);

  return (
    <Draggable
      touchableOpacityProps={{activeOpacity: 1}}
      renderSize={68}
      x={screenWidth - 56}
      y={screenHeight * 0.7}
      imageSource={require('../../../../../assets/dashboard/categories.png')}
      isCircle
      onShortPressRelease={navigateToCategoryDetails}
    />
  );
};

export default CategoryMenu;
