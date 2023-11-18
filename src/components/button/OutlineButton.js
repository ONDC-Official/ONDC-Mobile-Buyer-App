import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, withTheme} from 'react-native-paper';

const OutlineButton = ({
                         theme,
                         label,
                         onPress,
                         textColor,
                         disabled = false,
                       }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {borderColor: textColor ? textColor : theme.colors.primary},
      ]}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTheme(OutlineButton);
