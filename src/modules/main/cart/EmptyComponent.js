import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {appStyles} from '../../../styles/styles';

/**
 * Component to render list empty component
 * @param message: empty list message
 * @constructor
 * @returns {JSX.Element}
 */
const EmptyComponent = ({message}) => {
  return (
    <View style={[appStyles.container, styles.container]}>
      <Text>{message}</Text>
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
});
