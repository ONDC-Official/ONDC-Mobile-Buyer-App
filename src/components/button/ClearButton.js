import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {Button} from "react-native-elements"




const ClearButton=(props)=>{
    return(
        <Button
        title={props.title}
        onPress={props.onPress}
        type="clear"
        titleStyle={{color: props.textColor}}
        buttonStyle={styles.buttonStyle}
        loading={props.loading}
      />
    )
}


export default ClearButton;

const styles = StyleSheet.create({
    buttonStyle: {
      padding: 0,
    },
  });
  