import React from 'react';
import {HelperText, TextInput} from 'react-native-paper';
import {View} from 'react-native';

/**
 * Component to render input in screens
 * @param props
 * placeholder:string that will be rendered before text input has been entered
 * @returns {JSX.Element}
 * @constructor
 */
const InputField = props => (
  <View>
    <TextInput {...props} mode="outlined" dense />
    <HelperText padding="none" type="error" visible={props.errorMessage}>
      {props.errorMessage}
    </HelperText>
  </View>
);

export default InputField;
