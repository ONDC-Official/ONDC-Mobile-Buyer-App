import React from 'react';
import {HelperText, TextInput, Text, withTheme} from 'react-native-paper';
import {View} from 'react-native';

/**
 * Component to render input in screens
 * @param props
 * placeholder:string that will be rendered before text input has been entered
 * @returns {JSX.Element}
 * @constructor
 */
const InputField = ({required = false, label, theme, ...props}) => (
  <View>
    <TextInput
      {...props}
      mode="outlined"
      dense
      label={
        required ? (
          <Text style={{backgroundColor: 'white'}}>
            {label}
            <Text style={{color: theme.colors.red}}> *</Text>
          </Text>
        ) : (
          label
        )
      }
    />
    <HelperText padding="none" type="error" visible={props.errorMessage}>
      {props.errorMessage}
    </HelperText>
  </View>
);

export default withTheme(InputField);
