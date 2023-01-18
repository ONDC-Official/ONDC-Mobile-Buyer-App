import React from 'react';
import {Button, withTheme} from 'react-native-paper';

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
    <Button onPress={props.onPress} mode="text" loading={props.loading}>
      {props.title}
    </Button>
  );
};

export default withTheme(ClearButton);
