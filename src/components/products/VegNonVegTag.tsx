import React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {getFilterCategory} from '../../utils/utils';
import {useAppTheme} from '../../utils/theme';

interface VegNonVegTag {
  tags: any[];
  showLabel?: boolean;
}

const VegNonVegTag: React.FC<VegNonVegTag> = ({tags, showLabel}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  let category = getFilterCategory(tags);

  if (category === 'veg') {
    return (
      <View style={styles.iconRow}>
        <FastImage
          source={require('../../assets/veg.png')}
          style={styles.icon}
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
          style={styles.icon}
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
          style={styles.icon}
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
