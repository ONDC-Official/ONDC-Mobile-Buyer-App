import React from 'react';
//TODO: Remove unused import
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';

//TODO: Documentation is missing
const ClearButton = props => {
  return (
    <Button
      title={props.title}
      onPress={props.onPress}
      type="clear"
      titleStyle={{color: props.textColor}}
      buttonStyle={styles.buttonStyle}
      loading={props.loading}
    />
  );
};

export default ClearButton;

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 0,
  },
});
