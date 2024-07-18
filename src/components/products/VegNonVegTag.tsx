import React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {getFilterCategory} from '../../utils/utils';
import {useAppTheme} from '../../utils/theme';
import {useTranslation} from 'react-i18next';

interface VegNonVegTag {
  tags: any[];
  showLabel?: boolean;
  size?: string;
}

const VegImage = require('../../assets/veg.png');
const NonVegImage = require('../../assets/non_veg.png');

const VegNonVegTag: React.FC<VegNonVegTag> = ({
  tags,
  showLabel,
  size = 'regular',
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  let category = getFilterCategory(tags);

  if (category === 'veg') {
    return (
      <View style={styles.iconRow}>
        <FastImage
          source={VegImage}
          style={size === 'regular' ? styles.icon : styles.smallIcon}
        />
        {showLabel && (
          <Text variant={'bodyMedium'} style={styles.veg}>
            {t('Cart.Veg')}
          </Text>
        )}
      </View>
    );
  } else if (category === 'nonVeg') {
    return (
      <View style={styles.iconRow}>
        <FastImage
          source={NonVegImage}
          style={size === 'regular' ? styles.icon : styles.smallIcon}
        />
        {showLabel && (
          <Text variant={'bodyMedium'} style={styles.nonVeg}>
            {t('Cart.Non Veg')}
          </Text>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.iconRow}>
        <FastImage
          source={NonVegImage}
          style={size === 'regular' ? styles.icon : styles.smallIcon}
        />
        {showLabel && (
          <Text variant={'bodyMedium'} style={styles.nonVeg}>
            {t('Cart.Egg')}
          </Text>
        )}
      </View>
    );
  }
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    icon: {
      width: 18,
      height: 18,
    },
    smallIcon: {
      width: 12,
      height: 12,
    },
    veg: {
      marginLeft: 8,
      color: colors.success,
    },
    nonVeg: {
      marginLeft: 8,
      color: colors.red,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default VegNonVegTag;
