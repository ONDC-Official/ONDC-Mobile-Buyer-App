import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

/**
 * Component to render clear button in the screens
 * @param props
 * textColor:color of title
 * onPress:function which handles click event
 * @returns {JSX.Element}
 * @constructor
 */
const ClearButton = props => {
  return (
    <Button
      title={props.title}
      onPress={props.onPress}
      type="clear"
      titleStyle={[styles.titleStyle, {color: props.textColor}]}
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
  titleStyle: {fontSize: 14},
});
