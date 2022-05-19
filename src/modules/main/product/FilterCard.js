import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Text, withTheme} from 'react-native-elements';

const FilterCard = ({theme, card, selectedFilter, name, onPress}) => {
  const {colors} = theme;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.containerStyle,
        {
          backgroundColor:
            selectedFilter === card ? colors.accentColor : colors.white,
          borderColor:
            selectedFilter === card ? colors.accentColor : colors.borderColor,
        },
      ]}>
      <Text
        style={[
          styles.text,
          {color: selectedFilter === card ? colors.white : colors.black},
        ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default withTheme(FilterCard);

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
