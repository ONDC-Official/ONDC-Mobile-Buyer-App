import React, {useState} from 'react';
import {HelperText, TextInput, withTheme} from 'react-native-paper';

/**
 * Component to render input in screens
 * @param props
 * placeholder:string that will be rendered before text input has been entered
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordField = props => {
  const [hide, setHide] = useState(true);

  return (
    <>
      <TextInput
        mode="outlined"
        {...props}
        placeholder={props.placeholder}
        secureTextEntry={hide}
        autoCapitalize={'none'}
        right={
          <TextInput.Icon
            icon={hide ? 'eye-off' : 'eye'}
            onPress={() => setHide(!hide)}
          />
        }
      />
      {props.errorMessage && (
        <HelperText type="error" visible={props.errorMessage}>
          {props.errorMessage}
        </HelperText>
      )}
    </>
  );
};

export default withTheme(PasswordField);
