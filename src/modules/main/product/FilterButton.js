import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {appStyles} from '../../../styles/styles';

const FilterButton = ({theme, name, selectedCard, onPress}) => {
  const {colors} = theme;
  return (
    <View style={appStyles.container}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor:
              selectedCard === name ? colors.primary : colors.backgroundColor,
            borderColor:
              selectedCard === name ? colors.primary : colors.borderColor,
          },
        ]}
        onPress={onPress}>
        <Text
          style={{color: selectedCard === name ? colors.white : colors.black}}>
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
