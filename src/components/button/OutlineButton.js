import React from 'react';
import {Button, withTheme} from 'react-native-elements';
import {StyleSheet} from 'react-native';
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
      buttonStyle={styles.buttonStyle}
      titleStyle={appStyles.container}
    />
  );
};

export default withTheme(OutlineButton);

const styles = StyleSheet.create({
  buttonStyle: {borderWidth: 1},
});
