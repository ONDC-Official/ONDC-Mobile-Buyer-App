import React from 'react';
import {Button} from 'react-native-elements';
import {appStyles} from '../../styles/Styles';

const ContainButton = props => {
  return <Button {...props} titleStyle={appStyles.container} />;
};

export default ContainButton;
