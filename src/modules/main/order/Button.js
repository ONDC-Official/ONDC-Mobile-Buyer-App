import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';

const Button = ({
                  title,
                  borderColor,
                  backgroundColor,
                  onPress,
                  color,
                  loader,
                }) => {
  return (
    <TouchableOpacity
      style={[
        styles.clearCartButton,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
      ]}
      onPress={onPress}>
      <Text style={[styles.text, {color: color}]}>{title}</Text>
      {loader && (
        <ActivityIndicator showLoading={loader} color={color} size={14}/>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  text: {fontSize: 16, marginRight: 5},
  clearCartButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
