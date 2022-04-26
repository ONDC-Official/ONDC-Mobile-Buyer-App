import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {appStyles} from '../../../styles/styles';

/**
 * Component to show filter buttons in the header of product screen
 * @param name:name of the card
 * @param selectedCard:filter button selected by user
 * @param onPress:function handles click event of filter button
 * @constructor
 * @returns {JSX.Element}
 */
const FilterButton = ({theme, name, selectedCard, onPress}) => {
  const {colors} = theme;
  return (
    <View style={appStyles.container}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor:
              selectedCard === name
                ? colors.accentColor
                : colors.backgroundColor,
            borderColor:
              selectedCard === name ? colors.accentColor : colors.borderColor,
          },
        ]}
        onPress={onPress}>
        <Text
          style={{
            color: selectedCard === name ? colors.white : colors.black,
          }}>
          {name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default withTheme(FilterButton);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
  },
});
