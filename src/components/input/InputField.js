import React from 'react';
import {Input} from 'react-native-elements';

//TODO: Documentation is missing
const InputField = props => {
  return <Input {...props} placeholder={props.placeholder} />;
};

export default InputField;
