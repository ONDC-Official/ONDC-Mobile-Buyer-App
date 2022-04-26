import React from 'react';
import {Button, withTheme} from 'react-native-elements';
import {appStyles} from '../../styles/styles';

/**
 * Component to render button in the screens
 *  @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ContainButton = props => {
  const {colors} = props.theme;
  return (
    <Button
      {...props}
      titleStyle={[
        appStyles.container,
        {color: props.color ? props.color : colors.white},
      ]}
      buttonStyle={{
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : colors.accentColor,
      }}
    />
  );
};

export default withTheme(ContainButton);
