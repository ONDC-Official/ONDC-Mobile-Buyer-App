import React from 'react';
import {Button} from 'react-native-elements';
import {appStyles} from '../../styles/styles';

/**
 * Component to render button in the screens
 *  @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ContainButton = props => {
  return <Button {...props} titleStyle={appStyles.container} />;
};

export default ContainButton;
