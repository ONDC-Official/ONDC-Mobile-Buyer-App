import React from 'react';
import {Input} from 'react-native-elements';

/**
 * Component to render input in screens
 * @param props
 * placeholder:string that will be rendered before text input has been entered
 * @returns {JSX.Element}
 * @constructor
 */
const InputField = props => (
  <Input {...props} placeholder={props.placeholder}/>
);

export default InputField;
