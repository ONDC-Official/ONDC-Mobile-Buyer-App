import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, withTheme} from 'react-native-elements';
import {appStyles} from '../../styles/styles';

/**
 * Component to render button in the screens
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ContainButton = props => {
  const {colors} = props.theme;
  const border = {borderWidth: props.borderColor ? 1 : 0};
  return (
    <Button
      {...props}
      titleStyle={[
        appStyles.container,
        {color: props.color ? props.color : colors.white},
      ]}
      buttonStyle={[
        styles.buttonStyle,
        border,
        {
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : colors.accentColor,
          borderColor: props.borderColor
            ? props.borderColor
            : props.backgroundColor
            ? props.backgroundColor
            : colors.accentColor,
        },
      ]}
    />
  );
};

export default withTheme(ContainButton);

const styles = StyleSheet.create({
  buttonStyle: {borderRadius: 4},
});
