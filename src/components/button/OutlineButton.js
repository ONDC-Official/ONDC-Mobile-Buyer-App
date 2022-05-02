import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, withTheme} from 'react-native-elements';
import {appStyles} from '../../styles/styles';

/**
 * Component to render button in the screens
 *  @param props
 * @returns {JSX.Element}
 * @constructor
 */
const OutlineButton = props => {
  return (
    <Button
      {...props}
      type={'outline'}
      buttonStyle={[styles.buttonStyle, {borderColor: props.color}]}
      titleStyle={[appStyles.container, {color: props.color}]}
    />
  );
};

export default withTheme(OutlineButton);

const styles = StyleSheet.create({
  buttonStyle: {borderWidth: 1},
});
