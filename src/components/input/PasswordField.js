import React, {useState} from 'react';
import {Icon, Input, withTheme} from 'react-native-elements';

/**
 * Component to render input in screens
 * @param props
 * placeholder:string that will be rendered before text input has been entered
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordField = props => {
  const [hide, setHide] = useState(true);
  const {colors} = props.theme;

  /**
   * Function is used to set visibility of password
   */
  const onPressHandler = () => setHide(!hide);

  return (
    <Input
      {...props}
      placeholder={props.placeholder}
      secureTextEntry={hide}
      rightIcon={
        <Icon
          type="font-awesome"
          name={hide ? 'eye-slash' : 'eye'}
          size={20}
          color={colors.accentColor}
          onPress={onPressHandler}
        />
      }
    />
  );
};

export default withTheme(PasswordField);
