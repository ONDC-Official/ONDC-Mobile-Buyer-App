import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';
import {appStyles} from '../../../../../styles/styles';

/**
 * Component to render list empty component
 * @param message: empty list message
 * @constructor
 * @returns {JSX.Element}
 */
const EmptyComponent = ({message}) => (
  <View style={[appStyles.container, styles.container]}>
    <Text>{message}</Text>
  </View>
);

export default withTheme(EmptyComponent);

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
});
