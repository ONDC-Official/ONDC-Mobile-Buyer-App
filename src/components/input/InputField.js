import React from 'react';
import {HelperText, TextInput} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

/**
 * Component to render input in screens
 * @param props
 * placeholder:string that will be rendered before text input has been entered
 * @returns {JSX.Element}
 * @constructor
 */
const InputField = props => (
  <View style={styles.container}>
    <TextInput {...props} mode="outlined" />
    {props.errorMessage && (
      <HelperText padding="none" type="error" visible={props.errorMessage}>
        {props.errorMessage}
      </HelperText>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {marginBottom: 12},
});

export default InputField;
