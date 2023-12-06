import React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

interface VegNonVegTag {
  tags: any[];
  showLabel?: boolean;
}

const VegNonVegTag: React.FC<VegNonVegTag> = ({tags, showLabel}) => {
  let category = 'veg';

  tags.forEach((tag: any) => {
    if (tag.code === 'veg_nonveg') {
      const vegNonVegValue = tag.list[0].value;

      if (vegNonVegValue === 'yes' || vegNonVegValue === 'Yes') {
        category = 'veg';
      } else if (vegNonVegValue === 'no') {
        category = 'nonveg';
      } else if (vegNonVegValue === 'egg') {
        category = 'egg';
      }
    }
  });

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

const styles = StyleSheet.create({
  icon: {
    width: 18,
    height: 18,
  },
  veg: {
    marginLeft: 8,
    color: '#419E6A',
  },
  nonVeg: {
    marginLeft: 8,
    color: 'red',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default VegNonVegTag;
