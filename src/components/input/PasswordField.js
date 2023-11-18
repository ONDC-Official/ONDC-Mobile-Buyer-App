import React, {useState} from 'react';
import {HelperText, Text, TextInput, withTheme} from 'react-native-paper';

/**
 * Component to render input in screens
 * @param props
 * placeholder:string that will be rendered before text input has been entered
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordField = ({required = false, label, theme, ...props}) => {
  const [hide, setHide] = useState(true);

  return (
    <>
      <TextInput
        mode="outlined"
        {...props}
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
        placeholder={props.placeholder}
        secureTextEntry={hide}
        autoCapitalize={'none'}
        right={
          <TextInput.Icon
            icon={hide ? 'eye-off' : 'eye'}
            onPress={() => setHide(!hide)}
          />
        }
        dense
      />
      <HelperText padding="none" type="error" visible={props.errorMessage}>
        {props.errorMessage}
      </HelperText>
    </>
  );
};

export default withTheme(PasswordField);
