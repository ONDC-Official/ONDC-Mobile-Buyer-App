import React, {useState} from 'react';
import {Icon, Input} from 'react-native-elements';

/**
 * Component to render input in screens
 * @param props
 * placeholder:string that will be rendered before text input has been entered
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordField = props => {
  const [hide, setHide] = useState(true);

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
          name={hide ? 'eye' : 'eye-slash'}
          size={20}
          onPress={onPressHandler}
        />
      }
    />
  );
};

export default PasswordField;
