import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, withTheme} from 'react-native-elements';

const SortOptionSelector = ({theme, card, selectedFilter, name, onPress}) => {
  const {colors} = theme;

  let backgroundColor = colors.white;
  let borderColor = colors.borderColor;
  let textColor = colors.black;

  if (selectedFilter === card) {
    backgroundColor = colors.accentColor;
    borderColor = colors.accentColor;
    textColor = colors.white;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.containerStyle,
        {
          backgroundColor,
          borderColor,
        },
      ]}>
      <Text style={[styles.text, {color: textColor}]}>{name}</Text>
    </TouchableOpacity>
  );
};

export default withTheme(SortOptionSelector);

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginRight: 10,
  },
  text: {fontSize: 16},
});
