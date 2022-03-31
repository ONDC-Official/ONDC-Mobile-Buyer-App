import React from "react";
import {Input} from "react-native-elements"


const InputField=(props)=>{
    return(
      <Input {...props} placeholder={props.placeholder}/>
    )
}

export default InputField;