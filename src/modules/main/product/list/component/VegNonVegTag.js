import {StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-paper';
import React from 'react';

const VegNonVegTags = ({list = null, theme}) => {
  const {colors} = theme;

  if (list) {
    if (list.hasOwnProperty('veg') && list.veg === 'yes') {
      return (
        <View style={styles.tag}>
          <View
            style={[
              styles.tagCircle,
              {
                borderColor: colors.success,
              },
            ]}>
            <View
              style={[
                styles.innerCircleStyle,
                {backgroundColor: colors.success},
              ]}></View>
          </View>
        </View>
      );
    } else if (list.hasOwnProperty('non_veg') && list.non_veg === 'yes') {
      return (
        <View style={styles.tag}>
          <View
            style={[
              styles.tagCircle,
              {
                borderColor: colors.error,
              },
            ]}>
            <View
              style={[
                styles.innerCircleStyle,
                {backgroundColor: colors.error},
              ]}></View>
          </View>
        </View>
      );
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  tagCircle: {
    borderWidth: 2,
    borderRadius: 1,
    width: 16,
    height: 16,
    marginEnd: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircleStyle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    padding: 3,
  },
});

export default withTheme(VegNonVegTags);
