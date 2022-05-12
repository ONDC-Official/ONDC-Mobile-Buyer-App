import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Text, withTheme} from 'react-native-elements';

const FilterCard = ({theme, card, selectedPriceFilter, name, onPress}) => {
  const {colors} = theme;
  return (
    <Card
      containerStyle={[
        styles.containerStyle,
        {
          backgroundColor:
            selectedPriceFilter === card ? colors.accentColor : colors.white,
          borderColor:
            selectedPriceFilter === card
              ? colors.accentColor
              : colors.borderColor,
        },
      ]}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={[
            styles.text,
            {color: selectedPriceFilter === card ? colors.white : colors.black},
          ]}>
          {name}
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

export default withTheme(FilterCard);

const styles = StyleSheet.create({
  containerStyle: {
    marginLeft: 0,
    marginTop: 5,
    borderRadius: 8,
    paddingVertical: 8,
  },
  text: {fontSize: 16},
});
