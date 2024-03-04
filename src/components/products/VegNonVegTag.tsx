import React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {getFilterCategory} from '../../utils/utils';
import {useAppTheme} from '../../utils/theme';

interface VegNonVegTag {
  tags: any[];
  showLabel?: boolean;
  size?: string;
}

const VegNonVegTag: React.FC<VegNonVegTag> = ({
  tags,
  showLabel,
  size = 'regular',
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  let category = getFilterCategory(tags);

  if (category === 'veg') {
    return (
      <View style={styles.iconRow}>
        <FastImage
          source={require('../../assets/veg.png')}
          style={size === 'regular' ? styles.icon : styles.smallIcon}
        />
        {showLabel && (
          <Text variant={'bodyMedium'} style={styles.veg}>
            Veg
          </Text>
        )}
      </View>
    );
  } else if (category === 'nonVeg') {
    return (
      <View style={styles.iconRow}>
        <FastImage
          source={require('../../assets/non_veg.png')}
          style={size === 'regular' ? styles.icon : styles.smallIcon}
        />
        {showLabel && (
          <Text variant={'bodyMedium'} style={styles.nonVeg}>
            Non Veg
          </Text>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.iconRow}>
        <FastImage
          source={require('../../assets/non_veg.png')}
          style={size === 'regular' ? styles.icon : styles.smallIcon}
        />
        {showLabel && (
          <Text variant={'bodyMedium'} style={styles.nonVeg}>
            Egg
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
