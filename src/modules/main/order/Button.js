import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';

/**
 * Component to render button in order history card
 * @param title :text to display inside the button
 * @param borderColor:color of border
 * @param backgroundColor:background color of button
 * @param onPress:function which handles click event of button
 * @param color:color of title
 * @param loader:prop to display loader
 * @constructor
 * @returns {JSX.Element}
 */
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
