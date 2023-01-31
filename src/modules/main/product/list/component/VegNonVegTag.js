import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';
import {TAGS} from '../../../../../utils/Constants';
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
            ]}
          />
          <Text
            style={{
              color: colors.success,
            }}>
            {TAGS.veg}
          </Text>
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
            ]}
          />
          <Text
            style={{
              color: colors.error,
            }}>
            {TAGS.non_veg}
          </Text>
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
    borderRadius: 5,
    width: 14,
    height: 14,
    marginEnd: 8,
  },
});

export default withTheme(VegNonVegTags);
